import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import CareerApplication from "@/components/CareerApplication";
import JobOpenings from "@/components/JobOpenings";
import { CAREER_ROLES } from "@/lib/careerRegistration";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";
import CareerApplyLink from "@/components/CareerApplyLink";

export const metadata: Metadata = {
  title: "Careers & HR | RedCat",
  description:
    "Join RedCat and help build Sri Lanka's next-day delivery network. Open positions: Business Development Executive and Zone Operations Manager. Register online.",
  alternates: {
    canonical: "https://redcat.lk/hr",
  },
};

const POSITIONS = [
  { id: "bdm", title: CAREER_ROLES.bdm },
  { id: "zom", title: CAREER_ROLES.zom },
];

export default function HrPage() {
  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-20 pt-12 text-white sm:pb-28 sm:pt-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-12">

            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-ink/90 border border-white/20 py-1.5 pl-3.5 pr-4 text-xs font-bold tracking-[0.14em] uppercase text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                We Are Hiring
              </div>

              <h1 className="mt-5 text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
                Be part of the team
                <span className="block text-brand-soft">revolutionizing courier delivery.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
                RedCat is a high-tech courier service building Sri Lanka&apos;s largest delivery network with over 930 express points. We are actively hiring dynamic leaders to drive our nationwide expansion.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {POSITIONS.map((position) => (
                  <CareerApplyLink key={position.id} roleId={position.id} variant="light" className="max-w-full">
                    Apply for {position.title}
                  </CareerApplyLink>
                ))}
              </div>
            </div>

            {/* Right Team Photo Column */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white/25 bg-black/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/img/points/partners.webp"
                    alt="The RedCat team and operational fleet ready for nationwide next-day delivery"
                    width={1400}
                    height={790}
                    preload
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="block h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Floating Tag */}
                  <div className="absolute top-5 right-5 rounded-full bg-ink/90 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Now Hiring
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-soft">
                      Next Day Delivery · Islandwide
                    </p>
                    <p className="mt-1 text-lg font-extrabold leading-snug">
                      Join an ambitious team shaping commerce across Sri Lanka.
                    </p>
                  </div>
                </div>

                {/* Sub-badge strip */}
                <div className="mt-4 flex items-center justify-between px-2 text-xs font-bold tracking-wider uppercase text-white/90">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-white" />
                    930+ Points
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-white" />
                    Executive Roles
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-white" />
                    Islandwide
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------- WHY REDCAT / NETWORK IMPACT ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border-2 border-black/5 bg-white p-7 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <TrendingUp size={24} strokeWidth={2.4} />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-ink">Fast-Growing Network</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Connecting 930+ express points, and 57 regional hubs across 25 districts into one cohesive nationwide infrastructure.
            </p>
          </div>
          <div className="rounded-3xl border-2 border-black/5 bg-white p-7 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Award size={24} strokeWidth={2.4} />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-ink">Attractive Incentives</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Performance-driven remuneration, clear milestones, and substantial career mobility within an expanding enterprise.
            </p>
          </div>
          <div className="rounded-3xl border-2 border-black/5 bg-white p-7 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Users size={24} strokeWidth={2.4} />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-ink">Leadership Ownership</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">
              Lead across your assigned districts. Lead regional teams, establish key commercial accounts, and build long-term value.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- OPEN POSITIONS WITH BILINGUAL SWITCHER ---------- */}
      <JobOpenings />

      {/* ---------- ONLINE REGISTRATION ---------- */}
      <section id="apply" aria-labelledby="apply-heading" className="scroll-mt-24 bg-mist px-5 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white px-4 py-6 sm:p-10">
          <h2 id="apply-heading" className="text-3xl font-extrabold tracking-tight">Register online</h2>
          <Suspense fallback={<p className="mt-6">Loading application form…</p>}>
            <CareerApplication />
          </Suspense>
        </div>
      </section>
    </>
  );
}
