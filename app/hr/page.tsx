import type { Metadata } from "next";
import Image from "next/image";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Compass,
  Mail,
  MapPin,
  Send,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Careers & HR | RedCat",
  description:
    "Join RedCat and help build Sri Lanka's next-day delivery network. Open positions: Business Development Manager and Zone Operations Manager. Send CV to careers@redcat.lk.",
  alternates: {
    canonical: "https://redcat.lk/hr",
  },
};

const POSITIONS = [
  {
    id: "bdm",
    title: "Business Development Manager",
    badge: "Regional / Islandwide",
    tagline: "Lead the expansion of Redcat across Sri Lanka.",
    overview:
      "Redcat is building the largest courier network of 930 strategic franchise partners. We are looking for ambitious and commercially minded Regional Business Development Managers to identify business opportunities, develop strategic partnerships and recruit franchise partners to establish and expand the RedCat network.",
    responsibilities: [
      "Develop relationships with entrepreneurs and potential business partners across target districts.",
      "Identify suitable commercial locations and strategic opportunities for expanding the CAT Point network.",
      "Monitor the commercial performance and continuous footfall growth of the regional franchise network.",
      "Identify local opportunities to increase parcel volumes in the region and secure commercial partnerships.",
    ],
    requirementsTitle: "What We're Looking For",
    requirements: [
      "Ambitious, commercially minded professional with proven deal-making capability.",
      "Experience in B2B business development, franchise expansion, or regional sales.",
      "Strong communication, negotiation, and entrepreneur relationship-building skills.",
      "Deep familiarity with regional business centers and commercial hubs in Sri Lanka.",
    ],
    benefits: [
      "Attractive performance-based incentives and commercial commission tiers.",
      "Fast career growth within a rapidly expanding nationwide organization.",
      "An opportunity to play a leading role in building a transformative national network.",
    ],
    mailtoSubject: "Application for Business Development Manager",
    contactRole: "Business Development Manager",
  },
  {
    id: "zom",
    title: "Zone Operations Manager",
    badge: "Zone Operations / Logistics",
    tagline: "Train and empower the people behind the RedCat network.",
    overview:
      "Redcat is building the largest courier network of 930 strategic franchise partners. We are looking for capable and results-driven Zone Operations Managers to oversee and manage end-to-end delivery operations within their assigned zones.",
    responsibilities: [
      "Oversee smooth, reliable delivery operations within the assigned geographical zone.",
      "Coordinate and supervise Regional Centres and local CAT Point franchise operations.",
      "Manage transportation schedules, line-haul dispatches, and inter-regional parcel movements.",
      "Monitor daily parcel volumes, next-day delivery performance SLAs, and operational efficiency.",
      "Supervise regional operational teams and ensure all staff strictly adhere to standard operating procedures (SOPs).",
    ],
    requirementsTitle: "What We're Looking For",
    requirements: [
      "Proven experience in logistics, courier operations, supply chain, or field operations management.",
      "Strong leadership and team management capabilities across distributed personnel.",
      "Ability to coordinate multiple operational locations, hubs, and transport teams simultaneously.",
      "High attention to operational discipline, safety standards, and real-time problem solving.",
    ],
    benefits: [
      "Competitive executive remuneration and performance-linked operational bonuses.",
      "Direct leadership authority over regional delivery operations across entire zones.",
      "Clear career trajectory within executive logistics management.",
    ],
    mailtoSubject: "Application for Zone Operations Manager",
    contactRole: "Zone Operations Manager",
  },
];

