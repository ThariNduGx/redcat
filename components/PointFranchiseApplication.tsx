"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Languages,
  LoaderCircle,
  MapPin,
} from "lucide-react";
import { DISTRICTS, HUBS } from "@/data/hubs";
import {
  FUNDING_SOURCE_OPTIONS,
  FUNDS_READY_OPTIONS,
  POINT_BUSINESS_MODE_OPTIONS,
  POINT_FRANCHISE_CPANEL_URL,
  POINT_INVESTMENT_OPTIONS,
  POINT_MANAGER_OPTIONS,
  POINT_OCCUPATION_DETAILED,
  POINT_OCCUPATION_INITIAL,
  POINT_PREMISES_OPTIONS,
  POINT_SECTIONS,
  POINT_SELECTION_WORKFLOW,
  POINT_SIZE_OPTIONS,
  POINT_START_OPTIONS,
  POINT_YEARS_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  WORKING_CAP_OPTIONS,
  YES_NO_OPTIONS,
  scorePointFranchise,
  type OptionItem,
  type PointFranchiseFormData,
} from "@/lib/pointFranchise";
import { trackDealerEnquiry, trackMetaEvent } from "@/lib/analytics";

type LangMode = "both" | "en" | "si";
const STORAGE_KEY = "redcat_point_franchise_draft_v1";

const SHORT_LABELS: Record<number, { en: string; si: string }> = {
  1: { en: "Registration", si: "ලියාපදිංචිය" },
  2: { en: "Location", si: "ස්ථානය" },
  3: { en: "Experience", si: "පළපුරුද්ද" },
  4: { en: "Financials", si: "මූල්‍ය" },
  5: { en: "Premises", si: "ගොඩනැගිල්ල" },
  6: { en: "Commitment", si: "කැපවීම" },
};

const inputCls =
  "mt-2 block w-full rounded-xl border-2 border-black/10 bg-white px-4 py-3 text-base font-medium text-ink outline-none transition placeholder:text-ink/35 hover:border-black/25 focus:border-brand";

function initialData(): PointFranchiseFormData {
  return {
    fullName: "",
    mobileNumber: "",
    email: "",
    residentialDistrict: "",
    currentOccupation: "",
    preferredDistrict: "",
    preferredPoint: "",
    secondPreference: "",
    availableInvestment: "",
    businessPremises: "",
    previousBusinessExperience: "",
    whenCanYouStart: "",
    agreePrivacyTerms: false,
    agreeContact: false,
    whatsappNumber: "",
    residentialTown: "",
    occupationDetails: "",
    knowledgeOfPreferredArea: "",
    existingLocalContacts: "",
    currentlyOperatingBusiness: "",
    yearsBusinessExperience: "",
    currentBusinessType: "",
    courierLogisticsExperience: "",
    customerServiceExperience: "",
    computerAppSkills: "",
    investmentFundsReady: "",
    fundingSource: "",
    additionalWorkingCapital: "",
    premisesSize: "",
    mainRoadFrontage: "",
    parkingAvailable: "",
    existingBusinessAtSite: "",
    proposedBusinessAddress: "",
    googleMapsLocation: "",
    whoWillManagePoint: "",
    mainOrAdditionalBusiness: "",
    readyToRecruitStaff: "",
    canMeetServiceHours: "",
    willingToCompleteTraining: "",
    willingToUseItSystem: "",
    agreeOperationalStandards: "",
  };
}

function t(lang: LangMode, en: string, si: string) {
  if (lang === "en") return en;
  if (lang === "si") return si;
  return `${en} / ${si}`;
}

function Label({
  en,
  si,
  lang,
  required = true,
}: {
  en: string;
  si: string;
  lang: LangMode;
  required?: boolean;
}) {
  return (
    <div className="mb-1">
      <span className="block text-[15px] font-extrabold text-ink leading-snug">
        {lang !== "si" ? en : si}
        {required && <span className="text-brand ml-1">*</span>}
      </span>
      {lang === "both" && (
        <span className="mt-0.5 block text-xs font-medium text-ink/65">{si}</span>
      )}
    </div>
  );
}

