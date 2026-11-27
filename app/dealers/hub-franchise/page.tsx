import type { Metadata } from "next";
import { ArrowRight, Building2, CheckCircle2, Clock, GraduationCap, Wallet } from "lucide-react";
import FranchiseApplication from "@/components/FranchiseApplication";
import { SELECTION_PROCESS } from "@/lib/hubFranchise";

export const metadata: Metadata = {
  title: "Regional Hub Franchise Application",
  description:
    "Apply to become a REDCAT Regional Hub Franchisee. Complete the bilingual English & Sinhala application across 57 regional hubs in Sri Lanka.",
  alternates: {
    canonical: "https://redcat.lk/dealers/hub-franchise",
  },
};

const HIGHLIGHTS = [
  {
    icon: Wallet,
    title: "LKR 2–2.5M",
    subtitle: "Proposed franchise fee",
    si: "යෝජිත ගාස්තුව රු. මිලියන 2–2.5",
  },
  {
    icon: Building2,
    title: "1,500+ sq. ft.",
    subtitle: "Minimum Hub space",
    si: "අවම ඉඩකඩ වර්ග අඩි 1,500+",
  },
  {
    icon: Clock,
    title: "5–10 AM · 5–9 PM",
    subtitle: "Morning & evening shifts",
    si: "උදෑසන හා සවස මෙහෙයුම්",
  },
  {
    icon: GraduationCap,
    title: "10–20 Points",
    subtitle: "Per regional hub",
    si: "එක් ප්‍රාදේශීය Hub එකකට",
  },
];

export default function HubFranchisePage() {
  return (
    <>
      {/* Hero */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-20 pt-12 text-white sm:pb-28 sm:pt-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
            <span className="h-2 w-2 rounded-full bg-brand" />
            YOUR BUSINESS. OUR TECHNOLOGY. OUR EQUIPMENT. OUR NETWORK.
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,5.5vw,4.75rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
            Regional Hub Franchise Application
          </h1>
          <p lang="si" className="mt-3 text-xl font-bold text-brand-soft sm:text-2xl">
            ප්‍රාදේශීය Hub ව්‍යාපාරික නියෝජිත අයදුම්පත
          </p>
          <p className="mt-4 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
            Apply in English or Sinhala. Have your preferred hub, investment, premises and transport details ready.
          </p>

          <p lang="si" className="mt-2 max-w-2xl text-sm text-white">
            ඉංග්‍රීසි හෝ සිංහලෙන් අයදුම් කරන්න. කැමති Hub ස්ථානය, ආයෝජනය, ගොඩනැගිලි සහ ප්‍රවාහන තොරතුරු සූදානම් කරගන්න.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#apply" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <span>Start application <span className="block text-xs" lang="si">අයදුම්පත ආරම්භ කරන්න</span></span><ArrowRight aria-hidden size={18} />
            </a>
            <a href="/dealers/hub-franchise/application-notice" target="_blank" rel="noopener" className="py-2 text-sm font-semibold underline underline-offset-4">
              Privacy notice and terms <span className="sr-only" lang="si">පෞද්ගලිකත්වය සහ කොන්දේසි</span>
            </a>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-white">
                  <item.icon aria-hidden className="hidden shrink-0 sm:block" size={18} />
                  <dt className="text-xs font-bold uppercase tracking-wider">{item.subtitle}</dt>
                </div>
                <dd className="mt-1.5 text-lg sm:text-2xl font-extrabold tracking-tight text-white">
                  {item.title}
                </dd>
                <dd lang="si" className="mt-0.5 text-xs text-white">{item.si}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-white">The proposed fee excludes premises, vehicles, staffing and working capital.</p>
          <p lang="si" className="mt-1 text-sm text-white">යෝජිත ගාස්තුවට ගොඩනැගිලි, වාහන, සේවක සහ කාරක ප්‍රාග්ධන වියදම් ඇතුළත් නොවේ.</p>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-14 bg-paper sm:h-20"
          style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
      </section>

      {/* Interactive 10-Section Application Form */}
      <section id="apply" className="scroll-mt-24 bg-paper pb-20 pt-6 sm:pb-28">
        <div className="mx-auto max-w-4xl px-5">
          <FranchiseApplication />
        </div>
      </section>

      {/* 11-Step Selection Process */}
      <section className="border-t border-black/10 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">
            Selection process / තෝරාගැනීමේ ක්‍රියාවලිය
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            How Hub partners are selected.
          </h2>
          <p className="mt-2 text-base text-ink/70">
            Scores alone do not guarantee approval. Our team verifies funds, premises, transport and operational capability at each stage.
          </p>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SELECTION_PROCESS.map((item) => (
              <li
                key={item.step}
                className="flex items-start gap-3.5 rounded-2xl border border-black/10 bg-mist/50 p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-ink">{item.en}</h3>
                  <p lang="si" className="mt-0.5 text-sm font-medium text-ink/65">{item.si}</p>
                </div>
              </li>
            ))}
            <li className="flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
                <CheckCircle2 size={16} />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-emerald-950">Ready to launch</h3>
                <p className="mt-0.5 text-sm font-medium text-emerald-800/80">
                  Full operational support from REDCAT HQ.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
