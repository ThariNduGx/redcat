"use client";

import { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Compass,
  Languages,
  Sparkles,
  Truck,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import CareerApplyLink from "@/components/CareerApplyLink";

type Lang = "en" | "si";

const CONTENT = {
  en: {
    tag: "Current Openings",
    heading: "Open Positions",
    subtitle: "Explore the responsibilities, requirements and benefits for each open position.",
    responsibilitiesTitle: "Key Responsibilities",
    requirementsTitle: "What We're Looking For",
    benefitsTitle: "What You Get",
    applyNow: "Apply now",
    switcherLabel: "Description Language:",
    englishLabel: "English",
    sinhalaLabel: "සිංහල",
  },
  si: {
    tag: "දැනට පවතින පුරප්පාඩු",
    heading: "රැකියා පුරප්පාඩු",
    subtitle: "දැනට පවතින එක් එක් රැකියා පුරප්පාඩුවට අදාළ රාජකාරි වගකීම්, අවශ්‍ය සුදුසුකම් සහ හිමිවන ප්‍රතිලාභ පිළිබඳ විස්තර දැනගන්න.",
    responsibilitiesTitle: "ප්‍රධාන රාජකාරි හා වගකීම්",
    requirementsTitle: "අපේක්ෂිත සුදුසුකම් හා කුසලතා",
    benefitsTitle: "ඔබට හිමිවන ප්‍රතිලාභ",
    applyNow: "අයදුම් කරන්න",
    switcherLabel: "විස්තර භාෂාව:",
    englishLabel: "English",
    sinhalaLabel: "සිංහල",
  },
};

const POSITIONS = [
  {
    id: "bdm",
    roleId: "bdm",
    title: {
      en: "Business Development Executive",
      si: "ව්‍යාපාර සංවර්ධන විධායක නිලධාරී (Business Development Executive)",
    },
    badge: {
      en: "Regional / Islandwide",
      si: "ප්‍රාදේශීය / දිවයින පුරා",
    },
    tagline: {
      en: "Lead the expansion of Redcat across Sri Lanka.",
      si: "ශ්‍රී ලංකාව පුරා RedCat ජාලය ව්‍යාප්ත කිරීමේ ප්‍රමුඛ කාර්යභාරයක් ඉටු කරන්න.",
    },
    overview: {
      en: "Redcat is building the largest courier network of 930 strategic franchise partners. We are looking for ambitious and commercially minded Regional Business Development Executives to identify business opportunities, develop strategic partnerships and recruit franchise partners to establish and expand the RedCat network.",
      si: "RedCat ආයතනය, උපායමාර්ගික ෆ්‍රැන්චයිස් (Franchise) හවුල්කරුවන් 930 දෙනෙකුගෙන් සමන්විත විශාලතම කුරියර් සේවා ජාලය ගොඩනඟමින් සිටී.\n\nව්‍යාපාරික අවස්ථා හඳුනාගැනීම, උපායමාර්ගික ව්‍යාපාරික හවුල්කාරිත්වයන් වර්ධනය කිරීම සහ RedCat ජාලය ස්ථාපිත කර ව්‍යාප්ත කිරීම සඳහා නව ෆ්‍රැන්චයිස් හවුල්කරුවන් බඳවාගැනීමේ කටයුතු සිදු කිරීමට, ඉහළ අභිලාෂයක් සහ වාණිජමය දැක්මක් සහිත ප්‍රාදේශීය ව්‍යාපාර සංවර්ධන විධායක නිලධාරීන් අපි සොයන්නෙමු.",
    },
    responsibilities: {
      en: [
        "Develop relationships with entrepreneurs and potential business partners across target districts.",
        "Identify suitable commercial locations and strategic opportunities for expanding the CAT Point network.",
        "Monitor the commercial performance and continuous footfall growth of the regional franchise network.",
        "Identify local opportunities to increase parcel volumes in the region and secure commercial partnerships.",
      ],
      si: [
        "ඉලක්කගත දිස්ත්‍රික්කවල ව්‍යවසායකයන් සහ විභව ව්‍යාපාරික හවුල්කරුවන් සමඟ සබඳතා ගොඩනඟා ගැනීම සහ එම සබඳතා වර්ධනය කිරීම.",
        "CAT Point ජාලය ව්‍යාප්ත කිරීම සඳහා සුදුසු වාණිජ ස්ථාන සහ උපායමාර්ගික ව්‍යාපාරික අවස්ථා හඳුනාගැනීම.",
        "ප්‍රාදේශීය ෆ්‍රැන්චයිස් ජාලයේ වාණිජ කාර්යසාධනය සහ එම ජාලයේ ශාඛා වෙත පැමිණෙන පාරිභෝගික සංඛ්‍යාවේ අඛණ්ඩ වර්ධනය නිරීක්ෂණය කිරීම.",
        "අදාළ කලාපය තුළ හුවමාරු වන පාර්සල් ප්‍රමාණය ඉහළ නැංවීම සඳහා ප්‍රාදේශීය ව්‍යාපාරික අවස්ථා හඳුනාගැනීම සහ නව වාණිජ හවුල්කාරිත්වයන් ඇති කරගැනීම.",
      ],
    },
    requirements: {
      en: [
        "Ambitious, commercially minded professional with proven deal-making capability.",
        "Experience in B2B business development, franchise expansion, or regional sales.",
        "Strong communication, negotiation, and entrepreneur relationship-building skills.",
        "Deep familiarity with regional business centers and commercial hubs in Sri Lanka.",
      ],
      si: [
        "ඉහළ අභිලාෂයක් සහ වාණිජමය දැක්මක් සහිත, ව්‍යාපාරික ගනුදෙනු සාර්ථකව සිදු කිරීමේ සනාථ කළ හැකි හැකියාවක් ඇති වෘත්තිකයෙකු වීම.",
        "B2B ව්‍යාපාර සංවර්ධනය, ෆ්‍රැන්චයිස් ජාල ව්‍යාප්තිය හෝ ප්‍රාදේශීය විකුණුම් ක්ෂේත්‍රයන්හි පළපුරුද්දක් තිබීම.",
        "විශිෂ්ට සන්නිවේදන කුසලතා, සාකච්ඡා මඟින් එකඟතාවන්ට එළඹීමේ හැකියාව සහ ව්‍යවසායකයන් සමඟ ශක්තිමත් ව්‍යාපාරික සබඳතා ගොඩනඟා ගැනීමේ කුසලතා තිබීම.",
        "ශ්‍රී ලංකාවේ ප්‍රාදේශීය ව්‍යාපාරික මධ්‍යස්ථාන සහ ප්‍රධාන වාණිජ කේන්ද්‍රස්ථාන පිළිබඳ පුළුල් දැනුමක් හා අවබෝධයක් තිබීම.",
      ],
    },
    benefits: {
      en: [
        "Attractive performance-based incentives and commercial commission tiers.",
        "Fast career growth within a rapidly expanding nationwide organization.",
        "An opportunity to play a leading role in building a transformative national network.",
      ],
      si: [
        "කාර්යසාධනය මත පදනම් වූ ආකර්ෂණීය දිරි දීමනා සහ විවිධ මට්ටම් අනුව හිමිවන ව්‍යාපාරික කොමිස් දීමනා.",
        "දිවයින පුරා වේගයෙන් ව්‍යාප්ත වන ආයතනයක් තුළ කඩිනම් වෘත්තීය දියුණුවක් අත්කර ගැනීමේ අවස්ථාව.",
        "ජාතික මට්ටමින් නව පෙරළියක් ඇති කරන සේවා ජාලයක් ගොඩනැඟීමේදී ප්‍රමුඛ කාර්යභාරයක් ඉටු කිරීමේ අවස්ථාව.",
      ],
    },
  },
  {
    id: "zom",
    roleId: "zom",
    title: {
      en: "Zone Operations Manager",
      si: "කලාපීය මෙහෙයුම් කළමනාකරු (Zone Operations Manager)",
    },
    badge: {
      en: "Operations / Logistics",
      si: "මෙහෙයුම් / ලොජිස්ටික්ස්",
    },
    tagline: {
      en: "Train and empower the people behind the RedCat network.",
      si: "RedCat ජාලයේ සාර්ථකත්වයට දායක වන කාර්ය මණ්ඩලය පුහුණු කර ඔවුන්ගේ හැකියාවන් ශක්තිමත් කරන්න.",
    },
    overview: {
      en: "Redcat is building the largest courier network of 930 strategic franchise partners. We are looking for capable and results-driven managers to oversee delivery operations across assigned districts.",
      si: "RedCat ආයතනය, උපායමාර්ගික ෆ්‍රැන්චයිස් (Franchise) හවුල්කරුවන් 930 දෙනෙකුගෙන් සමන්විත විශාලතම කුරියර් සේවා ජාලය ගොඩනඟමින් සිටී.\n\nපවරනු ලබන දිස්ත්‍රික්කවල පාර්සල් බෙදාහැරීමේ මෙහෙයුම් අධීක්ෂණය කිරීම සඳහා මනා කළමනාකරණ හැකියාවකින් සහ ප්‍රතිඵල කේන්ද්‍ර කරගත් වැඩපිළිවෙළකින් යුත් දක්ෂ කළමනාකරුවන් අපි සොයන්නෙමු.",
    },
    responsibilities: {
      en: [
        "Oversee smooth, reliable delivery operations across assigned districts.",
        "Coordinate and supervise Regional Centres and local CAT Point franchise operations.",
        "Manage transportation schedules, line-haul dispatches, and inter-regional parcel movements.",
        "Monitor daily parcel volumes, next-day delivery performance SLAs, and operational efficiency.",
        "Supervise regional operational teams and ensure all staff strictly adhere to standard operating procedures (SOPs).",
      ],
      si: [
        "පවරා ඇති දිස්ත්‍රික්කවල පාර්සල් බෙදාහැරීමේ මෙහෙයුම් බාධාවකින් තොරව, විශ්වාසනීය අයුරින් සිදු වන බව සහතික කිරීම සඳහා එම කටයුතු අධීක්ෂණය කිරීම.",
        "ප්‍රාදේශීය මධ්‍යස්ථාන (Regional Centres) සහ ප්‍රාදේශීය CAT Point ෆ්‍රැන්චයිස් මෙහෙයුම් සම්බන්ධීකරණය කිරීම හා අධීක්ෂණය කිරීම.",
        "ප්‍රවාහන කාලසටහන්, ප්‍රධාන ප්‍රවාහන මාර්ග සඳහා භාණ්ඩ පිටත් කිරීමේ කටයුතු (Line-haul Dispatches) සහ කලාප අතර පාර්සල් හුවමාරු කටයුතු කළමනාකරණය කිරීම.",
        "දෛනික පාර්සල් ප්‍රමාණය, පසුදින බෙදාහැරීම්වල කාර්යසාධනය, සේවා මට්ටම් ගිවිසුම් (SLAs) අනුව ඉලක්ක සපුරාලීම සහ සමස්ත මෙහෙයුම් කාර්යක්ෂමතාව නිරීක්ෂණය කිරීම.",
        "ප්‍රාදේශීය මෙහෙයුම් කණ්ඩායම් අධීක්ෂණය කිරීම සහ සියලුම කාර්ය මණ්ඩල සාමාජිකයන් සම්මත මෙහෙයුම් ක්‍රියාපටිපාටි (SOPs) දැඩි ලෙස අනුගමනය කරන බව සහතික කිරීම.",
      ],
    },
    requirements: {
      en: [
        "Proven experience in logistics, courier operations, supply chain, or field operations management.",
        "Strong leadership and team management capabilities across distributed personnel.",
        "Ability to coordinate multiple operational locations, hubs, and transport teams simultaneously.",
        "High attention to operational discipline, safety standards, and real-time problem solving.",
      ],
      si: [
        "ලොජිස්ටික්ස් (Logistics), කුරියර් සේවා මෙහෙයුම්, සැපයුම් දාම කළමනාකරණය හෝ ක්ෂේත්‍ර මෙහෙයුම් කළමනාකරණය සම්බන්ධයෙන් සනාථ කළ හැකි පළපුරුද්දක් තිබීම.",
        "විවිධ ස්ථානවල සේවය කරන කාර්ය මණ්ඩල සාමාජිකයන් මෙහෙයවීම සහ කණ්ඩායම් කළමනාකරණය කිරීම සඳහා ශක්තිමත් නායකත්ව හා කළමනාකරණ කුසලතා තිබීම.",
        "මෙහෙයුම් ස්ථාන කිහිපයක්, ප්‍රධාන මෙහෙයුම් මධ්‍යස්ථාන (Hubs) සහ ප්‍රවාහන කණ්ඩායම් එකවර සම්බන්ධීකරණය කිරීමේ හැකියාව තිබීම.",
        "මෙහෙයුම් විනය සහ ආරක්ෂක ප්‍රමිතීන් පිළිපැදීම කෙරෙහි ඉහළ අවධානයක් යොමු කිරීම මෙන්ම, මෙහෙයුම් අතරතුර පැනනඟින ගැටලු ක්ෂණිකව හඳුනාගෙන විසඳීමේ හැකියාව තිබීම.",
      ],
    },
    benefits: {
      en: [
        "Competitive executive remuneration and performance-linked operational bonuses.",
        "Direct leadership authority over regional delivery operations across assigned districts.",
        "Clear career trajectory within executive logistics management.",
      ],
      si: [
        "විධායක මට්ටමට ගැළපෙන තරගකාරී වැටුප් හා දීමනා පැකේජයක් සහ කාර්යසාධනයට සම්බන්ධ මෙහෙයුම් ප්‍රසාද දීමනා.",
        "පවරා ඇති දිස්ත්‍රික්කවල ප්‍රාදේශීය බෙදාහැරීමේ මෙහෙයුම් සම්බන්ධයෙන් සෘජු නායකත්ව බලතල හිමිවීම.",
        "විධායක මට්ටමේ ලොජිස්ටික්ස් කළමනාකරණ ක්ෂේත්‍රය තුළ පැහැදිලි වෘත්තීය උසස්වීම් මාර්ගයක් හිමිවීම.",
      ],
    },
  },
];

export default function JobOpenings() {
  const [lang, setLang] = useState<Lang>("en");
  const t = CONTENT[lang];

  return (
    <section id="open-positions" lang={lang} className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black/10 pb-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
                {t.tag}
              </span>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
                {t.heading}
              </h2>
              <p className="mt-2 max-w-xl text-lg text-ink/75">
                {t.subtitle}
              </p>
            </div>

            {/* Language Switcher Pill */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/60">
                <Languages size={15} className="text-brand" />
                {t.switcherLabel}
              </span>
              <div
                role="group"
                aria-label={t.switcherLabel}
                className="inline-flex items-center rounded-2xl bg-white p-1 border border-black/10 shadow-sm"
              >
                <button
                  type="button"
                  lang="en"
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={`press flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    lang === "en"
                      ? "bg-ink text-white shadow-sm"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  <span className="text-sm leading-none">🇬🇧</span>
                  <span>{t.englishLabel}</span>
                </button>
                <button
                  type="button"
                  lang="si"
                  onClick={() => setLang("si")}
                  aria-pressed={lang === "si"}
                  className={`press flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    lang === "si"
                      ? "bg-brand text-white shadow-sm shadow-brand/25"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  <span className="text-sm leading-none">🇱🇰</span>
                  <span>{t.sinhalaLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Detailed Job Cards */}
        <div className="mt-12 space-y-10">
          {POSITIONS.map((pos, idx) => (
            <Reveal key={pos.id} delay={idx * 100}>
              <article className="overflow-hidden rounded-[2.5rem] border-2 border-black/5 bg-white shadow-xl transition-all duration-300 hover:border-brand/30 hover:shadow-2xl">

                {/* Card Header */}
                <div className="border-b border-black/5 bg-gradient-to-r from-mist via-white to-brand-soft/30 p-8 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
                        {pos.id === "bdm" ? (
                          <Briefcase size={22} strokeWidth={2.4} />
                        ) : (
                          <Truck size={22} strokeWidth={2.4} />
                        )}
                      </span>
                      <div>
                        <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                          {pos.badge[lang]}
                        </span>
                      </div>
                    </div>
                    <CareerApplyLink
                      roleId={pos.roleId}
                      variant="brand"
                      aria-label={`${t.applyNow} - ${pos.title[lang]}`}
                    >
                      {t.applyNow} →
                    </CareerApplyLink>
                  </div>

                  <h3 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                    {pos.title[lang]}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-brand">
                    {pos.tagline[lang]}
                  </p>
                  <p className="mt-4 max-w-4xl text-base sm:text-lg leading-relaxed text-ink/80 whitespace-pre-line">
                    {pos.overview[lang]}
                  </p>
                </div>

                {/* Card Content: Responsibilities, Requirements & Benefits */}
                <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-3">

                  {/* Responsibilities */}
                  <div className="rounded-2xl bg-mist/60 p-6">
                    <h4 className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wider text-ink">
                      <Compass size={18} className="text-brand" />
                      {t.responsibilitiesTitle}
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {pos.responsibilities[lang].map((resp) => (
                        <li key={resp} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="rounded-2xl bg-mist/60 p-6">
                    <h4 className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wider text-ink">
                      <CheckCircle2 size={18} className="text-brand" />
                      {t.requirementsTitle}
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {pos.requirements[lang].map((req) => (
                        <li key={req} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/75">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What You Get / Benefits */}
                  <div className="rounded-2xl bg-brand-soft/50 border border-brand/20 p-6">
                    <h4 className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wider text-brand">
                      <Sparkles size={18} className="text-brand" />
                      {t.benefitsTitle}
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {pos.benefits[lang].map((ben) => (
                        <li key={ben} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/85 font-medium">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
