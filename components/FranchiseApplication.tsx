"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import hubSchema from "@/infra/cpanel-hub-franchise/application-schema.json";
import pointSchema from "@/infra/cpanel-hub-franchise/point-application-schema.json";
import catalog from "@/infra/cpanel-hub-franchise/hub-catalog.json";
import { HUB_FRANCHISE_CPANEL_URL } from "@/lib/hubFranchise";
import { POINT_FRANCHISE_CPANEL_URL } from "@/lib/pointFranchise";

type Lang = "en" | "si";
type Copy = { en: string; si: string };
type Answer = string | string[] | boolean;
type Answers = Record<string, Answer>;
type Field = Copy & {
  key: string;
  number?: string;
  type: string;
  optional?: boolean;
  max?: number;
  options?: (Copy & { value: string })[];
};
type FormError = Copy & { key?: string };
type Section = Copy & { id: number; fields: Field[] };
const hubSections: Section[] = hubSchema.sections;
const pointSections: Section[] = pointSchema.sections;
const button = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep disabled:opacity-40";
const input = "block min-h-12 w-full min-w-0 scroll-mt-24 rounded-xl border border-ink/35 bg-white px-3 py-2.5 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep aria-invalid:border-brand-deep";
const links = "font-semibold underline decoration-current underline-offset-4 hover:text-brand-deep";
const districtNames: Record<string, string> = {
  Ampara: "අම්පාර", Anuradhapura: "අනුරාධපුර", Badulla: "බදුල්ල", Batticaloa: "මඩකලපුව",
  Colombo: "කොළඹ", Galle: "ගාල්ල", Gampaha: "ගම්පහ", Hambantota: "හම්බන්තොට",
  Jaffna: "යාපනය", Kalutara: "කළුතර", Kandy: "මහනුවර", Kegalle: "කෑගල්ල",
  Kilinochchi: "කිලිනොච්චිය", Kurunegala: "කුරුණෑගල", Mannar: "මන්නාරම", Matale: "මාතලේ",
  Matara: "මාතර", Monaragala: "මොනරාගල", Mullaitivu: "මුලතිව්", "Nuwara Eliya": "නුවර එළිය",
  Polonnaruwa: "පොළොන්නරුව", Puttalam: "පුත්තලම", Ratnapura: "රත්නපුර",
  Trincomalee: "ත්‍රිකුණාමලය", Vavuniya: "වවුනියාව",
};
const hubs = [...catalog.hubs].sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name));

function show(lang: Lang, en: string, si: string) {
  return lang === "si" ? si : en;
}

function Text({ lang, en, si }: Copy & { lang: Lang }) {
  return lang === "si" ? <span lang="si">{si}</span> : <span lang="en">{en}</span>;
}

function startAnswers(sections: Section[]): Answers {
  return Object.fromEntries(sections.flatMap(({ fields }) => fields.map(({ key, type }) => [key, type === "multi" ? [] : type === "consent" ? false : ""])));
}

function sriLankaToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date()).filter(({ type }) => type !== "literal")
    .reduce<Record<string, string>>((parts, { type, value }) => ({ ...parts, [type]: value }), {});
}

function validate(field: Field, answers: Answers): FormError | undefined {
  const value = answers[field.key];
  if (!field.optional && (!value || (typeof value === "string" && !value.trim()) || (Array.isArray(value) && !value.length))) {
    return { key: field.key, en: `Required: ${field.en}.`, si: `අවශ්‍යයි: ${field.si}.` };
  }
  if (field.type === "tel" && typeof value === "string" && value.trim() && !/^\+?\d[\d ()-]{6,30}$/.test(value.trim())) {
    return { key: field.key, en: "Enter a valid phone number.", si: "වලංගු දුරකථන අංකයක් ඇතුළත් කරන්න." };
  }
  if (field.key === "secondPreferredPoint" && String(value).trim() && String(value).trim().toLowerCase() === String(answers.firstPreferredPoint).trim().toLowerCase()) {
    return { key: field.key, en: "Choose a different town or leave this blank.", si: "වෙනත් නගරයක් තෝරන්න හෝ මෙය හිස්ව තබන්න." };
  }
  if (field.type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return { key: field.key, en: "Enter a valid email address.", si: "වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න." };
  }
}