function OptionGroup({
  name,
  options,
  value,
  onChange,
  lang,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  name: string;
  options: OptionItem[];
  value: string;
  onChange: (val: string) => void;
  lang: LangMode;
  columns?: string;
}) {
  return (
    <div className={`mt-2.5 grid gap-2.5 ${columns}`}>
      {options.map((opt) => {
        const selected = value === opt.value;
        const label =
          lang === "en"
            ? opt.en
            : lang === "si"
            ? opt.si
            : opt.en === opt.si
            ? opt.en
            : `${opt.en} / ${opt.si}`;
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-sm font-semibold transition ${
              selected
                ? "border-brand bg-brand-soft/45 text-ink shadow-sm"
                : "border-black/10 bg-white text-ink/80 hover:border-black/25 hover:bg-mist/40"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                selected ? "border-brand bg-brand text-white" : "border-ink/30 bg-white"
              }`}
            >
              {selected && <Check size={13} strokeWidth={3} />}
            </span>
            <span className="leading-snug">{label}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function PointFranchiseApplication() {
  const [step, setStep] = useState(1);
  const [maxVisited, setMaxVisited] = useState(1);
  const [lang, setLang] = useState<LangMode>("both");
  const [form, setForm] = useState<PointFranchiseFormData>(initialData);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{
    id: string;
    rcRef: string;
    point: string;
  } | null>(null);
  const cardTopRef = useRef<HTMLDivElement>(null);
  const attemptIdRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setForm((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (receipt) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // ignore
    }
  }, [form, receipt]);

  function update<K extends keyof PointFranchiseFormData>(key: K, value: PointFranchiseFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function scrollToCard() {
    cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!form.fullName.trim()) return t(lang, "Please enter your full name.", "කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න.");
      if (!/^[+\d][\d\s() -]{6,18}$/.test(form.mobileNumber.trim()))
        return t(lang, "Please enter a valid mobile number.", "කරුණාකර වලංගු ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        return t(lang, "Please enter a valid email address.", "කරුණාකර වලංගු විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.");
      if (!form.residentialDistrict) return t(lang, "Please select your residential district.", "කරුණාකර පදිංචි දිස්ත්‍රික්කය තෝරන්න.");
      if (!form.currentOccupation) return t(lang, "Please select your current occupation.", "කරුණාකර වර්තමාන රැකියාව තෝරන්න.");
      if (!form.preferredDistrict) return t(lang, "Please select your preferred franchise district.", "කරුණාකර කැමති ව්‍යාපාරික දිස්ත්‍රික්කය තෝරන්න.");
      if (!form.preferredPoint.trim()) return t(lang, "Please enter or select your preferred REDCAT Point.", "කරුණාකර කැමති REDCAT Point ස්ථානය තෝරන්න.");
      if (!form.availableInvestment) return t(lang, "Please select your available investment.", "කරුණාකර ආයෝජනය කළ හැකි මුදල තෝරන්න.");
      if (!form.businessPremises) return t(lang, "Please select your business premises status.", "කරුණාකර ව්‍යාපාරික ගොඩනැගිල්ල තෝරන්න.");
      if (!form.previousBusinessExperience) return t(lang, "Please indicate your previous business experience.", "කරුණාකර පෙර ව්‍යාපාරික පළපුරුද්ද තෝරන්න.");
      if (!form.whenCanYouStart) return t(lang, "Please select when you can start.", "කරුණාකර ආරම්භ කළ හැකි කාලය තෝරන්න.");
      if (!form.agreePrivacyTerms) return t(lang, "Please agree to the privacy notice and application terms.", "කරුණාකර පෞද්ගලිකත්ව නිවේදනයට හා කොන්දේසිවලට එකඟ වන්න.");
      if (!form.agreeContact) return t(lang, "Please agree to be contacted regarding your application.", "කරුණාකර සන්නිවේදන කැමැත්ත තහවුරු කරන්න.");
    }
    if (s === 2) {
      if (!form.residentialTown.trim()) return t(lang, "Please enter your residential town.", "කරුණාකර පදිංචි නගරය ඇතුළත් කරන්න.");
      if (!form.knowledgeOfPreferredArea) return t(lang, "Please indicate your knowledge of the preferred area.", "කරුණාකර කැමති ප්‍රදේශය පිළිබඳ දැනුම තෝරන්න.");
      if (!form.existingLocalContacts) return t(lang, "Please indicate your local business contacts.", "කරුණාකර ප්‍රදේශයේ ව්‍යාපාරික සම්බන්ධතා තෝරන්න.");
    }
    if (s === 3) {
      if (!form.currentlyOperatingBusiness) return t(lang, "Please indicate if you currently operate a business.", "දැනට ව්‍යාපාරයක් පවත්වාගෙන යනවාද යන්න තෝරන්න.");
      if (!form.yearsBusinessExperience) return t(lang, "Please select your years of business experience.", "ව්‍යාපාරික පළපුරුද්ද වසර ගණන තෝරන්න.");
      if (!form.courierLogisticsExperience) return t(lang, "Please indicate your courier or logistics experience.", "කුරියර් හෝ ප්‍රවාහන පළපුරුද්ද තෝරන්න.");
      if (!form.customerServiceExperience) return t(lang, "Please indicate your customer service experience.", "පාරිභෝගික සේවා පළපුරුද්ද තෝරන්න.");
      if (!form.computerAppSkills) return t(lang, "Please select your computer and mobile app skills.", "පරිගණක හා ජංගම යෙදුම් භාවිත හැකියාව තෝරන්න.");
    }
    if (s === 4) {
      if (!form.investmentFundsReady) return t(lang, "Please indicate whether investment funds are ready.", "ආයෝජන මුදල් සූදානම්ද යන්න තෝරන්න.");
      if (!form.fundingSource) return t(lang, "Please select your funding source.", "මුදල් ලබාගන්නා මාර්ගය තෝරන්න.");
      if (!form.additionalWorkingCapital) return t(lang, "Please indicate if additional working capital is available.", "අමතර මෙහෙයුම් ප්‍රාග්ධනය තිබේද යන්න තෝරන්න.");
    }
    if (s === 5) {
      if (!form.premisesSize) return t(lang, "Please select your premises size.", "ගොඩනැගිල්ලේ ප්‍රමාණය තෝරන්න.");
      if (!form.mainRoadFrontage) return t(lang, "Please indicate if the site has main road frontage.", "ප්‍රධාන මාර්ගයට මුහුණලා තිබේද යන්න තෝරන්න.");
      if (!form.parkingAvailable) return t(lang, "Please indicate if parking is available.", "වාහන නැවැත්වීමේ පහසුකම් තිබේද යන්න තෝරන්න.");
      if (!form.existingBusinessAtSite) return t(lang, "Please indicate if there is an existing business at the site.", "එම ස්ථානයේ දැනට ව්‍යාපාරයක් තිබේද යන්න තෝරන්න.");
    }
    if (s === 6) {
      if (!form.whoWillManagePoint) return t(lang, "Please select who will manage the Point.", "Point එක කළමනාකරණය කරන්නේ කවුද යන්න තෝරන්න.");
      if (!form.mainOrAdditionalBusiness) return t(lang, "Please indicate if this is a full-time or additional business.", "ප්‍රධාන හෝ අමතර ව්‍යාපාරයක්ද යන්න තෝරන්න.");
      if (!form.readyToRecruitStaff) return t(lang, "Please answer if you are ready to recruit staff.", "සේවකයන් බඳවා ගැනීමට සූදානම්ද යන්න තෝරන්න.");
      if (!form.canMeetServiceHours) return t(lang, "Please answer if you can meet required service hours.", "නියමිත සේවා වේලාවන් පිළිපැදිය හැකිද යන්න තෝරන්න.");
      if (!form.willingToCompleteTraining) return t(lang, "Please answer if you are willing to complete REDCAT training.", "REDCAT පුහුණුව සම්පූර්ණ කිරීමට කැමතිද යන්න තෝරන්න.");
      if (!form.willingToUseItSystem) return t(lang, "Please answer if you are willing to use the REDCAT IT system.", "REDCAT IT පද්ධතිය භාවිත කිරීමට කැමතිද යන්න තෝරන්න.");
      if (!form.agreeOperationalStandards) return t(lang, "Please indicate if you agree to operational standards.", "මෙහෙයුම් ප්‍රමිතීන්ට එකඟද යන්න තෝරන්න.");
    }
    return null;
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    const nextStep = Math.min(6, step + 1);
    setStep(nextStep);
    setMaxVisited((m) => Math.max(m, nextStep));
    setError("");
    scrollToCard();
  }

  function handlePrev() {
    setStep((s) => Math.max(1, s - 1));
    setError("");
    scrollToCard();
  }

  async function submitApplication(stageMode: "initial" | "detailed") {
    const err = validateStep(stageMode === "initial" ? 1 : 6);
    if (err) {
      setError(err);
      return;
    }
    if (busy) return;

    setBusy(true);
    setError("");

    const id = attemptIdRef.current ?? crypto.randomUUID();
    attemptIdRef.current = id;
    const rcRef = `RC-P-${id.slice(0, 6).toUpperCase()}`;
    const score = scorePointFranchise(form);

    try {
      const cpanelPromise = fetch(POINT_FRANCHISE_CPANEL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          rcRef,
          stageMode,
          firstPreferredPoint: form.preferredPoint,
          ...form,
        }),
        signal: AbortSignal.timeout(25_000),
        credentials: "omit",
      })
        .then(async (res) => {
          const json = await res.json().catch(() => null);
          return res.ok && json?.id ? json : null;
        })
        .catch(() => null);

      const formSubmitPromise = fetch("https://formsubmit.co/ajax/info@redcat.lk", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `[REDCAT Point Franchise] ${form.preferredPoint} (${form.preferredDistrict}) - ${form.fullName} [${rcRef}]`,
          _replyto: form.email,
          _template: "table",
          _captcha: "false",
          "Reference": rcRef,
          "Application Stage": stageMode === "initial" ? "Stage 1 (Initial Registration)" : "Stage 2 (Detailed Qualification)",
          "Qualification Score": `${score.total}/100 (${score.tier})`,
          "Full Name": form.fullName,
          "Mobile": form.mobileNumber,
          "WhatsApp": form.whatsappNumber || "Not provided",
          "Email": form.email,
          "Residential District": form.residentialDistrict,
          "Residential Town": form.residentialTown || "Not provided",
          "Current Occupation": form.currentOccupation,
          "Preferred District": form.preferredDistrict,
          "Preferred REDCAT Point": form.preferredPoint,
          "Second Preference": form.secondPreference || "None",
          "Available Investment": form.availableInvestment,
          "Business Premises": form.businessPremises,
          "Previous Business Experience": form.previousBusinessExperience,
          "When Can Start": form.whenCanYouStart,
          ...(stageMode === "detailed"
            ? {
                "Occupation Details": form.occupationDetails || form.currentOccupation,
                "Area Knowledge": form.knowledgeOfPreferredArea,
                "Local Contacts": form.existingLocalContacts,
                "Currently Operating Business": form.currentlyOperatingBusiness,
                "Years Business Experience": form.yearsBusinessExperience,
                "Current Business Type": form.currentBusinessType || "N/A",
                "Courier/Logistics Experience": form.courierLogisticsExperience,
                "Customer Service Experience": form.customerServiceExperience,
                "Computer/App Skills": form.computerAppSkills,
                "Investment Funds Ready": form.investmentFundsReady,
                "Funding Source": form.fundingSource,
                "Additional Working Capital": form.additionalWorkingCapital,
                "Premises Size": form.premisesSize,
                "Main Road Frontage": form.mainRoadFrontage,
                "Parking Available": form.parkingAvailable,
                "Existing Business at Site": form.existingBusinessAtSite,
                "Proposed Business Address": form.proposedBusinessAddress || "N/A",
                "Google Maps Location": form.googleMapsLocation || "N/A",
                "Who Manages Point": form.whoWillManagePoint,
                "Full-time or Additional": form.mainOrAdditionalBusiness,
                "Ready to Recruit Staff": form.readyToRecruitStaff,
                "Can Meet Service Hours": form.canMeetServiceHours,
                "Willing for REDCAT Training": form.willingToCompleteTraining,
                "Willing for REDCAT IT System": form.willingToUseItSystem,
                "Agree Operational Standards": form.agreeOperationalStandards,
              }
            : {}),
        }),
      })
        .then((res) => (res.ok ? res.json().catch(() => ({ ok: true })) : null))
        .catch(() => null);

      const [cpanelRes, fsRes] = await Promise.all([cpanelPromise, formSubmitPromise]);

      if (cpanelRes || fsRes) {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        trackDealerEnquiry({
          role: "REDCAT Point Franchise",
          district: form.preferredDistrict,
          name: form.fullName,
        });
        trackMetaEvent("track", "SubmitApplication", {
          content_name: "REDCAT Point Franchise Application",
          district: form.preferredDistrict,
          point: form.preferredPoint,
        });
        setReceipt({
          id: cpanelRes?.id || id,
          rcRef: cpanelRes?.rcRef || rcRef,
          point: form.preferredPoint,
        });
        scrollToCard();
      } else {
        setError(t(lang, "We couldn't confirm your submission right now. Please try again.", "මේ මොහොතේ අයදුම්පත තහවුරු කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න."));
      }
    } catch {
      setError(t(lang, "We couldn't confirm your submission right now. Please try again.", "මේ මොහොතේ අයදුම්පත තහවුරු කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න."));
    } finally {
      setBusy(false);
    }
  }

  const districtHubs = HUBS.filter((h) => h.district === form.preferredDistrict);
  const currentSection = POINT_SECTIONS[step - 1];
  const progressPct = Math.round((step / 6) * 100);

  if (receipt) {
    return (
      <div
        ref={cardTopRef}
        className="scroll-mt-24 rounded-[2rem] bg-white p-8 shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={34} />
          </span>
          <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {lang === "si" ? "අයදුම්පත ලැබීම තහවුරු කිරීම" : "Application Confirmation"}
          </h3>
          {lang === "both" && (
            <p className="mt-1 text-base font-bold text-ink/70">
              අයදුම්පත ලැබීම තහවුරු කිරීම
            </p>
          )}
          <div className="mt-6 rounded-2xl border border-black/10 bg-mist p-5 text-left text-sm leading-relaxed text-ink">
            {lang !== "si" && (
              <p className="font-semibold">
                Thank you for applying for a REDCAT Point Franchise. Your application{" "}
                <strong className="text-brand">{receipt.rcRef}</strong> for{" "}
                <strong>{receipt.point}</strong> has been received and is under review. Our
                Franchise Development Team will contact you after reviewing your application.
              </p>
            )}
            {lang !== "en" && (
              <p className={lang === "both" ? "mt-3 text-ink/75" : "font-semibold"}>
                REDCAT Point Franchise සඳහා අයදුම් කිරීම පිළිබඳව ස්තූතියි.{" "}
                <strong>{receipt.point}</strong> සඳහා ඔබගේ{" "}
                <strong className="text-brand">{receipt.rcRef}</strong> අයදුම්පත ලැබී ඇති අතර එය
                සමාලෝචනය වෙමින් පවතී. සමාලෝචනයෙන් පසු අපගේ Franchise Development කණ්ඩායම ඔබව සම්බන්ධ
                කරගනු ඇත.
              </p>
            )}
          </div>
        </div>

        {/* 8-Step Selection Workflow */}
        <div className="mt-10 border-t border-black/10 pt-8">
          <h4 className="text-center text-sm font-extrabold uppercase tracking-[0.16em] text-brand-deep">
            {t(lang, "Selection workflow", "තෝරාගැනීමේ ක්‍රියාවලිය")}
          </h4>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {POINT_SELECTION_WORKFLOW.map((item, idx) => (
              <li
                key={item.step}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-sm ${
                  idx === 0
                    ? "border-emerald-300 bg-emerald-50/70"
                    : "border-black/10 bg-mist/40"
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                    idx === 0 ? "bg-emerald-600 text-white" : "bg-ink text-white"
                  }`}
                >
                  {item.step}
                </span>
                <div>
                  {lang !== "si" && <span className="block font-bold text-ink">{item.en}</span>}
                  {lang !== "en" && <span className="block text-xs text-ink/65">{item.si}</span>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardTopRef}
      className="scroll-mt-24 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/8"
    >
      {/* Header & Language Switcher */}
      <div className="border-b border-black/10 bg-mist/60 px-5 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">
              {step === 1
                ? t(lang, "Stage 1: Initial Application (2–3 min)", "පළමු අදියර: මූලික අයදුම්පත")
                : t(
                    lang,
                    `Stage 2: Detailed Qualification · Section ${currentSection.code} of 06`,
                    `දෙවැනි අදියර: සවිස්තර ඇගයීම · කොටස ${currentSection.code} / 06`
                  )}
            </p>
            <h3 className="mt-1 text-xl font-extrabold text-ink sm:text-2xl">
              {lang !== "si" && currentSection.en}
              {lang === "both" && " | "}
              {lang !== "en" && (
                <span className={lang === "both" ? "text-brand-deep" : ""}>
                  {currentSection.si}
                </span>
              )}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Languages size={16} className="text-brand hidden sm:block" />
            <div
              role="group"
              aria-label="Form language"
              className="inline-flex rounded-xl border border-black/10 bg-white p-1 shadow-sm"
            >
              {(
                [
                  { id: "both", label: "EN + සිංහල" },
                  { id: "en", label: "English" },
                  { id: "si", label: "සිංහල" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLang(m.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    lang === m.id ? "bg-ink text-white" : "text-ink/65 hover:text-ink"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* 6-Section Step Pills with Clear Labels */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {POINT_SECTIONS.map((s) => {
            const active = s.id === step;
            const visited = s.id <= maxVisited;
            const done = s.id < step;
            const short = SHORT_LABELS[s.id];
            return (
              <button
                key={s.id}
                type="button"
                disabled={!visited}
                onClick={() => {
                  if (visited) {
                    setStep(s.id);
                    setError("");
                  }
                }}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-center transition ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : done
                    ? "bg-ink text-white"
                    : visited
                    ? "bg-white text-ink ring-1 ring-black/10 hover:bg-brand-soft"
                    : "cursor-not-allowed bg-black/5 text-ink/35"
                }`}
              >
                <span className="text-[11px] font-extrabold leading-none">{s.code}</span>
                <span className="mt-1 hidden text-[10px] font-semibold leading-tight opacity-90 sm:block">
                  {lang === "si" ? short.si : short.en}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Body */}
      <div className="p-5 sm:p-8 lg:p-10">
        {/* ================= 01: INITIAL ONLINE REGISTRATION ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label en="Full name" si="සම්පූර්ණ නම" lang={lang} />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                maxLength={120}
                placeholder={lang === "si" ? "සම්පූර්ණ නම ඇතුළත් කරන්න" : "Enter your full name"}
                className={inputCls}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label en="Mobile number" si="ජංගම දුරකථන අංකය" lang={lang} />
                <input
                  type="tel"
                  value={form.mobileNumber}
                  onChange={(e) => update("mobileNumber", e.target.value)}
                  maxLength={24}
                  placeholder="07X XXX XXXX"
                  className={inputCls}
                />
              </div>
              <div>
                <Label en="Email address" si="විද්‍යුත් තැපැල් ලිපිනය" lang={lang} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  maxLength={200}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label en="Residential district" si="පදිංචි දිස්ත්‍රික්කය" lang={lang} />
                <select
                  value={form.residentialDistrict}
                  onChange={(e) => update("residentialDistrict", e.target.value)}
                  className={inputCls}
                >
                  <option value="">{t(lang, "Select district", "දිස්ත්‍රික්කය තෝරන්න")}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label en="Preferred franchise district" si="කැමති ව්‍යාපාරික දිස්ත්‍රික්කය" lang={lang} />
                <select
                  value={form.preferredDistrict}
                  onChange={(e) => update("preferredDistrict", e.target.value)}
                  className={inputCls}
                >
                  <option value="">{t(lang, "Select franchise district", "දිස්ත්‍රික්කය තෝරන්න")}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label en="Preferred REDCAT Point" si="කැමති REDCAT Point ස්ථානය" lang={lang} />
                <input
                  type="text"
                  list="point-locations"
                  value={form.preferredPoint}
                  onChange={(e) => update("preferredPoint", e.target.value)}
                  maxLength={100}
                  placeholder={lang === "si" ? "නගරය ඇතුළත් කරන්න (උදා: හොරණ)" : "Enter town or select (e.g. Horana)"}
                  className={inputCls}
                />
                <datalist id="point-locations">
                  {(districtHubs.length > 0 ? districtHubs : HUBS).map((h) => (
                    <option key={h.id} value={h.name} />
                  ))}
                </datalist>
              </div>

              <div>
                <Label
                  en="Second preference (optional)"
                  si="දෙවැනි කැමැත්ත (අනිවාර්ය නොවේ)"
                  lang={lang}
                  required={false}
                />
                <input
                  type="text"
                  list="point-locations"
                  value={form.secondPreference}
                  onChange={(e) => update("secondPreference", e.target.value)}
                  maxLength={100}
                  placeholder={lang === "si" ? "විකල්ප ස්ථානය" : "Alternative town / Point"}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <Label en="Current occupation" si="වර්තමාන රැකියාව" lang={lang} />
              <OptionGroup
                name="currentOccupation"
                options={POINT_OCCUPATION_INITIAL}
                value={form.currentOccupation}
                onChange={(v) => update("currentOccupation", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label en="Available investment (LKR million)" si="ආයෝජනය කළ හැකි මුදල (රු. මිලියන)" lang={lang} />
              <OptionGroup
                name="availableInvestment"
                options={POINT_INVESTMENT_OPTIONS}
                value={form.availableInvestment}
                onChange={(v) => update("availableInvestment", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label en="Business premises" si="ව්‍යාපාරික ගොඩනැගිල්ල" lang={lang} />
              <OptionGroup
                name="businessPremises"
                options={POINT_PREMISES_OPTIONS}
                value={form.businessPremises}
                onChange={(v) => update("businessPremises", v)}
                lang={lang}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between">
                <Label en="Previous business experience" si="පෙර ව්‍යාපාරික පළපුරුද්ද" lang={lang} />
                <OptionGroup
                  name="previousBusinessExperience"
                  options={YES_NO_OPTIONS}
                  value={form.previousBusinessExperience}
                  onChange={(v) => update("previousBusinessExperience", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
              <div className="flex flex-col justify-between">
                <Label en="When can you start?" si="ආරම්භ කළ හැක්කේ කවදාද?" lang={lang} />
                <OptionGroup
                  name="whenCanYouStart"
                  options={POINT_START_OPTIONS}
                  value={form.whenCanYouStart}
                  onChange={(v) => update("whenCanYouStart", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
            </div>

            {/* Privacy notice & consents */}
            <div className="space-y-3 border-t border-black/10 pt-6">
              <p className="text-xs font-semibold text-ink/65">
                {t(lang, "Submission does not guarantee approval.", "අයදුම් කිරීම අනුමැතිය සහතික නොකරයි.")}
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black/10 bg-white p-3.5 transition hover:border-black/25">
                <input
                  type="checkbox"
                  checked={form.agreePrivacyTerms}
                  onChange={(e) => update("agreePrivacyTerms", e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                    form.agreePrivacyTerms ? "border-brand bg-brand text-white" : "border-ink/30 bg-white"
                  }`}
                >
                  {form.agreePrivacyTerms && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {t(
                    lang,
                    "I agree to the REDCAT Privacy Notice and Point Franchise Application Terms. *",
                    "REDCAT පෞද්ගලිකත්ව නිවේදනය හා අයදුම්පත් කොන්දේසි සඳහා එකඟ වෙමි. *"
                  )}
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black/10 bg-white p-3.5 transition hover:border-black/25">
                <input
                  type="checkbox"
                  checked={form.agreeContact}
                  onChange={(e) => update("agreeContact", e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                    form.agreeContact ? "border-brand bg-brand text-white" : "border-ink/30 bg-white"
                  }`}
                >
                  {form.agreeContact && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {t(
                    lang,
                    "I consent to be contacted by the REDCAT Franchise Development Team regarding my application. *",
                    "මාගේ අයදුම්පත සම්බන්ධයෙන් REDCAT කණ්ඩායම මා හා සම්බන්ධ වීමට එකඟ වෙමි. *"
                  )}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ================= 02: PERSONAL & LOCATION DETAILS ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label en="WhatsApp number" si="WhatsApp අංකය" lang={lang} required={false} />
                <input
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) => update("whatsappNumber", e.target.value)}
                  maxLength={24}
                  placeholder="07X XXX XXXX"
                  className={inputCls}
                />
              </div>
              <div>
                <Label en="Residential town" si="පදිංචි නගරය" lang={lang} />
                <input
                  type="text"
                  value={form.residentialTown}
                  onChange={(e) => update("residentialTown", e.target.value)}
                  maxLength={100}
                  placeholder={lang === "si" ? "පදිංචි නගරය" : "Enter your residential town"}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <Label en="Occupation details (optional)" si="රැකියාව පිළිබඳ විස්තර (අනිවාර්ය නොවේ)" lang={lang} required={false} />
              <OptionGroup
                name="occupationDetails"
                options={POINT_OCCUPATION_DETAILED}
                value={form.occupationDetails}
                onChange={(v) => update("occupationDetails", v)}
                lang={lang}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between">
                <Label en="Knowledge of preferred area" si="කැමති ප්‍රදේශය පිළිබඳ දැනුම" lang={lang} />
                <OptionGroup
                  name="knowledgeOfPreferredArea"
                  options={YES_NO_OPTIONS}
                  value={form.knowledgeOfPreferredArea}
                  onChange={(v) => update("knowledgeOfPreferredArea", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
              <div className="flex flex-col justify-between">
                <Label en="Existing local business contacts" si="ප්‍රදේශයේ ව්‍යාපාරික සම්බන්ධතා" lang={lang} />
                <OptionGroup
                  name="existingLocalContacts"
                  options={YES_NO_OPTIONS}
                  value={form.existingLocalContacts}
                  onChange={(v) => update("existingLocalContacts", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 03: BUSINESS EXPERIENCE ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label en="Currently operating a business?" si="දැනට ව්‍යාපාරයක් පවත්වාගෙන යනවාද?" lang={lang} />
              <OptionGroup
                name="currentlyOperatingBusiness"
                options={YES_NO_OPTIONS}
                value={form.currentlyOperatingBusiness}
                onChange={(v) => update("currentlyOperatingBusiness", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label en="Years of business experience" si="ව්‍යාපාරික පළපුරුද්ද වසර" lang={lang} />
              <OptionGroup
                name="yearsBusinessExperience"
                options={POINT_YEARS_OPTIONS}
                value={form.yearsBusinessExperience}
                onChange={(v) => update("yearsBusinessExperience", v)}
                lang={lang}
                columns="sm:grid-cols-2 lg:grid-cols-4"
              />
            </div>

            <div>
              <Label en="Current business type" si="දැනට පවතින ව්‍යාපාර වර්ගය" lang={lang} required={false} />
              <input
                type="text"
                value={form.currentBusinessType}
                onChange={(e) => update("currentBusinessType", e.target.value)}
                maxLength={120}
                placeholder="e.g. Pharmacy, Stationery, Supermarket, Communication"
                className={inputCls}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between">
                <Label en="Courier or logistics experience" si="කුරියර් හෝ ප්‍රවාහන පළපුරුද්ද" lang={lang} />
                <OptionGroup
                  name="courierLogisticsExperience"
                  options={YES_NO_OPTIONS}
                  value={form.courierLogisticsExperience}
                  onChange={(v) => update("courierLogisticsExperience", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
              <div className="flex flex-col justify-between">
                <Label en="Customer service experience" si="පාරිභෝගික සේවා පළපුරුද්ද" lang={lang} />
                <OptionGroup
                  name="customerServiceExperience"
                  options={YES_NO_OPTIONS}
                  value={form.customerServiceExperience}
                  onChange={(v) => update("customerServiceExperience", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
            </div>

            <div>
              <Label en="Computer and mobile app skills" si="පරිගණක හා ජංගම යෙදුම් භාවිත හැකියාව" lang={lang} />
              <OptionGroup
                name="computerAppSkills"
                options={SKILL_LEVEL_OPTIONS}
                value={form.computerAppSkills}
                onChange={(v) => update("computerAppSkills", v)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ================= 04: FINANCIAL CAPABILITY ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand/25 bg-brand-soft/45 p-4 text-sm font-semibold text-ink">
              {t(
                lang,
                "Investment bands are proposed; align with final fees and working capital requirements.",
                "ආයෝජන පරාස යෝජිත ඒවාය. අවසාන ගාස්තු හා මෙහෙයුම් ප්‍රාග්ධන අවශ්‍යතා අනුව සකස් කරන්න."
              )}
            </div>

            <div>
              <Label en="Are investment funds ready?" si="ආයෝජන මුදල් සූදානම්ද?" lang={lang} />
              <OptionGroup
                name="investmentFundsReady"
                options={FUNDS_READY_OPTIONS}
                value={form.investmentFundsReady}
                onChange={(v) => update("investmentFundsReady", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label en="Funding source" si="මුදල් ලබාගන්නා මාර්ගය" lang={lang} />
              <OptionGroup
                name="fundingSource"
                options={FUNDING_SOURCE_OPTIONS}
                value={form.fundingSource}
                onChange={(v) => update("fundingSource", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label en="Additional working capital available?" si="අමතර මෙහෙයුම් ප්‍රාග්ධනය තිබේද?" lang={lang} />
              <OptionGroup
                name="additionalWorkingCapital"
                options={WORKING_CAP_OPTIONS}
                value={form.additionalWorkingCapital}
                onChange={(v) => update("additionalWorkingCapital", v)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ================= 05: BUSINESS PREMISES ================= */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <Label en="Premises size (sq. ft.)" si="ගොඩනැගිල්ලේ ප්‍රමාණය (වර්ග අඩි)" lang={lang} />
              <OptionGroup
                name="premisesSize"
                options={POINT_SIZE_OPTIONS}
                value={form.premisesSize}
                onChange={(v) => update("premisesSize", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between">
                <Label en="Main road frontage?" si="ප්‍රධාන මාර්ගයට මුහුණලා තිබේද?" lang={lang} />
                <OptionGroup
                  name="mainRoadFrontage"
                  options={YES_NO_OPTIONS}
                  value={form.mainRoadFrontage}
                  onChange={(v) => update("mainRoadFrontage", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
              <div className="flex flex-col justify-between">
                <Label en="Parking available?" si="වාහන නැවැත්වීමේ පහසුකම් තිබේද?" lang={lang} />
                <OptionGroup
                  name="parkingAvailable"
                  options={YES_NO_OPTIONS}
                  value={form.parkingAvailable}
                  onChange={(v) => update("parkingAvailable", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
            </div>

            <div>
              <Label en="Existing business at site?" si="එම ස්ථානයේ දැනට ව්‍යාපාරයක් තිබේද?" lang={lang} />
              <OptionGroup
                name="existingBusinessAtSite"
                options={YES_NO_OPTIONS}
                value={form.existingBusinessAtSite}
                onChange={(v) => update("existingBusinessAtSite", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label en="Proposed business address" si="යෝජිත ව්‍යාපාරික ලිපිනය" lang={lang} required={false} />
              <textarea
                rows={2}
                value={form.proposedBusinessAddress}
                onChange={(e) => update("proposedBusinessAddress", e.target.value)}
                maxLength={400}
                placeholder="Street address or town landmark"
                className={inputCls}
              />
            </div>

            <div>
              <Label en="Google Maps location" si="Google Maps ස්ථානය" lang={lang} required={false} />
              <div className="relative">
                <MapPin size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={form.googleMapsLocation}
                  onChange={(e) => update("googleMapsLocation", e.target.value)}
                  maxLength={300}
                  placeholder="Paste Google Maps pin link (optional)"
                  className={`${inputCls} pl-11`}
                />
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-mist/60 p-4 text-xs font-medium text-ink/75">
              {t(
                lang,
                "Identity documents, bank statements, business registration, and building photographs are collected securely after initial review.",
                "හැඳුනුම්පත්, බැංකු වාර්තා, ව්‍යාපාර ලියාපදිංචි ලේඛන හා ඡායාරූප දෙවැනි අදියරේදී පමණක් ආරක්ෂිතව ලබාගනු ඇත."
              )}
            </div>
          </div>
        )}

        {/* ================= 06: OPERATIONAL COMMITMENT ================= */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <Label en="Who will manage the Point?" si="Point එක කළමනාකරණය කරන්නේ කවුද?" lang={lang} />
              <OptionGroup
                name="whoWillManagePoint"
                options={POINT_MANAGER_OPTIONS}
                value={form.whoWillManagePoint}
                onChange={(v) => update("whoWillManagePoint", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label en="Main or additional business?" si="ප්‍රධාන හෝ අමතර ව්‍යාපාරයක්ද?" lang={lang} />
              <OptionGroup
                name="mainOrAdditionalBusiness"
                options={POINT_BUSINESS_MODE_OPTIONS}
                value={form.mainOrAdditionalBusiness}
                onChange={(v) => update("mainOrAdditionalBusiness", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between">
                <Label en="Ready to recruit staff?" si="සේවකයන් බඳවා ගැනීමට සූදානම්ද?" lang={lang} />
                <OptionGroup
                  name="readyToRecruitStaff"
                  options={YES_NO_OPTIONS}
                  value={form.readyToRecruitStaff}
                  onChange={(v) => update("readyToRecruitStaff", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
              <div className="flex flex-col justify-between">
                <Label en="Can meet required service hours?" si="නියමිත සේවා වේලාවන් පිළිපැදිය හැකිද?" lang={lang} />
                <OptionGroup
                  name="canMeetServiceHours"
                  options={YES_NO_OPTIONS}
                  value={form.canMeetServiceHours}
                  onChange={(v) => update("canMeetServiceHours", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col justify-between">
                <Label en="Willing to complete REDCAT training?" si="REDCAT පුහුණුව සම්පූර්ණ කිරීමට කැමතිද?" lang={lang} />
                <OptionGroup
                  name="willingToCompleteTraining"
                  options={YES_NO_OPTIONS}
                  value={form.willingToCompleteTraining}
                  onChange={(v) => update("willingToCompleteTraining", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
              <div className="flex flex-col justify-between">
                <Label en="Willing to use REDCAT IT system?" si="REDCAT IT පද්ධතිය භාවිත කිරීමට කැමතිද?" lang={lang} />
                <OptionGroup
                  name="willingToUseItSystem"
                  options={YES_NO_OPTIONS}
                  value={form.willingToUseItSystem}
                  onChange={(v) => update("willingToUseItSystem", v)}
                  lang={lang}
                  columns="grid-cols-2"
                />
              </div>
            </div>

            <div>
              <Label en="Agree to operational standards?" si="මෙහෙයුම් ප්‍රමිතීන්ට එකඟද?" lang={lang} />
              <OptionGroup
                name="agreeOperationalStandards"
                options={YES_NO_OPTIONS}
                value={form.agreeOperationalStandards}
                onChange={(v) => update("agreeOperationalStandards", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center gap-2.5 rounded-xl border border-brand/30 bg-brand-soft/60 px-4 py-3 text-sm font-bold text-brand-deep"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={busy}
              className="press inline-flex items-center gap-2 rounded-full border-2 border-black/15 px-6 py-3.5 text-sm font-bold text-ink transition hover:border-ink"
            >
              <ArrowLeft size={16} />
              {t(lang, "Previous", "පෙර")}
            </button>
          ) : (
            <div />
          )}

          <div className="flex flex-wrap items-center gap-3">
            {step === 1 && (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => submitApplication("initial")}
                  className="press inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-3.5 text-sm font-extrabold text-ink transition hover:bg-mist disabled:opacity-50"
                >
                  {busy ? <LoaderCircle size={16} className="animate-spin" /> : null}
                  {t(lang, "Submit Initial Application", "මූලික අයදුම්පත යොමු කරන්න")}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleNext}
                  className="press inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep"
                >
                  {t(lang, "Continue to Stage 2", "දෙවැනි අදියරට යන්න")}
                  <ArrowRight size={16} />
                </button>
              </>
            )}

            {step > 1 && step < 6 && (
              <button
                type="button"
                onClick={handleNext}
                className="press inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand"
              >
                {t(lang, "Next section", "ඊළඟ")}
                <ArrowRight size={16} />
              </button>
            )}

            {step === 6 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => submitApplication("detailed")}
                className="press inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    {t(lang, "Submitting…", "යොමු කරමින්…")}
                  </>
                ) : (
                  <>
                    {t(lang, "Submit Detailed Application", "සවිස්තර අයදුම්පත යොමු කරන්න")}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
