"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Languages,
  Wallet,
} from "lucide-react";
import FranchiseApplication from "@/components/FranchiseApplication";
import { SELECTION_PROCESS } from "@/lib/hubFranchise";

type Lang = "en" | "si";

const HIGHLIGHTS = [
  {
    icon: Wallet,
    title: "LKR 2–2.5M",
    en: "Proposed franchise fee",
    si: "යෝජිත ගාස්තුව (රු. මිලියන)",
  },
  {
    icon: Building2,
    title: "1,500+ sq. ft.",
    en: "Minimum Hub space",
    si: "අවම ඉඩකඩ (වර්ග අඩි)",
  },
  {
    icon: Clock,
    title: "5–10 AM · 5–9 PM",
    en: "Morning & evening shifts",
    si: "උදෑසන හා සවස මෙහෙයුම්",
  },
  {
    icon: GraduationCap,
    title: "10–20 Points",
    en: "Per regional hub",
    si: "එක් ප්‍රාදේශීය Hub එකකට",
  },
];

export default function HubFranchisePageView() {
  const [lang, setLang] = useState<Lang>("en");
  const t = (en: string, si: string) => (lang === "si" ? si : en);

  return (
    <>
      {/* Hero */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-16 pt-10 text-white sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
              <span className="h-2 w-2 rounded-full bg-brand" />
              YOUR BUSINESS. OUR TECHNOLOGY. OUR EQUIPMENT. OUR NETWORK.
            </p>

            {/* Single-language switcher controlling the entire page */}
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
              "Regional Hub Franchise Application",
              "ප්‍රාදේශීය Hub ව්‍යාපාරික නියෝජිත අයදුම්පත"
            )}
          </h1>
          <p className="mt-3 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
            {t(
              "Apply in English or Sinhala. Have your preferred hub, investment, premises and transport details ready.",
              "ඉංග්‍රීසි හෝ සිංහලෙන් අයදුම් කරන්න. ඔබේ කැමති Hub ස්ථානය, ආයෝජනය, ගොඩනැගිලි හා ප්‍රවාහන තොරතුරු සූදානම් කරගන්න."
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#apply"
              className="press inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-ink shadow-md transition hover:bg-mist"
            >
              {t("Start application", "අයදුම්පත ආරම්භ කරන්න")}
              <ArrowRight size={16} />
            </a>
            <Link
              href="/dealers/hub-franchise/application-notice"
              className="text-sm font-semibold text-white/90 underline underline-offset-4 hover:text-white"
            >
              {t("Privacy notice and terms", "පෞද්ගලිකත්ව නිවේදනය සහ කොන්දේසි")}
            </Link>
          </div>

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

          <p className="mt-4 text-xs font-medium text-white/80">
            {t(
              "The proposed fee excludes premises, vehicles, staffing and working capital.",
              "යෝජිත ගාස්තුවට ගොඩනැගිලි, වාහන, සේවක හා කාරක ප්‍රාග්ධන වියදම් ඇතුළත් නොවේ."
            )}
          </p>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-12 bg-paper sm:h-16"
          style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
      </section>

      {/* Form Section */}
      <section id="apply" className="scroll-mt-16 bg-paper pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className="mx-auto max-w-4xl px-5">
          <FranchiseApplication kind="hub" lang={lang} onLangChange={setLang} />
        </div>
      </section>

      {/* 11-Step Selection Process */}
      <section className="border-t border-black/10 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">
            {t("Selection process", "තෝරාගැනීමේ ක්‍රියාවලිය")}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">
            {t("How Hub partners are selected.", "Hub හවුල්කරුවන් තෝරාගන්නා ආකාරය.")}
          </h2>
          <p className="mt-2 text-base text-ink/70">
            {t(
              "Scores alone do not guarantee approval. Our team verifies funds, premises, transport and operational capability at each stage.",
              "ලකුණු පමණක් අනුමැතිය සහතික නොකරයි. මූල්‍ය, ගොඩනැගිලි, ප්‍රවාහන හා මෙහෙයුම් හැකියාව සෑම අදියරකදීම තහවුරු කරනු ලැබේ."
            )}
          </p>

          <ol className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {SELECTION_PROCESS.map((item) => (
              <li
                key={item.step}
                className="flex items-center gap-3.5 rounded-2xl border border-black/10 bg-mist/50 p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">
                  {item.step}
                </span>
                <span className="text-sm font-extrabold text-ink">
                  {lang === "si" ? item.si : item.en}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950">
                  {t("Ready to launch", "ආරම්භ කිරීමට සූදානම්")}
                </h3>
                <p className="text-xs font-medium text-emerald-800/80">
                  {t("Full operational support from REDCAT HQ.", "REDCAT ප්‍රධාන කාර්යාලයේ පූර්ණ සහාය.")}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