function StepFields({ field, value, answers, lang, error, onChange }: {
  field: Field; value: Answer; answers: Answers; lang: Lang; error: boolean;
  onChange: (value: Answer) => void;
}) {
  const [query, setQuery] = useState("");
  const id = `hub-${field.key}`;
  const label = <><Text lang={lang} en={field.en} si={field.si} />{field.optional && <span className="ml-2 text-sm font-medium text-ink/65"><Text lang={lang} en="Optional" si="විකල්ප" /></span>}</>;
  const fieldProps = { id, "aria-invalid": error || undefined, "aria-describedby": error ? "hub-error" : undefined };
  const stringValue = typeof value === "string" ? value : "";
  const name = (d: string) => show(lang, d, districtNames[d] ?? d);
  const isHub = field.key === "firstPreferredHub" || field.key === "secondPreferredHub";
  const districts = field.key === "firstPreferredHub"
    ? [String(answers.preferredDistrict)]
    : catalog.districts;
  const awaitingDistrict = field.key === "firstPreferredHub" && !answers.preferredDistrict;
  const hubResults = hubs.filter((hub) =>
    districts.includes(hub.district) &&
    (field.key !== "secondPreferredHub" || hub.name !== answers.firstPreferredHub) &&
    (hub.name === value || `${hub.name} ${hub.district} ${districtNames[hub.district]}`.toLowerCase().includes(query.trim().toLowerCase())),
  );

  if (field.type === "choice" || field.type === "multi") {
    return (
      <fieldset className="min-w-0" aria-describedby={fieldProps["aria-describedby"]}>
        <legend className="mb-3 font-bold">{label}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options?.map((option, i) => {
            const multiple = Array.isArray(value);
            const checked = multiple ? value.includes(option.value) : value === option.value;
            return (
              <label key={option.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-ink/25 p-3 text-sm font-semibold has-checked:border-brand-deep has-checked:bg-brand-soft/30 hover:bg-mist">
                <input {...(i === 0 ? fieldProps : {})} type={multiple ? "checkbox" : "radio"} name={field.key} value={option.value}
                  className="size-5 shrink-0 accent-brand-deep" checked={checked} onChange={() => {
                    if (!multiple) onChange(option.value);
                    else if (checked) onChange(value.filter((item) => item !== option.value));
                    else onChange(option.value === "None" ? ["None"] : [...value.filter((item) => item !== "None"), option.value]);
                  }} />
                <span><Text lang={lang} {...option} /></span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (field.type === "consent") {
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/25 p-4 font-semibold hover:bg-mist">
        <input {...fieldProps} type="checkbox" required className="mt-0.5 size-5 shrink-0 accent-brand-deep" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }

  return (
    <div className="min-w-0 space-y-2">
      <label className="block font-bold" htmlFor={id}>{label}</label>
      {awaitingDistrict && <p className="text-sm text-ink/70"><Text lang={lang} en="Choose your preferred district first." si="පළමුව කැමති දිස්ත්‍රික්කය තෝරන්න." /></p>}
      {field.key === "secondPreferredHub" && <p className="text-sm text-ink/70"><Text lang={lang} en="You can choose a hub from any district." si="ඕනෑම දිස්ත්‍රික්කයක Hub එකක් තෝරාගත හැකිය." /></p>}
      {isHub && !awaitingDistrict && (
        <div>
          <label htmlFor={`${id}-search`} className="mb-1 block text-sm text-ink/70"><Text lang={lang} en="Filter by hub name or district" si="Hub නම හෝ දිස්ත්‍රික්කය අනුව සොයන්න" /></label>
          <input id={`${id}-search`} type="search" className={input} value={query} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} onChange={(e) => setQuery(e.target.value)} />
          {hubResults.length === 0 && <p role="status" className="mt-2 text-sm"><Text lang={lang} en="No matching hubs." si="ගැළපෙන Hub හමු නොවීය." /></p>}
        </div>
      )}
      {field.type === "location" ? (
        <select {...fieldProps} className={input} value={stringValue} disabled={awaitingDistrict} required={!field.optional} onChange={(e) => { onChange(e.target.value); setQuery(""); }}>
          <option value="">{show(lang, "Choose an option", "විකල්පයක් තෝරන්න")}</option>
          {isHub ? districts.map((district) => {
            const matches = hubResults.filter((hub) => hub.district === district);
            return matches.length > 0 && (
              <optgroup key={district} label={name(district)}>
                {matches.map((hub) => <option key={hub.name} value={hub.name} lang="en">{hub.name}</option>)}
              </optgroup>
            );
          }) : catalog.districts.map((d) => <option key={d} value={d}>{name(d)}</option>)}
        </select>
      ) : field.type === "textarea" ? (
        <textarea {...fieldProps} rows={5} className={input} maxLength={field.max} required={!field.optional} value={stringValue} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...fieldProps} type={field.type} className={input} maxLength={field.max} required={!field.optional} value={stringValue}
          autoComplete={({ fullName: "name", mobileNumber: "tel", email: "email", residentialTown: "address-level2" } as Record<string, string>)[field.key]}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export default function FranchiseApplication({
  kind = "hub",
  lang: controlledLang,
  onLangChange,
}: {
  kind?: "hub" | "point";
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
}) {
  const isHub = kind === "hub";
  const sections = isHub ? hubSections : pointSections;
  const schema = isHub ? hubSchema : pointSchema;
  const reviewStep = sections.length;
  const declarationStep = reviewStep + 1;
  const [answers, setAnswers] = useState(() => startAnswers(sections));
  const [internalLang, setInternalLang] = useState<Lang>("en");
  const lang = controlledLang ?? internalLang;
  const noticeHref = `/dealers/${isHub ? "hub-franchise" : "point"}/application-notice?lang=${lang}`;
  const setLang = (next: Lang) => {
    setInternalLang(next);
    onLangChange?.(next);
  };
  const [step, setStep] = useState(1);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<FormError>();
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: string; town?: string }>();
  const heading = useRef<HTMLHeadingElement>(null);
  const header = useRef<HTMLElement>(null);
  const [attempt, setAttempt] = useState<string | null>(null);
  const sending = useRef(false);
  const lastStep = useRef(1);
  const section = step === reviewStep ? null : sections[step === declarationStep ? reviewStep - 1 : step - 1];

  useEffect(() => {
    const key = isHub ? "redcat_hub_franchise_draft_v1" : "redcat_point_franchise_draft_v1";
    try { sessionStorage.removeItem(key); } catch { /* Storage may be unavailable. */ }
  }, [isHub]);

  useEffect(() => {
    const stepChanged = lastStep.current !== step;
    lastStep.current = step;
    if (!error && !stepChanged && !receipt) return;
    const target = error?.key ? document.getElementById(`hub-${error.key}`) : error ? document.getElementById("hub-error") : heading.current;
    target?.focus({ preventScroll: true });
    const scrollTarget = target === heading.current ? header.current : target;
    scrollTarget?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [step, error, receipt]);

  function update(field: Field, value: Answer) {
    if (error?.key === field.key) setError(undefined);
    setAnswers((previous) => {
      const next = { ...previous, [field.key]: value, agreePrivacyTerms: false, agreeContact: false };
      if (field.type === "consent" || step === declarationStep) return { ...previous, [field.key]: value };
      if (isHub && field.key === "preferredDistrict") next.firstPreferredHub = "";
      if (field.key === "firstPreferredHub" && value === previous.secondPreferredHub) next.secondPreferredHub = "";
      return next;
    });
  }

  function go(nextStep: number) {
    setError(undefined);
    setStep(nextStep);
  }

  function advance() {
    const invalid = section?.fields.map((field) => validate(field, answers)).find(Boolean);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (step === reviewStep) {
      if (isHub) {
        const { year, month, day } = sriLankaToday();
        setAnswers((previous) => ({
          ...previous,
          applicantName: previous.applicantName || previous.fullName,
          declarationDate: previous.declarationDate || `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        }));
      }
      go(declarationStep);
    } else {
      const nextStep = editing ? reviewStep : step + 1;
      setEditing(false);
      go(nextStep);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    if (step !== declarationStep) {
      advance();
      return;
    }

    for (const item of sections) {
      const invalid = item.fields.map((field) => validate(field, answers)).find(Boolean);
      if (invalid) {
        setEditing(item.id !== reviewStep);
        setStep(item.id === reviewStep ? declarationStep : item.id);
        setError(invalid);
        return;
      }
    }

    sending.current = true;
    setBusy(true);
    setError(undefined);
    try {
      const id = attempt ?? crypto.randomUUID();
      setAttempt(id);
      const response = await fetch(isHub ? HUB_FRANCHISE_CPANEL_URL : POINT_FRANCHISE_CPANEL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, termsVersion: schema.termsVersion, ...answers }),
        signal: AbortSignal.timeout(25_000),
        credentials: "omit",
      });
      const result = await response.json();
      if ((response.status === 200 || response.status === 201) && result?.id === id && result?.saved === true) {
        setReceipt(isHub ? { reference: id } : {
          reference: `RC-P-${id.toUpperCase()}`,
          town: String(answers.firstPreferredPoint).trim(),
        });
        setAnswers(startAnswers(sections));
        return;
      }
      if (response.status === 422 && typeof result?.field === "string") {
        const invalidSection = sections.find((item) => item.fields.some((field) => field.key === result.field));
        const field = invalidSection?.fields.find((item) => item.key === result.field);
        if (invalidSection && field) {
          setAttempt(null);
          setEditing(invalidSection.id !== reviewStep);
          setStep(invalidSection.id === reviewStep ? declarationStep : invalidSection.id);
          setError({ key: field.key, en: `Check your answer for “${field.en}”.`, si: `“${field.si}” සඳහා ඔබේ පිළිතුර පරීක්ෂා කරන්න.` });
          return;
        }
      }
      if (response.status === 429) {
        setError({ en: "Too many attempts. Wait a minute, then retry.", si: "උත්සාහ ගණන වැඩියි. මිනිත්තුවක් රැඳී නැවත උත්සාහ කරන්න." });
        return;
      }
      if (response.status === 409 && result?.code === "terms_changed") {
        setAttempt(null);
        setError({ en: "The terms have changed. Reload the page to read the current version.", si: "කොන්දේසි වෙනස් වී ඇත. වත්මන් අනුවාදය කියවීමට පිටුව නැවත පූරණය කරන්න." });
        return;
      }
      throw new Error("Submission not confirmed");
    } catch {
      setError({ en: "We couldn’t confirm your application. Keep this page open and retry. Retrying uses the same reference.", si: "අයදුම්පත ලැබුණු බව තහවුරු කළ නොහැකි විය. මෙම පිටුව විවෘතව තබා නැවත උත්සාහ කරන්න. එවිට එම යොමු අංකයම භාවිත වේ." });
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  const title = receipt ? { en: "Application received", si: "අයදුම්පත ලැබී ඇත" }
    : section ?? { en: "Review your answers", si: "ඔබේ පිළිතුරු පරීක්ෂා කරන්න" };
  const locked = attempt !== null;
  const fullWidthKeys = new Set([
    "fullName",
    "email",
    "preferredDistrict",
    "proposedHubAddress",
    "googleMapsLocation",
    "whyInterested",
    "signature",
  ]);
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white text-ink shadow-2xl shadow-black/10">
      <header ref={header} className="scroll-mt-24 rounded-t-[2rem] border-b border-ink/10 bg-mist/60 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {!receipt && <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.16em] text-brand"><Text lang={lang} en={`Step ${step} of ${declarationStep}`} si={`පියවර ${step} / ${declarationStep}`} /></p>}
            <h2 ref={heading} tabIndex={-1} className="scroll-mt-24 text-2xl font-extrabold tracking-tight sm:text-3xl"><Text lang={lang} {...title} /></h2>
          </div>
          <div role="group" aria-label={show(lang, "Form language", "අයදුම්පතේ භාෂාව")} className="flex flex-wrap gap-1 rounded-xl border border-ink/15 bg-white p-1 shadow-sm">
            {([["en", "English"], ["si", "සිංහල"]] as const).map(([mode, label]) => (
              <button key={mode} type="button" lang={mode === "si" ? "si" : "en"} aria-pressed={lang === mode} onClick={() => setLang(mode)}
                className="min-h-9 rounded-lg px-3 text-xs font-bold aria-pressed:bg-ink aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-brand-deep">{label}</button>
            ))}
          </div>
        </div>
        {!receipt && (
          <>
            <progress aria-label={show(lang, "Application progress", "අයදුම්පතේ ප්‍රගතිය")} value={step} max={declarationStep} className="mt-4 block h-1.5 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-brand [&::-webkit-progress-bar]:bg-ink/10 [&::-webkit-progress-value]:bg-brand" />
            <div className={`mt-3 grid gap-1.5 ${isHub ? "grid-cols-6 sm:grid-cols-11" : "grid-cols-5"}`}>
              {Array.from({ length: declarationStep }, (_, i) => i + 1).map((n) => {
                const active = n === step;
                const done = n < step;
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={n > step}
                    onClick={() => {
                      if (n >= step) return;
                      setEditing(false);
                      go(n);
                    }}
                    aria-current={active ? "step" : undefined}
                    className={`rounded-lg py-1.5 text-[11px] font-extrabold transition ${
                      active
                        ? "bg-brand text-white shadow-sm"
                        : done
                        ? "bg-ink text-white hover:bg-ink/85"
                        : "cursor-not-allowed bg-white/70 text-ink/35 ring-1 ring-black/5"
                    }`}
                  >
                    {String(n).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </header>

      {receipt ? (
        <div className="space-y-4 p-5 sm:p-8">
          <CheckCircle2 aria-hidden className="size-9 text-emerald-700" />
          <p><Text lang={lang} en="Our franchise team will review your application and contact you using the details provided." si="අපගේ කණ්ඩායම ඔබේ අයදුම්පත සමාලෝචනය කර ඔබ ලබා දුන් තොරතුරු අනුව ඔබ අමතනු ඇත." /></p>
          {receipt.town && <p className="wrap-anywhere"><Text lang={lang} en="Preferred Point location" si="කැමති Point ස්ථානය" /> · <strong>{receipt.town}</strong></p>}
          <p className="rounded-xl bg-mist p-4"><Text lang={lang} en="Save this reference number" si="මෙම යොමු අංකය සුරකින්න" /><strong className="mt-2 block break-all font-mono">{receipt.reference}</strong></p>
        </div>
      ) : (
        <form noValidate aria-busy={busy} onSubmit={submit} className="space-y-6 p-5 sm:p-8">
          {step === 1 && (
            <p className="text-sm text-ink/75"><Text lang={lang} en="Your answers stay in this page until you submit. Keep this page open while applying." si="ඔබ යොමු කරන තෙක් පිළිතුරු මෙම පිටුවේ පමණක් පවතී. අයදුම් කරන අතරතුර පිටුව විවෘතව තබන්න." /></p>
          )}
          {isHub && step === 5 && <p className="rounded-xl bg-mist p-4 text-sm"><Text lang={lang} en="Proposed minimum: 1,500 sq. ft. with parking and loading facilities." si="යෝජිත අවම ඉඩකඩ වර්ග අඩි 1,500කි. වාහන නැවැත්වීම හා පැටවීමේ පහසුකම් අවශ්‍යයි." /></p>}
          {isHub && step === 7 && <p className="rounded-xl bg-mist p-4 text-sm"><Text lang={lang} en="10–20 Points per Hub. Shifts run from 5–10 AM and 5–9 PM." si="එක් Hub එකකට Points 10–20කි. වැඩ මුර පෙ.ව. 5–10 සහ ප.ව. 5–9 වේ." /></p>}
          {step === declarationStep && (
            <div className="space-y-3 rounded-xl bg-mist p-4 text-sm leading-relaxed">
              <p><Text lang={lang} en="I confirm that the information is accurate to the best of my knowledge. Submission does not guarantee approval or reservation." si="මා ලබා දුන් තොරතුරු මාගේ දැනුම අනුව නිවැරදි බව තහවුරු කරමි. අයදුම්පත යොමු කිරීමෙන් අනුමැතිය හෝ වෙන් කිරීම සහතික නොවේ." /></p>
              <a href={noticeHref} target="_blank" rel="noopener" className={links}><Text lang={lang} en="Read the privacy notice and application terms (opens in a new tab)" si="පෞද්ගලිකත්ව නිවේදනය සහ අයදුම්පත් කොන්දේසි කියවන්න (නව ටැබයක විවෘත වේ)" /></a>
            </div>
          )}
          {section ? (
            <fieldset disabled={busy || locked} className="grid min-w-0 gap-5 sm:grid-cols-2">
              {section.fields.map((field) => {
                const spanFull =
                  fullWidthKeys.has(field.key) ||
                  field.type === "radio" ||
                  field.type === "checkbox" ||
                  field.type === "consent" ||
                  field.type === "textarea";
                return (
                  <div key={field.key} className={spanFull ? "sm:col-span-2" : "min-w-0"}>
                    <StepFields field={field} value={answers[field.key]} answers={answers} lang={lang}
                      error={error?.key === field.key} onChange={(value) => update(field, value)} />
                  </div>
                );
              })}
            </fieldset>
          ) : (
            <div className="divide-y divide-ink/15">
              {sections.slice(0, reviewStep - 1).map((item) => (
                <section key={item.id} className="py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold"><Text lang={lang} {...item} /></h3>
                    <button type="button" className={`${button} border border-ink/25`} aria-label={show(lang, `Edit ${item.en}`, `${item.si} සංස්කරණය කරන්න`)}
                      onClick={() => { setEditing(true); go(item.id); }}><Text lang={lang} en="Edit" si="සංස්කරණය" /></button>
                  </div>
                  <dl className="mt-2 grid gap-3 text-sm sm:grid-cols-2">
                    {item.fields.map((field: Field) => {
                      const answer = answers[field.key];
                      const vals = Array.isArray(answer) ? answer : [String(answer)];
                      return <div key={field.key} className="min-w-0"><dt className="text-ink/70"><Text lang={lang} en={field.en} si={field.si} /></dt><dd className="mt-0.5 break-words font-semibold">{vals.map((v) => {
                        const option = field.options?.find(({ value }) => value === v);
                        return option ? show(lang, option.en, option.si) : districtNames[v] ? show(lang, v, districtNames[v]) : v;
                      }).join(", ") || "—"}</dd></div>;
                    })}
                  </dl>
                </section>
              ))}
            </div>
          )}

          {!locked && Object.entries(answers).some(([key, value]) => key !== "declarationDate" && (Array.isArray(value) ? value.length : value)) && (
            <button type="button" className="min-h-11 text-sm font-semibold underline underline-offset-4" onClick={() => {
              if (!window.confirm(show(lang, "Clear every answer from this application?", "මෙම අයදුම්පතේ සියලු පිළිතුරු මකා දමන්නද?"))) return;
              setAnswers(startAnswers(sections));
              setEditing(false);
              go(1);
              heading.current?.focus();
            }}><Text lang={lang} en="Clear answers" si="පිළිතුරු මකන්න" /></button>
          )}
          {error && <p id="hub-error" role="alert" tabIndex={-1} className="scroll-mt-24 rounded-xl border border-brand-deep/30 bg-brand-soft/35 p-4 text-sm font-semibold text-brand-deep"><Text lang={lang} en={error.en} si={error.si} /></p>}
          <div className="flex flex-col-reverse gap-3 border-t border-ink/15 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
            {step > 1 && (
              <button type="button" disabled={busy || locked} className={`${button} border border-ink/25`} onClick={() => { go(editing ? reviewStep : step - 1); setEditing(false); }}>
                <ArrowLeft size={16} aria-hidden /><Text lang={lang} en={editing ? "Back to review" : "Previous"} si={editing ? "සමාලෝචනයට ආපසු" : "පෙර"} />
              </button>
            )}
            <button type="submit" disabled={busy} className={`${button} bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-deep sm:ml-auto`}>
              {busy ? <LoaderCircle aria-hidden size={16} className="animate-spin" /> : null}
              {busy ? <Text lang={lang} en="Submitting…" si="යොමු කරමින්…" />
                : locked ? <Text lang={lang} en="Retry submission" si="නැවත යොමු කරන්න" />
                : step === declarationStep ? <Text lang={lang} en="Submit application" si="අයදුම්පත යොමු කරන්න" />
                : <Text lang={lang} en={editing ? "Return to review" : "Continue"} si={editing ? "සමාලෝචනයට ආපසු" : "ඉදිරියට"} />}
              {!busy && <ArrowRight aria-hidden size={16} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
