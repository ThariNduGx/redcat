"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
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
  COMMENCE_WHEN_OPTIONS,
  COMPUTER_KNOWLEDGE_OPTIONS,
  COORDINATE_POINTS_OPTIONS,
  DAILY_MANAGER_OPTIONS,
  EARLY_NIGHT_ACCESS_OPTIONS,
  EMPLOYEES_MANAGED_OPTIONS,
  EXPERIENCE_YEARS_OPTIONS,
  FAMILIARITY_OPTIONS,
  FLOOR_AREA_OPTIONS,
  FUNDS_AVAILABILITY_OPTIONS,
  HEAR_ABOUT_OPTIONS,
  HUB_FRANCHISE_CPANEL_URL,
  INVESTMENT_OPTIONS,
  INVESTMENT_SOURCE_OPTIONS,
  OCCUPATION_OPTIONS,
  PREMISES_STATUS_OPTIONS,
  PRIMARY_BUSINESS_OPTIONS,
  SECTIONS,
  SELECTION_PROCESS,
  THREE_MONTHS_OPS_OPTIONS,
  TRANSPORT_ARRANGEMENT_OPTIONS,
  VEHICLE_ACCESS_OPTIONS,
  VEHICLE_COUNT_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  YES_NO_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  scoreHubFranchise,
  type HubFranchiseFormData,
  type OptionItem,
} from "@/lib/hubFranchise";
import { trackDealerEnquiry, trackMetaEvent } from "@/lib/analytics";

type LangMode = "both" | "en" | "si";

const STORAGE_KEY = "redcat_hub_franchise_draft_v1";

const inputCls =
  "mt-2 block w-full rounded-xl border-2 border-black/10 bg-white px-4 py-3 text-base font-medium text-ink outline-none transition placeholder:text-ink/35 hover:border-black/25 focus:border-brand";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function initialFormData(): HubFranchiseFormData {
  return {
    fullName: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    residentialDistrict: "",
    residentialTown: "",
    currentOccupation: "",
    preferredDistrict: "",
    firstPreferredHub: "",
    secondPreferredHub: "",
    operatingAreaFamiliarity: "",
    existingBusinessConnections: "",
    currentlyOperateBusiness: "",
    currentBusinessType: "",
    yearsExperience: "",
    logisticsExperience: "",
    largestEmployeesManaged: "",
    totalAvailableInvestment: "",
    fundsCurrentlyAvailable: "",
    investmentSource: "",
    fundThreeMonthsOps: "",
    suitablePremises: "",
    availableFloorArea: "",
    vehicleAccessParkingLoading: "",
    earlyNightAccess: "",
    proposedHubAddress: "",
    googleMapsLocation: "",
    ownCommercialVehicles: "",
    availableVehicleTypes: [],
    vehicleCountForRedcat: "",
    transportArrangement: "",
    manageMaintenanceFuelDrivers: "",
    dailyManager: "",
    primaryBusiness: "",
    recruitManageStaffDrivers: "",
    coordinatePoints: "",
    maintainShifts: "",
    operateDailyWeekendsHolidays: "",
    followProcedures: "",
    computerMobileKnowledge: "",
    useRedcatItSystem: "",
    completeThreeDayCourse: "",
    commenceWhen: "",
    whyInterested: "",
    howDidYouHear: "",
    agreePrivacyTerms: false,
    agreeContact: false,
    applicantName: "",
    signature: "",
    declarationDate: todayIso(),
  };
}

