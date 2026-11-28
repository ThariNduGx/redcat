"use client";

import { useState } from "react";
import { Banknote, Clock, Languages, MapPin, ShieldCheck } from "lucide-react";
import FranchiseApplication from "@/components/FranchiseApplication";
import { POINT_SELECTION_WORKFLOW } from "@/lib/pointFranchise";

type LangMode = "en" | "si";

const HIGHLIGHTS = [
  {
    icon: Banknote,
    title: "LKR 1.5–2.0M",
    en: "Proposed turnkey investment",
    si: "යෝජිත ආයෝජනය (රු. මිලියන)",
  },
  {
    icon: Clock,
    title: "9 AM – 5 PM",
    en: "Daytime retail hours",
    si: "දෛනික වෙළඳ සේවා වේලාවන්",
  },
  {
    icon: ShieldCheck,
    title: "100% Cash Flow",
    en: "Zero debtor risk",
    si: "ණය අවදානමකින් තොරයි",
  },
  {
    icon: MapPin,
    title: "930+ Points",
    en: "Exclusive territory",
    si: "අනන්‍ය ව්‍යාපාරික කලාපය",
  },
];

function t(lang: LangMode, en: string, si: string) {
  return lang === "si" ? si : en;
}

export default function PointFranchiseApplication() {
  const [lang, setLang] = useState<LangMode>("en");

  return (
    <div lang={lang}>
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-16 pt-10 text-white sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              <span className="h-2 w-2 rounded-full bg-brand" />
              REDCAT | POINT FRANCHISE
            </p>

            <div className="flex items-center gap-2 rounded-2xl bg-black/20 p-1.5 backdrop-blur-sm">
              <Languages size={15} className="ml-1.5 text-white/80" />
              {(
                [
                  { id: "en", label: "English" },
                  { id: "si", label: "සිංහල" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  lang={m.id}
                  aria-pressed={lang === m.id}
                  onClick={() => setLang(m.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    lang === m.id
                      ? "bg-white text-ink shadow-sm"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <h1 className="mt-5 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            {t(
              lang,
              "Point Franchise Application",
              "REDCAT Point ෆ්‍රැන්චයිස් අයදුම්පත"
            )}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
            {t(
              lang,
              "Start with a short registration. RedCat will review your proposed location and contact you about the qualification interview.",
              "කෙටි ලියාපදිංචියකින් ආරම්භ කරන්න. RedCat ඔබේ යෝජිත ස්ථානය සමාලෝචනය කර සම්මුඛ පරීක්ෂණය ගැන ඔබ අමතනු ඇත."
            )}
          </p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-brand-soft">
                  <item.icon size={17} />
                  <dt className="text-xs font-bold uppercase tracking-wider">
                    {lang === "si" ? item.si : item.en}
                  </dt>
                </div>
                <dd className="mt-1 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {item.title}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-12 bg-paper sm:h-16"
          style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
      </section>

      <section id="apply" className="scroll-mt-24 bg-paper pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className="mx-auto max-w-4xl px-5">
          <FranchiseApplication kind="point" lang={lang} onLangChange={setLang} />
        </div>
      </section>

      <section className="border-t border-black/10 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">
            {t(lang, "Selection workflow", "තෝරාගැනීමේ ක්‍රියාවලිය")}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            {t(lang, "How Point partners are selected.", "Point හවුල්කරුවන් තෝරාගන්නා ආකාරය.")}
          </h2>
          <p className="mt-2 text-base text-ink/70">
            {t(
              lang,
              "Multiple applicants are welcomed per Point so we can select the most suitable candidate.",
              "වඩාත් සුදුසු අපේක්ෂකයා තෝරාගැනීම සඳහා එක් Point එකකට අයදුම්කරුවන් කිහිපදෙනෙකුට ඉඩ දෙනු ලැබේ."
            )}
          </p>

          <ol className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {POINT_SELECTION_WORKFLOW.map((item) => (
              <li
                key={item.step}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-mist/50 p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">
                  {item.step}
                </span>
                <span className="text-sm font-extrabold text-ink">
                  {lang === "si" ? item.si : item.en}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
