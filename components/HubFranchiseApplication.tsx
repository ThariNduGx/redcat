"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import schema from "@/infra/cpanel-hub-franchise/application-schema.json";
import catalog from "@/infra/cpanel-hub-franchise/hub-catalog.json";
import { HUB_FRANCHISE_CPANEL_URL } from "@/lib/hubFranchise";

type Lang = "both" | "en" | "si";
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
const sections: (Copy & { id: number; fields: Field[] })[] = schema.sections;
const fields: Field[] = sections.flatMap((section) => section.fields);
const reviewStep = 10;
const declarationStep = 11;
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
  return lang === "si" ? si : lang === "en" ? en : `${en} / ${si}`;
}

function Text({ lang, en, si }: Copy & { lang: Lang }) {
  return <>{lang !== "si" && <span lang="en">{en}</span>}{lang === "both" && " / "}{lang !== "en" && <span lang="si">{si}</span>}</>;
}

function startAnswers(): Answers {
  return Object.fromEntries(fields.map(({ key, type }) => [key, type === "multi" ? [] : type === "consent" ? false : ""]));
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

export default function HubFranchiseApplication() {
  const [answers, setAnswers] = useState(startAnswers);
  const [lang, setLang] = useState<Lang>("both");
  const [step, setStep] = useState(1);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<FormError>();
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const header = useRef<HTMLElement>(null);
  const [attempt, setAttempt] = useState<string | null>(null);
  const sending = useRef(false);
  const lastStep = useRef(1);
  const section = step === reviewStep ? null : sections[step === declarationStep ? 9 : step - 1];

  useEffect(() => {
    try { sessionStorage.removeItem("redcat_hub_franchise_draft_v1"); } catch { /* Storage may be unavailable. */ }
  }, []);

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
      if (field.key === "preferredDistrict") next.firstPreferredHub = "";
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
      const { year, month, day } = sriLankaToday();
      setAnswers((previous) => ({
        ...previous,
        applicantName: previous.applicantName || previous.fullName,
        declarationDate: previous.declarationDate || `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      }));
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
        setEditing(item.id !== 10);
        setStep(item.id === 10 ? declarationStep : item.id);
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
      const response = await fetch(HUB_FRANCHISE_CPANEL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, termsVersion: schema.termsVersion, ...answers }),
        signal: AbortSignal.timeout(25_000),
        credentials: "omit",
      });
      const result = await response.json();
      if ((response.status === 200 || response.status === 201) && result?.id === id && result?.saved === true) {
        setReceipt(id);
        setAnswers(startAnswers());
        return;
      }
      if (response.status === 422 && typeof result?.field === "string") {
        const invalidSection = sections.find((item) => item.fields.some((field) => field.key === result.field));
        const field = invalidSection?.fields.find((item) => item.key === result.field);
        if (invalidSection && field) {
          setAttempt(null);
          setEditing(invalidSection.id !== 10);
          setStep(invalidSection.id === 10 ? declarationStep : invalidSection.id);
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
  return (
    <div className="rounded-3xl border border-ink/15 bg-white text-ink">
      <header ref={header} className="scroll-mt-24 rounded-t-3xl border-b border-ink/10 bg-mist/50 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {!receipt && <p className="mb-1 text-sm font-bold text-brand-deep"><Text lang={lang} en={`Step ${step} of 11`} si={`පියවර ${step} / 11`} /></p>}
            <h2 ref={heading} tabIndex={-1} className="scroll-mt-24 text-2xl font-extrabold tracking-tight sm:text-3xl"><Text lang={lang} {...title} /></h2>
          </div>
          <div role="group" aria-label="Form language / අයදුම්පතේ භාෂාව" className="flex flex-wrap gap-1 rounded-xl border border-ink/20 bg-white p-1">
            {([["both", "EN + සිංහල"], ["en", "English"], ["si", "සිංහල"]] as const).map(([mode, label]) => (
              <button key={mode} type="button" lang={mode === "si" ? "si" : "en"} aria-pressed={lang === mode} onClick={() => setLang(mode)}
                className="min-h-10 rounded-lg px-3 text-sm font-bold aria-pressed:bg-ink aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-brand-deep">{label}</button>
            ))}
          </div>
        </div>
        {!receipt && <progress aria-label={show(lang, "Application progress", "අයදුම්පතේ ප්‍රගතිය")} value={step} max={11} className="mt-4 block h-2 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-brand-deep [&::-webkit-progress-bar]:bg-ink/10 [&::-webkit-progress-value]:bg-brand-deep" />}
      </header>

      {receipt ? (
        <div className="space-y-4 p-5 sm:p-8">
          <CheckCircle2 aria-hidden className="size-9 text-emerald-700" />
          <p><Text lang={lang} en="Our franchise team will review your application and contact you using the details provided." si="අපගේ කණ්ඩායම ඔබේ අයදුම්පත සමාලෝචනය කර ඔබ ලබා දුන් තොරතුරු අනුව ඔබ අමතනු ඇත." /></p>
          <p className="rounded-xl bg-mist p-4"><Text lang={lang} en="Save this reference number" si="මෙම යොමු අංකය සුරකින්න" /><strong className="mt-2 block break-all font-mono">{receipt}</strong></p>
        </div>
      ) : (
        <form noValidate aria-busy={busy} onSubmit={submit} className="space-y-6 p-5 sm:p-8">
          {step === 1 && (
            <p className="text-sm text-ink/75"><Text lang={lang} en="Your answers stay in this page until you submit. Keep this page open while applying." si="ඔබ යොමු කරන තෙක් පිළිතුරු මෙම පිටුවේ පමණක් පවතී. අයදුම් කරන අතරතුර පිටුව විවෘතව තබන්න." /></p>
          )}
          {step === 5 && <p className="rounded-xl bg-mist p-4 text-sm"><Text lang={lang} en="Proposed minimum: 1,500 sq. ft. with parking and loading facilities." si="යෝජිත අවම ඉඩකඩ වර්ග අඩි 1,500කි. වාහන නැවැත්වීම හා පැටවීමේ පහසුකම් අවශ්‍යයි." /></p>}
          {step === 7 && <p className="rounded-xl bg-mist p-4 text-sm"><Text lang={lang} en="10–20 Points per Hub. Shifts run from 5–10 AM and 5–9 PM." si="එක් Hub එකකට Points 10–20කි. වැඩ මුර පෙ.ව. 5–10 සහ ප.ව. 5–9 වේ." /></p>}
          {step === declarationStep && (
            <div className="space-y-3 rounded-xl bg-mist p-4 text-sm leading-relaxed">
              <p><Text lang={lang} en="I confirm that the information is accurate to the best of my knowledge. Submission does not guarantee approval or reservation." si="මා ලබා දුන් තොරතුරු මාගේ දැනුම අනුව නිවැරදි බව තහවුරු කරමි. අයදුම්පත යොමු කිරීමෙන් අනුමැතිය හෝ වෙන් කිරීම සහතික නොවේ." /></p>
              <a href="/dealers/hub-franchise/application-notice" target="_blank" rel="noopener" className={links}><Text lang={lang} en="Read the privacy notice and application terms (opens in a new tab)" si="පෞද්ගලිකත්ව නිවේදනය සහ අයදුම්පත් කොන්දේසි කියවන්න (නව ටැබයක විවෘත වේ)" /></a>
            </div>
          )}
          {section ? (
            <fieldset disabled={busy || locked} className="min-w-0 space-y-6">
              {section.fields.map((field) => (
                <StepFields key={field.key} field={field} value={answers[field.key]} answers={answers} lang={lang}
                  error={error?.key === field.key} onChange={(value) => update(field, value)} />
              ))}
            </fieldset>
          ) : (
            <div className="divide-y divide-ink/15">
              {sections.slice(0, 9).map((item) => (
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
              setAnswers(startAnswers());
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
            <button type="submit" disabled={busy} className={`${button} bg-ink text-white hover:bg-brand-deep sm:ml-auto`}>
              {busy ? <LoaderCircle aria-hidden size={16} className="animate-spin" /> : <ArrowRight aria-hidden size={16} />}
              {busy ? <Text lang={lang} en="Submitting…" si="යොමු කරමින්…" />
                : locked ? <Text lang={lang} en="Retry submission" si="නැවත යොමු කරන්න" />
                : step === declarationStep ? <Text lang={lang} en="Submit application" si="අයදුම්පත යොමු කරන්න" />
                : <Text lang={lang} en={editing ? "Return to review" : "Continue"} si={editing ? "සමාලෝචනයට ආපසු" : "ඉදිරියට"} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