function Label({
  num,
  en,
  si,
  lang,
  required = true,
}: {
  num: string;
  en: string;
  si: string;
  lang: LangMode;
  required?: boolean;
}) {
  return (
    <div className="mb-1">
      <span className="block text-base font-extrabold text-ink leading-snug">
        <span className="text-brand mr-1.5">{num}.</span>
        {lang !== "si" && <span>{en}</span>}
        {lang === "si" && <span>{si}</span>}
        {required && <span className="text-brand ml-1">*</span>}
      </span>
      {lang === "both" && (
        <span className="mt-0.5 block text-sm font-medium text-ink/65">{si}</span>
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

export default function HubFranchiseApplication() {
  const [step, setStep] = useState(1);
  const [maxVisited, setMaxVisited] = useState(1);
  const [lang, setLang] = useState<LangMode>("both");
  const [form, setForm] = useState<HubFranchiseFormData>(initialFormData);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string; score: number; tier: string } | null>(null);
  const cardTopRef = useRef<HTMLDivElement>(null);
  const attemptIdRef = useRef<string | null>(null);

  // Restore draft from sessionStorage on client mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setForm((prev) => ({ ...prev, ...parsed, declarationDate: parsed.declarationDate || todayIso() }));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Persist draft
  useEffect(() => {
    if (receipt) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      // ignore storage errors
    }
  }, [form, receipt]);

  function update<K extends keyof HubFranchiseFormData>(key: K, value: HubFranchiseFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function toggleVehicleType(val: string) {
    setForm((prev) => {
      if (val === "None") {
        return {
          ...prev,
          availableVehicleTypes: prev.availableVehicleTypes.includes("None") ? [] : ["None"],
        };
      }
      const withoutNone = prev.availableVehicleTypes.filter((v) => v !== "None");
      const exists = withoutNone.includes(val);
      return {
        ...prev,
        availableVehicleTypes: exists
          ? withoutNone.filter((v) => v !== val)
          : [...withoutNone, val],
      };
    });
    if (error) setError("");
  }

  function scrollToCard() {
    cardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateStep(s: number): string | null {
    switch (s) {
      case 1:
        if (!form.fullName.trim()) return "Please enter your full name (01).";
        if (!/^[+\d][\d\s() -]{6,18}$/.test(form.mobileNumber.trim()))
          return "Please enter a valid mobile number (02).";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
          return "Please enter a valid email address (04).";
        if (!form.residentialDistrict) return "Please select your residential district (05).";
        if (!form.residentialTown.trim()) return "Please enter your residential town (06).";
        if (!form.currentOccupation) return "Please select your current occupation (07).";
        return null;
      case 2:
        if (!form.preferredDistrict) return "Please select your preferred district (08).";
        if (!form.firstPreferredHub) return "Please select your first preferred Hub (09).";
        if (!form.operatingAreaFamiliarity) return "Please select your familiarity with the operating area (11).";
        if (!form.existingBusinessConnections) return "Please answer question 12 regarding local business connections.";
        return null;
      case 3:
        if (!form.currentlyOperateBusiness) return "Please answer question 13.";
        if (!form.currentBusinessType) return "Please select your current business type (14).";
        if (!form.yearsExperience) return "Please select your years of business or management experience (15).";
        if (!form.logisticsExperience) return "Please answer question 16 regarding logistics experience.";
        if (!form.largestEmployeesManaged) return "Please select the largest number of employees managed (17).";
        return null;
      case 4:
        if (!form.totalAvailableInvestment) return "Please select your total available investment (18).";
        if (!form.fundsCurrentlyAvailable) return "Please indicate whether funds are currently available (19).";
        if (!form.investmentSource) return "Please select your source of investment (20).";
        if (!form.fundThreeMonthsOps) return "Please answer question 21 regarding initial operating expenses.";
        return null;
      case 5:
        if (!form.suitablePremises) return "Please select your premises status (22).";
        if (!form.availableFloorArea) return "Please select the available floor area (23).";
        if (!form.vehicleAccessParkingLoading) return "Please answer question 24 regarding vehicle access and loading.";
        if (!form.earlyNightAccess) return "Please answer question 25 regarding early morning and night access.";
        return null;
      case 6:
        if (!form.ownCommercialVehicles) return "Please answer question 28 regarding commercial vehicles.";
        if (form.availableVehicleTypes.length === 0) return "Please select available vehicle types or None (29).";
        if (!form.vehicleCountForRedcat) return "Please select the number of vehicles available for REDCAT (30).";
        if (!form.transportArrangement) return "Please select how you will arrange transport (31).";
        if (!form.manageMaintenanceFuelDrivers) return "Please answer question 32.";
        return null;
      case 7:
        if (!form.dailyManager) return "Please select who will manage daily Hub operations (33).";
        if (!form.primaryBusiness) return "Please answer question 34.";
        if (!form.recruitManageStaffDrivers) return "Please answer question 35.";
        if (!form.coordinatePoints) return "Please answer question 36.";
        if (!form.maintainShifts) return "Please answer question 37.";
        if (!form.operateDailyWeekendsHolidays) return "Please answer question 38.";
        if (!form.followProcedures) return "Please answer question 39.";
        return null;
      case 8:
        if (!form.computerMobileKnowledge) return "Please select your computer and mobile app knowledge (40).";
        if (!form.useRedcatItSystem) return "Please answer question 41.";
        if (!form.completeThreeDayCourse) return "Please answer question 42.";
        return null;
      case 9:
        if (!form.commenceWhen) return "Please select when you can commence operations (43).";
        if (!form.whyInterested.trim()) return "Please tell us why you are interested in a REDCAT Hub franchise (44).";
        if (!form.howDidYouHear) return "Please select how you heard about REDCAT (45).";
        return null;
      case 10:
        if (!form.agreePrivacyTerms) return "Please agree to the REDCAT Privacy Policy and Franchise Application Terms.";
        if (!form.agreeContact) return "Please agree to be contacted regarding your application.";
        if (!form.applicantName.trim()) return "Please enter the applicant name.";
        if (!form.signature.trim()) return "Please enter your signature (full name).";
        if (!form.declarationDate) return "Please enter the declaration date.";
        return null;
      default:
        return null;
    }
  }

  function handleNext() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    const nextStep = Math.min(10, step + 1);
    setForm((prev) => {
      if (nextStep === 10 && !prev.applicantName && prev.fullName) {
        return { ...prev, applicantName: prev.fullName };
      }
      return prev;
    });
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;

    const err = validateStep(10);
    if (err) {
      setError(err);
      return;
    }

    setBusy(true);
    setError("");

    const id = attemptIdRef.current ?? crypto.randomUUID();
    attemptIdRef.current = id;
    const score = scoreHubFranchise(form);

    try {
      // 1. Submit structured JSON to cPanel PHP endpoint
      const cpanelPromise = fetch(HUB_FRANCHISE_CPANEL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
        signal: AbortSignal.timeout(25_000),
        credentials: "omit",
      })
        .then(async (res) => {
          const json = await res.json().catch(() => null);
          return res.ok && json?.id ? json : null;
        })
        .catch(() => null);

      // 2. Backup email notification via FormSubmit so no application is ever lost
      const formSubmitPromise = fetch("https://formsubmit.co/ajax/info@redcat.lk", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `[REDCAT Hub Franchise] ${form.firstPreferredHub} (${form.preferredDistrict}) - ${form.fullName} [${score.tier}: ${score.total}/100]`,
          _replyto: form.email,
          _template: "table",
          _captcha: "false",
          "Reference ID": id,
          "Qualification Score": `${score.total}/100 (Tier ${score.tier} - ${score.tierLabel.en})`,
          "01. Full Name": form.fullName,
          "02. Mobile": form.mobileNumber,
          "03. WhatsApp": form.whatsappNumber || "Same / Not provided",
          "04. Email": form.email,
          "05. Residential District": form.residentialDistrict,
          "06. Residential Town": form.residentialTown,
          "07. Current Occupation": form.currentOccupation,
          "08. Preferred District": form.preferredDistrict,
          "09. First Preferred Hub": form.firstPreferredHub,
          "10. Second Preferred Hub": form.secondPreferredHub || "None",
          "11. Operating Area Familiarity": form.operatingAreaFamiliarity,
          "12. Local Business Connections": form.existingBusinessConnections,
          "13. Operates Business": form.currentlyOperateBusiness,
          "14. Business Type": form.currentBusinessType,
          "15. Experience Years": form.yearsExperience,
          "16. Logistics Experience": form.logisticsExperience,
          "17. Largest Employees Managed": form.largestEmployeesManaged,
          "18. Total Investment": form.totalAvailableInvestment,
          "19. Funds Available": form.fundsCurrentlyAvailable,
          "20. Investment Source": form.investmentSource,
          "21. Fund 3 Months Ops": form.fundThreeMonthsOps,
          "22. Suitable Premises": form.suitablePremises,
          "23. Floor Area": form.availableFloorArea,
          "24. Vehicle Access/Loading": form.vehicleAccessParkingLoading,
          "25. Early/Night Access": form.earlyNightAccess,
          "26. Proposed Hub Address": form.proposedHubAddress || "Not provided",
          "27. Google Maps Location": form.googleMapsLocation || "Not provided",
          "28. Owns Commercial Vehicles": form.ownCommercialVehicles,
          "29. Vehicle Types": form.availableVehicleTypes.join(", "),
          "30. Vehicles for REDCAT": form.vehicleCountForRedcat,
          "31. Transport Arrangement": form.transportArrangement,
          "32. Manage Maintenance/Fuel/Drivers": form.manageMaintenanceFuelDrivers,
          "33. Daily Manager": form.dailyManager,
          "34. Primary Business": form.primaryBusiness,
          "35. Recruit & Manage Staff": form.recruitManageStaffDrivers,
          "36. Coordinate 10-20 Points": form.coordinatePoints,
          "37. Maintain Morning/Evening Shifts": form.maintainShifts,
          "38. Operate Daily incl. Weekends": form.operateDailyWeekendsHolidays,
          "39. Follow SOPs": form.followProcedures,
          "40. Computer/App Knowledge": form.computerMobileKnowledge,
          "41. Use REDCAT IT System": form.useRedcatItSystem,
          "42. 3-Day Certificate Course": form.completeThreeDayCourse,
          "43. Commence When": form.commenceWhen,
          "44. Why Interested": form.whyInterested,
          "45. How Heard": form.howDidYouHear,
          "Declaration Signature & Date": `${form.signature} (${form.declarationDate})`,
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
          role: "Regional Hub Franchise",
          district: form.preferredDistrict,
          name: form.fullName,
        });
        trackMetaEvent("track", "SubmitApplication", {
          content_name: "Regional Hub Franchise Application",
          district: form.preferredDistrict,
          hub: form.firstPreferredHub,
        });
        setReceipt({
          id: cpanelRes?.id || id,
          score: cpanelRes?.score ?? score.total,
          tier: cpanelRes?.tier ?? score.tier,
        });
        scrollToCard();
      } else {
        setError("We couldn't confirm your submission right now. Please check your connection and try again.");
      }
    } catch {
      setError("We couldn't confirm your submission right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // Hubs filtered for preferred district (with all hubs available below)
  const districtHubs = HUBS.filter((h) => h.district === form.preferredDistrict);
  const otherHubs = HUBS.filter((h) => h.district !== form.preferredDistrict);

  const currentSection = SECTIONS[step - 1];

  if (receipt) {
    return (
      <div
        ref={cardTopRef}
        className="scroll-mt-24 rounded-[2rem] bg-white p-8 shadow-2xl shadow-black/10 sm:p-12"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={34} />
          </span>
          <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Application Received!
          </h3>
          <p className="mt-1 text-base font-bold text-ink/70">
            ඔබගේ අයදුම්පත සාර්ථකව ලැබී ඇත!
          </p>
          <p className="mt-4 text-base text-ink/75">
            Thank you, <strong>{form.fullName}</strong>. Your Regional Hub Franchise application for{" "}
            <strong>{form.firstPreferredHub}</strong> ({form.preferredDistrict}) has been recorded.
          </p>
          <div className="mt-6 inline-block rounded-2xl border border-black/10 bg-mist px-6 py-4 text-left">
            <span className="block text-xs font-bold uppercase tracking-wider text-ink/50">
              Application Reference ID
            </span>
            <strong className="mt-1 block break-all font-mono text-sm font-bold text-ink">
              {receipt.id}
            </strong>
          </div>
          <p className="mt-6 text-sm text-ink/65">
            Our franchise development team will review your application and contact you at{" "}
            <strong>{form.mobileNumber}</strong>. Submission does not guarantee approval or reservation of a franchise.
          </p>
        </div>

        {/* 11-Step Selection Process */}
        <div className="mt-10 border-t border-black/10 pt-8">
          <h4 className="text-center text-sm font-extrabold uppercase tracking-[0.16em] text-brand-deep">
            Selection process / තෝරාගැනීමේ ක්‍රියාවලිය
          </h4>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SELECTION_PROCESS.map((item, idx) => (
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
                  <span className="block font-bold text-ink">{item.en}</span>
                  <span className="block text-xs text-ink/65">{item.si}</span>
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
      className="scroll-mt-24 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5"
    >
      {/* Top Bar: Language Toggle & Overall Progress */}
      <div className="border-b border-black/10 bg-mist/60 px-5 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand">
              Section {currentSection.code} of 10
            </p>
            <h3 className="mt-1 text-xl font-extrabold text-ink sm:text-2xl">
              {lang !== "si" && currentSection.en}
              {lang === "both" && " / "}
              {lang !== "en" && (
                <span className={lang === "both" ? "text-brand-deep" : ""}>
                  {currentSection.si}
                </span>
              )}
            </h3>
          </div>

          {/* Language Switcher */}
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
                    lang === m.id
                      ? "bg-ink text-white"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 10-Step Pill Navigation */}
        <div className="mt-5 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
          {SECTIONS.map((s) => {
            const active = s.id === step;
            const visited = s.id <= maxVisited;
            const done = s.id < step;
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
                title={`${s.code}. ${s.en}`}
                className={`flex flex-col items-center rounded-xl py-2 text-xs font-bold transition ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : done
                    ? "bg-ink text-white hover:bg-ink/85"
                    : visited
                    ? "bg-white text-ink ring-1 ring-black/10 hover:bg-brand-soft"
                    : "cursor-not-allowed bg-black/5 text-ink/35"
                }`}
              >
                <span>{s.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-8 lg:p-10">
        {/* ================= SECTION 01: PERSONAL INFORMATION ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label num="01" en="Full name" si="සම්පූර්ණ නම" lang={lang} />
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                maxLength={120}
                placeholder="Enter your full name"
                className={inputCls}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label num="02" en="Mobile number" si="ජංගම දුරකථන අංකය" lang={lang} />
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
                <Label
                  num="03"
                  en="WhatsApp number"
                  si="WhatsApp අංකය"
                  lang={lang}
                  required={false}
                />
                <input
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) => update("whatsappNumber", e.target.value)}
                  maxLength={24}
                  placeholder="07X XXX XXXX (if different)"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <Label num="04" en="Email address" si="විද්‍යුත් තැපැල් ලිපිනය" lang={lang} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={200}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label num="05" en="Residential district" si="පදිංචි දිස්ත්‍රික්කය" lang={lang} />
                <select
                  value={form.residentialDistrict}
                  onChange={(e) => update("residentialDistrict", e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select district / දිස්ත්‍රික්කය තෝරන්න</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label num="06" en="Residential town" si="පදිංචි නගරය" lang={lang} />
                <input
                  type="text"
                  value={form.residentialTown}
                  onChange={(e) => update("residentialTown", e.target.value)}
                  maxLength={100}
                  placeholder="Enter your town"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <Label num="07" en="Current occupation" si="වර්තමාන රැකියාව" lang={lang} />
              <OptionGroup
                name="currentOccupation"
                options={OCCUPATION_OPTIONS}
                value={form.currentOccupation}
                onChange={(v) => update("currentOccupation", v)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 02: PREFERRED HUB LOCATION ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label num="08" en="Preferred district" si="කැමති දිස්ත්‍රික්කය" lang={lang} />
              <select
                value={form.preferredDistrict}
                onChange={(e) => {
                  const nextDist = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    preferredDistrict: nextDist,
                    firstPreferredHub: "",
                    secondPreferredHub: "",
                  }));
                  if (error) setError("");
                }}
                className={inputCls}
              >
                <option value="">Select preferred district / දිස්ත්‍රික්කය තෝරන්න</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label num="09" en="First preferred Hub" si="පළමු කැමැත්ත වන Hub ස්ථානය" lang={lang} />
                <select
                  value={form.firstPreferredHub}
                  onChange={(e) => update("firstPreferredHub", e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select first preferred Hub</option>
                  {districtHubs.length > 0 && (
                    <optgroup label={`${form.preferredDistrict} District Hubs`}>
                      {districtHubs.map((h) => (
                        <option key={h.id} value={h.name}>
                          {h.name} ({h.zone} · {h.district})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="All Other Regional Hubs">
                    {otherHubs.map((h) => (
                      <option key={h.id} value={h.name}>
                        {h.name} ({h.district})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <Label
                  num="10"
                  en="Second preferred Hub"
                  si="දෙවැනි කැමැත්ත වන Hub ස්ථානය"
                  lang={lang}
                  required={false}
                />
                <select
                  value={form.secondPreferredHub}
                  onChange={(e) => update("secondPreferredHub", e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select second preferred Hub (optional)</option>
                  {districtHubs.length > 0 && (
                    <optgroup label={`${form.preferredDistrict} District Hubs`}>
                      {districtHubs.map((h) => (
                        <option
                          key={h.id}
                          value={h.name}
                          disabled={h.name === form.firstPreferredHub}
                        >
                          {h.name} ({h.zone} · {h.district})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="All Other Regional Hubs">
                    {otherHubs.map((h) => (
                      <option
                        key={h.id}
                        value={h.name}
                        disabled={h.name === form.firstPreferredHub}
                      >
                        {h.name} ({h.district})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <Label
                num="11"
                en="Familiarity with operating area"
                si="මෙහෙයුම් ප්‍රදේශය පිළිබඳ අවබෝධය"
                lang={lang}
              />
              <OptionGroup
                name="operatingAreaFamiliarity"
                options={FAMILIARITY_OPTIONS}
                value={form.operatingAreaFamiliarity}
                onChange={(v) => update("operatingAreaFamiliarity", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="12"
                en="Existing local business connections?"
                si="ප්‍රදේශයේ ව්‍යාපාරික සම්බන්ධතා තිබේද?"
                lang={lang}
              />
              <OptionGroup
                name="existingBusinessConnections"
                options={YES_NO_OPTIONS}
                value={form.existingBusinessConnections}
                onChange={(v) => update("existingBusinessConnections", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 03: BUSINESS & MANAGEMENT EXPERIENCE ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label
                num="13"
                en="Do you currently operate a business?"
                si="දැනට ව්‍යාපාරයක් පවත්වාගෙන යනවාද?"
                lang={lang}
              />
              <OptionGroup
                name="currentlyOperateBusiness"
                options={YES_NO_OPTIONS}
                value={form.currentlyOperateBusiness}
                onChange={(v) => update("currentlyOperateBusiness", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="14"
                en="Current business type"
                si="දැනට පවත්වාගෙන යන ව්‍යාපාර වර්ගය"
                lang={lang}
              />
              <OptionGroup
                name="currentBusinessType"
                options={BUSINESS_TYPE_OPTIONS}
                value={form.currentBusinessType}
                onChange={(v) => update("currentBusinessType", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="15"
                en="Years of business or management experience"
                si="ව්‍යාපාරික හෝ කළමනාකරණ පළපුරුද්ද"
                lang={lang}
              />
              <OptionGroup
                name="yearsExperience"
                options={EXPERIENCE_YEARS_OPTIONS}
                value={form.yearsExperience}
                onChange={(v) => update("yearsExperience", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="16"
                en="Transport, distribution or logistics experience?"
                si="ප්‍රවාහන හෝ බෙදාහැරීම් පළපුරුද්ද තිබේද?"
                lang={lang}
              />
              <OptionGroup
                name="logisticsExperience"
                options={YES_NO_OPTIONS}
                value={form.logisticsExperience}
                onChange={(v) => update("logisticsExperience", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="17"
                en="Largest number of employees managed"
                si="කළමනාකරණය කළ උපරිම සේවක සංඛ්‍යාව"
                lang={lang}
              />
              <OptionGroup
                name="largestEmployeesManaged"
                options={EMPLOYEES_MANAGED_OPTIONS}
                value={form.largestEmployeesManaged}
                onChange={(v) => update("largestEmployeesManaged", v)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 04: FINANCIAL CAPABILITY ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand/25 bg-brand-soft/45 p-4 text-sm font-semibold text-ink">
              {lang !== "si" && (
                <p>
                  Proposed franchise fee: <strong>LKR 2–2.5 million</strong>, excluding premises,
                  vehicles, staffing and working capital.
                </p>
              )}
              {lang !== "en" && (
                <p className={lang === "both" ? "mt-1 text-ink/75" : ""}>
                  යෝජිත ගාස්තුව රු. මිලියන 2–2.5කි. ගොඩනැගිලි, වාහන, සේවක හා කාරක ප්‍රාග්ධන වියදම් වෙනම වේ.
                </p>
              )}
            </div>

            <div>
              <Label
                num="18"
                en="Total available investment"
                si="යෙදවිය හැකි මුළු ආයෝජන මුදල"
                lang={lang}
              />
              <OptionGroup
                name="totalAvailableInvestment"
                options={INVESTMENT_OPTIONS}
                value={form.totalAvailableInvestment}
                onChange={(v) => update("totalAvailableInvestment", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="19"
                en="Are funds currently available?"
                si="මුදල් දැනට සූදානම්ද?"
                lang={lang}
              />
              <OptionGroup
                name="fundsCurrentlyAvailable"
                options={FUNDS_AVAILABILITY_OPTIONS}
                value={form.fundsCurrentlyAvailable}
                onChange={(v) => update("fundsCurrentlyAvailable", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="20"
                en="Source of investment"
                si="ආයෝජන මුදල් ලබාගන්නා ආකාරය"
                lang={lang}
              />
              <OptionGroup
                name="investmentSource"
                options={INVESTMENT_SOURCE_OPTIONS}
                value={form.investmentSource}
                onChange={(v) => update("investmentSource", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="21"
                en="Can you fund three months of initial operating expenses?"
                si="පළමු මාස තුනේ මෙහෙයුම් වියදම් දැරිය හැකිද?"
                lang={lang}
              />
              <OptionGroup
                name="fundThreeMonthsOps"
                options={THREE_MONTHS_OPS_OPTIONS}
                value={form.fundThreeMonthsOps}
                onChange={(v) => update("fundThreeMonthsOps", v)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 05: PREMISES & INFRASTRUCTURE ================= */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand/25 bg-brand-soft/45 p-4 text-sm font-semibold text-ink">
              {lang !== "si" && (
                <p>
                  Proposed minimum: <strong>1,500 sq. ft.</strong> with parking and loading facilities.
                </p>
              )}
              {lang !== "en" && (
                <p className={lang === "both" ? "mt-1 text-ink/75" : ""}>
                  යෝජිත අවම ඉඩකඩ වර්ග අඩි 1,500කි. වාහන නැවැත්වීම හා පැටවීමේ පහසුකම් අවශ්‍යයි.
                </p>
              )}
            </div>

            <div>
              <Label
                num="22"
                en="Do you have suitable premises?"
                si="සුදුසු ගොඩනැගිල්ලක් තිබේද?"
                lang={lang}
              />
              <OptionGroup
                name="suitablePremises"
                options={PREMISES_STATUS_OPTIONS}
                value={form.suitablePremises}
                onChange={(v) => update("suitablePremises", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="23"
                en="Available floor area (sq. ft.)"
                si="පවතින ඉඩකඩ (වර්ග අඩි)"
                lang={lang}
              />
              <OptionGroup
                name="availableFloorArea"
                options={FLOOR_AREA_OPTIONS}
                value={form.availableFloorArea}
                onChange={(v) => update("availableFloorArea", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="24"
                en="Suitable vehicle access, parking and loading?"
                si="වාහන ප්‍රවේශය, නැවැත්වීම හා පැටවීමේ පහසුකම් තිබේද?"
                lang={lang}
              />
              <OptionGroup
                name="vehicleAccessParkingLoading"
                options={VEHICLE_ACCESS_OPTIONS}
                value={form.vehicleAccessParkingLoading}
                onChange={(v) => update("vehicleAccessParkingLoading", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="25"
                en="Early morning and night access?"
                si="අලුයම හා රාත්‍රී ප්‍රවේශය තිබේද?"
                lang={lang}
              />
              <OptionGroup
                name="earlyNightAccess"
                options={EARLY_NIGHT_ACCESS_OPTIONS}
                value={form.earlyNightAccess}
                onChange={(v) => update("earlyNightAccess", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="26"
                en="Proposed Hub address"
                si="යෝජිත Hub ලිපිනය"
                lang={lang}
                required={false}
              />
              <textarea
                rows={2}
                value={form.proposedHubAddress}
                onChange={(e) => update("proposedHubAddress", e.target.value)}
                maxLength={400}
                placeholder="Street address or landmark (if identified)"
                className={inputCls}
              />
            </div>

            <div>
              <Label
                num="27"
                en="Google Maps location"
                si="Google Maps ස්ථානය"
                lang={lang}
                required={false}
              />
              <div className="relative">
                <MapPin
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  type="text"
                  value={form.googleMapsLocation}
                  onChange={(e) => update("googleMapsLocation", e.target.value)}
                  maxLength={300}
                  placeholder="Paste Google Maps link or coordinates (optional)"
                  className={`${inputCls} pl-11`}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 06: TRANSPORT & VEHICLES ================= */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <Label
                num="28"
                en="Do you own commercial vehicles?"
                si="වාණිජ ප්‍රවාහන වාහන තිබේද?"
                lang={lang}
              />
              <OptionGroup
                name="ownCommercialVehicles"
                options={YES_NO_OPTIONS}
                value={form.ownCommercialVehicles}
                onChange={(v) => update("ownCommercialVehicles", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="29"
                en="Available vehicle types (select all)"
                si="පවතින වාහන වර්ග (අදාළ සියල්ල)"
                lang={lang}
              />
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {VEHICLE_TYPE_OPTIONS.map((opt) => {
                  const checked = form.availableVehicleTypes.includes(opt.value);
                  const label =
                    lang === "en"
                      ? opt.en
                      : lang === "si"
                      ? opt.si
                      : `${opt.en} / ${opt.si}`;
                  return (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-sm font-semibold transition ${
                        checked
                          ? "border-brand bg-brand-soft/45 text-ink shadow-sm"
                          : "border-black/10 bg-white text-ink/80 hover:border-black/25 hover:bg-mist/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleVehicleType(opt.value)}
                        className="sr-only"
                      />
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                          checked ? "border-brand bg-brand text-white" : "border-ink/30 bg-white"
                        }`}
                      >
                        {checked && <Check size={13} strokeWidth={3} />}
                      </span>
                      <span className="leading-snug">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <Label
                num="30"
                en="Number of vehicles available for REDCAT"
                si="REDCAT සඳහා වෙන් කළ හැකි වාහන ගණන"
                lang={lang}
              />
              <OptionGroup
                name="vehicleCountForRedcat"
                options={VEHICLE_COUNT_OPTIONS}
                value={form.vehicleCountForRedcat}
                onChange={(v) => update("vehicleCountForRedcat", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="31"
                en="How will you arrange transport?"
                si="ප්‍රවාහනය සපයාගන්නේ කෙසේද?"
                lang={lang}
              />
              <OptionGroup
                name="transportArrangement"
                options={TRANSPORT_ARRANGEMENT_OPTIONS}
                value={form.transportArrangement}
                onChange={(v) => update("transportArrangement", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="32"
                en="Can you manage maintenance, fuel and driver availability?"
                si="නඩත්තුව, ඉන්ධන හා රියදුරන් කළමනාකරණය කළ හැකිද?"
                lang={lang}
              />
              <OptionGroup
                name="manageMaintenanceFuelDrivers"
                options={YES_NO_OPTIONS}
                value={form.manageMaintenanceFuelDrivers}
                onChange={(v) => update("manageMaintenanceFuelDrivers", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 07: OPERATIONAL COMMITMENT ================= */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-brand/25 bg-brand-soft/45 p-4 text-sm font-semibold text-ink">
              10–20 Points per Hub. Morning / උදෑසන 5–10 AM; Evening / සවස 5–9 PM.
            </div>

            <div>
              <Label
                num="33"
                en="Who will manage daily Hub operations?"
                si="දෛනික මෙහෙයුම් කළමනාකරණය කරන්නේ කවුද?"
                lang={lang}
              />
              <OptionGroup
                name="dailyManager"
                options={DAILY_MANAGER_OPTIONS}
                value={form.dailyManager}
                onChange={(v) => update("dailyManager", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="34"
                en="Will this be your primary business?"
                si="මෙය ඔබගේ ප්‍රධාන ව්‍යාපාරයද?"
                lang={lang}
              />
              <OptionGroup
                name="primaryBusiness"
                options={PRIMARY_BUSINESS_OPTIONS}
                value={form.primaryBusiness}
                onChange={(v) => update("primaryBusiness", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="35"
                en="Can you recruit and manage staff and drivers?"
                si="සේවකයන් හා රියදුරන් බඳවා කළමනාකරණය කළ හැකිද?"
                lang={lang}
              />
              <OptionGroup
                name="recruitManageStaffDrivers"
                options={YES_NO_OPTIONS}
                value={form.recruitManageStaffDrivers}
                onChange={(v) => update("recruitManageStaffDrivers", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="36"
                en="Can you coordinate collection and distribution across 10–20 Points?"
                si="Points 10–20 අතර පාර්සල් එකතු කිරීම හා බෙදාහැරීම කළ හැකිද?"
                lang={lang}
              />
              <OptionGroup
                name="coordinatePoints"
                options={COORDINATE_POINTS_OPTIONS}
                value={form.coordinatePoints}
                onChange={(v) => update("coordinatePoints", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="37"
                en="Can you maintain morning and evening shifts?"
                si="උදෑසන හා සවස මෙහෙයුම් කාලසටහන පවත්වාගත හැකිද?"
                lang={lang}
              />
              <OptionGroup
                name="maintainShifts"
                options={YES_NO_OPTIONS}
                value={form.maintainShifts}
                onChange={(v) => update("maintainShifts", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="38"
                en="Can you operate daily including weekends and required holidays?"
                si="සති අන්ත හා අවශ්‍ය නිවාඩු දින ඇතුළුව දිනපතා ක්‍රියාත්මක කළ හැකිද?"
                lang={lang}
              />
              <OptionGroup
                name="operateDailyWeekendsHolidays"
                options={YES_NO_OPTIONS}
                value={form.operateDailyWeekendsHolidays}
                onChange={(v) => update("operateDailyWeekendsHolidays", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="39"
                en="Will you follow parcel handling, scanning, sorting, security and transport procedures?"
                si="පාර්සල් හැසිරවීම, ස්කෑන් කිරීම, වර්ගීකරණය, ආරක්ෂාව හා ප්‍රවාහන ක්‍රමවේද අනුගමනය කරනවාද?"
                lang={lang}
              />
              <OptionGroup
                name="followProcedures"
                options={YES_NO_OPTIONS}
                value={form.followProcedures}
                onChange={(v) => update("followProcedures", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 08: TECHNOLOGY & TRAINING ================= */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <Label
                num="40"
                en="Computer and mobile app knowledge"
                si="පරිගණක හා ජංගම යෙදුම් දැනුම"
                lang={lang}
              />
              <OptionGroup
                name="computerMobileKnowledge"
                options={COMPUTER_KNOWLEDGE_OPTIONS}
                value={form.computerMobileKnowledge}
                onChange={(v) => update("computerMobileKnowledge", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="41"
                en="Will you use the REDCAT IT system for all operations?"
                si="සියලු මෙහෙයුම් සඳහා REDCAT IT පද්ධතිය භාවිත කරනවාද?"
                lang={lang}
              />
              <OptionGroup
                name="useRedcatItSystem"
                options={YES_NO_OPTIONS}
                value={form.useRedcatItSystem}
                onChange={(v) => update("useRedcatItSystem", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>

            <div>
              <Label
                num="42"
                en="Will you complete the mandatory three-day certificate course before opening?"
                si="ආරම්භයට පෙර අනිවාර්ය දින තුනක සහතිකපත් පාඨමාලාව සම්පූර්ණ කරනවාද?"
                lang={lang}
              />
              <OptionGroup
                name="completeThreeDayCourse"
                options={YES_NO_OPTIONS}
                value={form.completeThreeDayCourse}
                onChange={(v) => update("completeThreeDayCourse", v)}
                lang={lang}
                columns="sm:grid-cols-2"
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 09: BUSINESS READINESS ================= */}
        {step === 9 && (
          <div className="space-y-6">
            <div>
              <Label
                num="43"
                en="When can you commence operations if approved?"
                si="අනුමැතිය ලැබුණහොත් ආරම්භ කළ හැක්කේ කවදාද?"
                lang={lang}
              />
              <OptionGroup
                name="commenceWhen"
                options={COMMENCE_WHEN_OPTIONS}
                value={form.commenceWhen}
                onChange={(v) => update("commenceWhen", v)}
                lang={lang}
              />
            </div>

            <div>
              <Label
                num="44"
                en="Why are you interested in a REDCAT Hub franchise?"
                si="REDCAT Hub අවස්ථාවට ඔබ උනන්දු වන්නේ ඇයි?"
                lang={lang}
              />
              <textarea
                rows={4}
                value={form.whyInterested}
                onChange={(e) => update("whyInterested", e.target.value)}
                maxLength={1500}
                placeholder="Tell us about your motivation, local network, and business goals..."
                className={inputCls}
              />
            </div>

            <div>
              <Label
                num="45"
                en="How did you hear about REDCAT?"
                si="REDCAT පිළිබඳ දැනගත්තේ කෙසේද?"
                lang={lang}
              />
              <OptionGroup
                name="howDidYouHear"
                options={HEAR_ABOUT_OPTIONS}
                value={form.howDidYouHear}
                onChange={(v) => update("howDidYouHear", v)}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* ================= SECTION 10: APPLICANT DECLARATION ================= */}
        {step === 10 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/10 bg-mist/60 p-5 text-sm leading-relaxed text-ink/85">
              {lang !== "si" && (
                <p className="font-semibold">
                  I confirm that the information provided is accurate to the best of my knowledge.
                  Submission does not guarantee approval or reservation of a franchise.
                </p>
              )}
              {lang !== "en" && (
                <p className={lang === "both" ? "mt-2 text-ink/70" : "font-semibold"}>
                  මා විසින් සපයා ඇති තොරතුරු මාගේ දැනුම අනුව නිවැරදි බව තහවුරු කරමි. අයදුම්පත ඉදිරිපත් කිරීමෙන් Franchise අනුමැතිය හෝ වෙන්කර තැබීම සහතික නොවේ.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black/10 bg-white p-4 transition hover:border-black/25">
                <input
                  type="checkbox"
                  checked={form.agreePrivacyTerms}
                  onChange={(e) => update("agreePrivacyTerms", e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                    form.agreePrivacyTerms
                      ? "border-brand bg-brand text-white"
                      : "border-ink/30 bg-white"
                  }`}
                >
                  {form.agreePrivacyTerms && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {lang !== "si" && (
                    <span className="block">
                      I agree to the REDCAT Privacy Policy and Franchise Application Terms. *
                    </span>
                  )}
                  {lang !== "en" && (
                    <span className="mt-0.5 block text-ink/65">
                      REDCAT පෞද්ගලිකත්ව ප්‍රතිපත්තිය හා අයදුම්පත් කොන්දේසි සඳහා එකඟ වෙමි.
                    </span>
                  )}
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black/10 bg-white p-4 transition hover:border-black/25">
                <input
                  type="checkbox"
                  checked={form.agreeContact}
                  onChange={(e) => update("agreeContact", e.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${
                    form.agreeContact
                      ? "border-brand bg-brand text-white"
                      : "border-ink/30 bg-white"
                  }`}
                >
                  {form.agreeContact && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {lang !== "si" && (
                    <span className="block">I agree to be contacted regarding my application. *</span>
                  )}
                  {lang !== "en" && (
                    <span className="mt-0.5 block text-ink/65">
                      මාගේ අයදුම්පත සම්බන්ධයෙන් සන්නිවේදනය කිරීමට එකඟ වෙමි.
                    </span>
                  )}
                </span>
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label
                  num="A"
                  en="Applicant name"
                  si="අයදුම්කරුගේ නම"
                  lang={lang}
                />
                <input
                  type="text"
                  value={form.applicantName}
                  onChange={(e) => update("applicantName", e.target.value)}
                  maxLength={120}
                  className={inputCls}
                />
              </div>
              <div>
                <Label num="B" en="Date" si="දිනය" lang={lang} />
                <input
                  type="date"
                  value={form.declarationDate}
                  onChange={(e) => update("declarationDate", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <Label
                num="C"
                en="Digital Signature (type your full name)"
                si="අත්සන (ඔබගේ සම්පූර්ණ නම ටයිප් කරන්න)"
                lang={lang}
              />
              <input
                type="text"
                value={form.signature}
                onChange={(e) => update("signature", e.target.value)}
                maxLength={120}
                placeholder="Type your full name as digital signature"
                className={`${inputCls} font-serif italic text-lg`}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-center gap-2.5 rounded-xl border border-brand/30 bg-brand-soft/60 px-4 py-3 text-sm font-bold text-brand-deep"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1 || busy}
            className="press inline-flex items-center gap-2 rounded-full border-2 border-black/15 px-6 py-3.5 text-sm font-bold text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            Previous / පෙර
          </button>

          {step < 10 ? (
            <button
              type="button"
              onClick={handleNext}
              className="press inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition hover:bg-brand"
            >
              Next section / ඊළඟ
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={busy}
              className="press inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-deep disabled:opacity-60"
            >
              {busy ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Hub Application / අයදුම්පත යොමු කරන්න
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
