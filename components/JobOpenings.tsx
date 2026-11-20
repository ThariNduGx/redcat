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
  },
  si: {
    tag: "පවතින පුරප්පාඩු",
    heading: "විවෘත රැකියා අවස්ථා",
    subtitle: "එක් එක් රැකියා අවස්ථාව සඳහා වන වගකීම්, අවශ්‍ය සුදුසුකම් සහ හිමිවන ප්‍රතිලාභ මෙහිදී බලන්න.",
    responsibilitiesTitle: "ප්‍රධාන වගකීම්",
    requirementsTitle: "අප සොයන සුදුසුකම්",
    benefitsTitle: "ඔබට හිමිවන ප්‍රතිලාභ",
    applyNow: "දැන්ම අයදුම් කරන්න",
    switcherLabel: "භාෂාව තෝරන්න:",
  },
};

const POSITIONS = [
  {
    id: "bdm",
    roleId: "bdm",
    title: {
      en: "Business Development Executive",
      si: "ව්‍යාපාර සංවර්ධන විධායක (Business Development Executive)",
    },
    badge: {
      en: "Regional / Islandwide",
      si: "ප්‍රාදේශීය / දිවයින පුරා",
    },
    tagline: {
      en: "Lead the expansion of Redcat across Sri Lanka.",
      si: "ශ්‍රී ලංකාව පුරා RedCat ජාලය ව්‍යාප්ත කිරීමේ නායකත්වය ගන්න.",
    },
    overview: {
      en: "Redcat is building the largest courier network of 930 strategic franchise partners. We are looking for ambitious and commercially minded Regional Business Development Executives to identify business opportunities, develop strategic partnerships and recruit franchise partners to establish and expand the RedCat network.",
      si: "RedCat දිවයින පුරා උපායමාර්ගික ෆ්‍රැන්චයිස් හවුල්කරුවන් 930 දෙනෙකුගෙන් යුත් ශ්‍රී ලංකාවේ විශාලතම කුරියර් ජාලය ගොඩනඟමින් සිටී. නව ව්‍යාපාරික අවස්ථා හඳුනාගැනීම, උපායමාර්ගික සබඳතා ගොඩනැගීම සහ RedCat ජාලය ප්‍රාදේශීයව ස්ථාපිත කිරීම සඳහා කැපවීමෙන් කටයුතු කළ හැකි දක්ෂ, ව්‍යාපාරික දැක්මක් සහිත ව්‍යාපාර සංවර්ධන විධායකවරුන් අප සොයන්නෙමු.",
    },
    responsibilities: {
      en: [
        "Develop relationships with entrepreneurs and potential business partners across target districts.",
        "Identify suitable commercial locations and strategic opportunities for expanding the CAT Point network.",
        "Monitor the commercial performance and continuous footfall growth of the regional franchise network.",
        "Identify local opportunities to increase parcel volumes in the region and secure commercial partnerships.",
      ],
      si: [
        "අදාළ දිස්ත්‍රික්ක තුළ ව්‍යවසායකයින් සහ අනාගත ව්‍යාපාරික හවුල්කරුවන් සමඟ ශක්තිමත් සබඳතා ගොඩනැගීම.",
        "CAT Point ජාලය ව්‍යාප්ත කිරීම සඳහා සුදුසුම වාණිජ ස්ථාන සහ උපායමාර්ගික අවස්ථා හඳුනාගැනීම.",
        "ප්‍රාදේශීය ෆ්‍රැන්චයිස් ජාලයේ ව්‍යාපාරික කාර්යක්ෂමතාව සහ අඛණ්ඩ වර්ධනය අධීක්ෂණය කිරීම.",
        "අදාළ කලාපයේ පාර්සල් ධාරිතාව ඉහළ නැංවීම සඳහා දේශීය අවස්ථා හඳුනාගැනීම සහ වාණිජ හවුල්කාරිත්වයන් ඇතිකර ගැනීම.",
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
        "සාර්ථක ව්‍යාපාර ගනුදෙනු සිදුකිරීමේ හැකියාව සහිත, ඉහළ අභිප්‍රේරණයකින් යුතු වෘත්තිකයෙකු වීම.",
        "B2B ව්‍යාපාර සංවර්ධනය, ෆ්‍රැන්චයිස් ව්‍යාප්තිය හෝ ප්‍රාදේශීය විකුණුම් ක්ෂේත්‍රයේ පළපුරුද්ද.",
        "විශිෂ්ට සන්නිවේදන, සාකච්ඡා කිරීමේ සහ ව්‍යවසායක සබඳතා පවත්වා ගැනීමේ හැකියාව.",
        "ශ්‍රී ලංකාවේ ප්‍රධාන වාණිජ නගර සහ ප්‍රාදේශීය ව්‍යාපාරික කේන්ද්‍රස්ථාන පිළිබඳ මනා දැනුම.",
      ],
    },
    benefits: {
      en: [
        "Attractive performance-based incentives and commercial commission tiers.",
        "Fast career growth within a rapidly expanding nationwide organization.",
        "An opportunity to play a leading role in building a transformative national network.",
      ],
      si: [
        "කාර්යසාධනය මත පදනම් වූ ආකර්ෂණීය දිරිදීමනා සහ කොමිස් ආදායම්.",
        "ශීඝ්‍රයෙන් වර්ධනය වන ජාතික මට්ටමේ ආයතනයක් තුළ වේගවත් වෘත්තීය දියුණුව.",
        "ශ්‍රී ලංකාවේ පෙරළිකාර ජාතික කුරියර් ජාලයක් ගොඩනැගීමේ ප්‍රමුඛ කාර්යභාරයක් ඉටුකිරීමේ අවස්ථාව.",
      ],
    },
  },
  {
    id: "zom",
    roleId: "zom",
    title: {
      en: "Zone Operations Manager",
      si: "කලාප මෙහෙයුම් කළමනාකරු (Zone Operations Manager)",
    },
    badge: {
      en: "Operations / Logistics",
      si: "මෙහෙයුම් සහ සැපයුම් ජාල (Operations)",
    },
    tagline: {
      en: "Train and empower the people behind the RedCat network.",
      si: "RedCat ජාලය පිටුපස සිටින කණ්ඩායම මෙහෙයවන්න සහ බලගන්වන්න.",
    },
    overview: {
      en: "Redcat is building the largest courier network of 930 strategic franchise partners. We are looking for capable and results-driven managers to oversee delivery operations across assigned districts.",
      si: "RedCat දිවයින පුරා උපායමාර්ගික ෆ්‍රැන්චයිස් හවුල්කරුවන් 930 දෙනෙකුගෙන් යුත් ශ්‍රී ලංකාවේ විශාලතම කුරියර් ජාලය ගොඩනඟමින් සිටී. තමන්ට පැවරුණු දිස්ත්‍රික්ක තුළ සමස්ත පාර්සල් බෙදාහැරීමේ මෙහෙයුම් කටයුතු කාර්යක්ෂමව මෙහෙයවීම සඳහා පළපුරුදු සහ ප්‍රතිඵල නැඹුරු කළමනාකරුවන් අප සොයන්නෙමු.",
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
        "පැවරුණු දිස්ත්‍රික්ක තුළ සුමට සහ විශ්වාසනීය පාර්සල් බෙදාහැරීමේ මෙහෙයුම් සහතික කිරීම.",
        "ප්‍රාදේශීය මධ්‍යස්ථාන (Regional Centres) සහ දේශීය CAT Point ෆ්‍රැන්චයිස් මෙහෙයුම් සම්බන්ධීකරණය සහ අධීක්ෂණය.",
        "ප්‍රවාහන කාලසටහන්, ප්‍රධාන ප්‍රවාහන (Line-haul) ධාවන සහ කලාප අතර පාර්සල් හුවමාරු කළමනාකරණය.",
        "දෛනික පාර්සල් ධාරිතාව, පසුදිනම බෙදාහැරීමේ (Next-Day SLA) කාර්යක්ෂමතාව සහ මෙහෙයුම් තත්ත්වය නිරීක්ෂණය කිරීම.",
        "ප්‍රාදේශීය මෙහෙයුම් කණ්ඩායම් මෙහෙයවීම සහ සියලුම කාර්ය මණ්ඩලය සම්මත මෙහෙයුම් පටිපාටි (SOPs) අනුගමනය කිරීම සහතික කිරීම.",
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
        "ලොජිස්ටික්ස්, කුරියර් මෙහෙයුම්, සැපයුම් දාම හෝ ක්ෂේත්‍ර මෙහෙයුම් කළමනාකරණය පිළිබඳ සනාථ කළ පළපුරුද්ද.",
        "විවිධ ප්‍රදේශවල විසිරී සිටින මෙහෙයුම් කණ්ඩායම් සාර්ථකව මෙහෙයවීමේ ශක්තිමත් නායකත්ව හැකියාව.",
        "එකවර මෙහෙයුම් මධ්‍යස්ථාන, හබ්ස් (Hubs) සහ ප්‍රවාහන කණ්ඩායම් කිහිපයක් සම්බන්ධීකරණය කිරීමේ හැකියාව.",
        "මෙහෙයුම් විනය, ආරක්ෂිත ප්‍රමිතීන් සහ ක්ෂණික ගැටලු නිරාකරණය කිරීම පිළිබඳ ඉහළ අවධානය.",
      ],
    },
    benefits: {
      en: [
        "Competitive executive remuneration and performance-linked operational bonuses.",
        "Direct leadership authority over regional delivery operations across assigned districts.",
        "Clear career trajectory within executive logistics management.",
      ],
      si: [
        "තරගකාරී විධායක වැටුප් සහ මෙහෙයුම් කාර්යසාධනය මත පදනම් වූ විශේෂ ප්‍රසාද දීමනා.",
        "පැවරුණු දිස්ත්‍රික්ක තුළ ප්‍රාදේශීය බෙදාහැරීමේ මෙහෙයුම් පිළිබඳ සෘජු නායකත්ව වගකීම.",
        "විධායක ලොජිස්ටික්ස් කළමනාකරණ ක්ෂේත්‍රය තුළ පැහැදිලි සහ ස්ථාවර වෘත්තීය ගමන් මගක්.",
      ],
    },
  },
];

export default function JobOpenings() {
  const [lang, setLang] = useState<Lang>("en");
  const t = CONTENT[lang];

  return (
    <section id="open-positions" className="scroll-mt-20 bg-paper py-20 sm:py-28">
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
                aria-label="Job description language"
                className="inline-flex items-center rounded-2xl bg-white p-1 border border-black/10 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  aria-pressed={lang === "en"}
                  className={`press flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    lang === "en"
                      ? "bg-ink text-white shadow-sm"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  <span className="text-sm leading-none">🇬🇧</span>
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLang("si")}
                  aria-pressed={lang === "si"}
                  className={`press flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                    lang === "si"
                      ? "bg-brand text-white shadow-sm shadow-brand/25"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  <span className="text-sm leading-none">🇱🇰</span>
                  <span>සිංහල</span>
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
                    <CareerApplyLink roleId={pos.roleId} variant="brand" aria-label={`${t.applyNow} - ${pos.title[lang]}`}>
                      {t.applyNow}
                    </CareerApplyLink>
                  </div>

                  <h3 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                    {pos.title[lang]}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-brand">
                    {pos.tagline[lang]}
                  </p>
                  <p className="mt-4 max-w-4xl text-base sm:text-lg leading-relaxed text-ink/80">
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