export default function HrCareersPage() {
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

              {/* Recruitment Pill Box */}
              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-white/10 backdrop-blur-md p-4 sm:p-5 border border-white/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand shadow-md">
                  <Mail size={24} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80">Send your CV directly to</p>
                  <a
                    href="mailto:careers@redcat.lk"
                    className="text-xl sm:text-2xl font-black text-white hover:text-brand-soft transition-colors underline underline-offset-4"
                  >
                    careers@redcat.lk
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ArrowLink href="#open-positions" variant="light" className="text-base font-bold shadow-xl">
                  View Open Positions (2)
                </ArrowLink>
                <ArrowLink
                  href="mailto:careers@redcat.lk?subject=General%20CV%20Submission"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-ink text-base font-semibold"
                >
                  Send CV Directly
                </ArrowLink>
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
              Connecting 930+ express points, 57 regional hubs, and 4 major zones into one cohesive nationwide infrastructure.
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
              Own your territory or zone. Lead regional teams, establish key commercial accounts, and build long-term value.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- OPEN POSITIONS SECTION ---------- */}
      <section id="open-positions" className="scroll-mt-20 bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black/10 pb-8">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
                  Current Openings
                </span>
                <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
                  Open Positions
                </h2>
              </div>
              <p className="max-w-xl text-lg text-ink/75">
                We are actively looking for qualified leaders for the following strategic positions. Submit your CV directly to <span className="font-bold text-brand">careers@redcat.lk</span>.
              </p>
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
                            {pos.badge}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={`mailto:careers@redcat.lk?subject=${encodeURIComponent(pos.mailtoSubject)}`}
                          className="press inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-deep transition-colors"
                        >
                          <Send size={16} />
                          Apply with CV
                        </a>
                        <ArrowLink
                          href={`/contact?topic=Careers&role=${encodeURIComponent(pos.contactRole)}`}
                          variant="outline"
                          className="text-sm font-bold text-ink"
                        >
                          Register Online
                        </ArrowLink>
                      </div>
                    </div>

                    <h3 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                      {pos.title}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-brand">
                      {pos.tagline}
                    </p>
                    <p className="mt-4 max-w-4xl text-base sm:text-lg leading-relaxed text-ink/80">
                      {pos.overview}
                    </p>
                  </div>

                  {/* Card Content: Responsibilities, Requirements & Benefits */}
                  <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-3">
                    
                    {/* Responsibilities */}
                    <div className="rounded-2xl bg-mist/60 p-6">
                      <h4 className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wider text-ink">
                        <Compass size={18} className="text-brand" />
                        Key Responsibilities
                      </h4>
                      <ul className="mt-4 space-y-3">
                        {pos.responsibilities.map((resp) => (
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
                        {pos.requirementsTitle}
                      </h4>
                      <ul className="mt-4 space-y-3">
                        {pos.requirements.map((req) => (
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
                        What You Get
                      </h4>
                      <ul className="mt-4 space-y-3">
                        {pos.benefits.map((ben) => (
                          <li key={ben} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink/85 font-medium">
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 border-t border-brand/20 pt-4">
                        <p className="text-xs font-semibold text-ink/70">
                          Submit your application directly to:
                        </p>
                        <a
                          href={`mailto:careers@redcat.lk?subject=${encodeURIComponent(pos.mailtoSubject)}`}
                          className="mt-1 block text-sm font-black text-brand underline underline-offset-2 hover:text-brand-deep"
                        >
                          careers@redcat.lk
                        </a>
                      </div>
                    </div>

                  </div>

                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DIRECT CV SUBMISSION CALLOUT ---------- */}
      <section className="bg-ink py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/10 bg-gradient-to-br from-ink via-[#161614] to-black p-8 sm:p-14 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Direct HR Inquiries
                </span>
                <h3 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Ready to lead with RedCat?
                </h3>
                <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
                  Send your CV with a cover letter and the position title in the subject line to <span className="font-bold text-white underline">careers@redcat.lk</span>. Our HR and talent acquisition team reviews every profile on a rolling basis.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-white/70">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand" />
                    Islandwide Opportunities
                  </span>
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="text-brand" />
                    careers@redcat.lk
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3.5">
                <a
                  href="mailto:careers@redcat.lk?subject=CV%20Submission%20-%20RedCat%20Careers"
                  className="press inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 hover:bg-brand-deep transition-colors text-center"
                >
                  <Send size={18} />
                  Send Your CV Now
                </a>
                <ArrowLink
                  href="/dealers"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white hover:text-ink text-center justify-center"
                >
                  Franchise Opportunities
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
