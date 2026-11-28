import { FRANCHISE_OPTIONS_HREF } from "@/lib/site";

import Image from "next/image";
import { Suspense } from "react";
import HeroHeadline from "@/components/HeroHeadline";
import Journey from "@/components/Journey";
import Reveal from "@/components/Reveal";
import NetworkExplorer from "@/components/map/NetworkExplorer";
import ArrowLink from "@/components/ui/ArrowLink";
import CountUp from "@/components/ui/CountUp";
import Magnetic from "@/components/ui/Magnetic";
import Marquee from "@/components/ui/Marquee";
import Mascot from "@/components/ui/Mascot";
import Services from "@/components/Services";
import SocialImpact from "@/components/SocialImpact";
import { HUBS } from "@/data/hubs";

const stats = [
  { to: 930, suffix: "+", label: "Express points", note: "to send and collect" },
  { to: 57, suffix: "", label: "Regional hubs", note: "in every district" },
  { to: 25, suffix: "", label: "Districts", note: "across Sri Lanka" },
];

const tech = [
  { img: "/img/technology/customer-app.webp", mediaClass: "object-contain object-right-bottom", title: "Unique Customer App", body: "The RedCat customer app sets the standard for an exceptional courier user experience.", alt: "RedCat customer app displayed on a phone" },
  { img: "/img/technology/point-management.webp", mediaClass: "object-contain p-5", title: "Fully Automated Point Management System", body: "An advanced system that automates parcel delivery, overseeing every stage from pickup to transit and courier management.", alt: "RedCat point management system displayed on a laptop" },
  { img: "/img/technology/rider-app.webp", mediaClass: "object-contain object-bottom", title: "Rider & Driver Apps", body: "Easy-to-use rider and driver apps to plan pickups and deliveries.", alt: "RedCat rider app displayed on a phone" },
];

const towns = [...new Set(HUBS.map((h) => h.name.replace(/ (Central|North|South)$/, "")))];

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-clip bg-brand pb-28 pt-10 text-white sm:pb-36 sm:pt-14 lg:pb-44">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-2 pr-4 text-[13px] font-bold tracking-[0.12em] text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
              NEXT DAY, ISLAND-WIDE
            </p>
            <div className="mt-6">
              <HeroHeadline />
            </div>
            <p className="mt-7 max-w-xl text-xl font-bold leading-snug sm:text-[22px]">
              We are building the fastest and largest courier network in Sri Lanka.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ArrowLink href="/hr" variant="light">Careers</ArrowLink>
              <ArrowLink href={FRANCHISE_OPTIONS_HREF} variant="outline" className="text-white">Become a franchisee</ArrowLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[400px] pt-6 lg:pt-0">
            <div role="img" aria-label="The RedCat cat mascot with eyes that follow your cursor, above the RedCat wordmark">
              <Mascot variant="logo" className="w-full [&_svg]:h-auto [&_svg]:w-full" />
            </div>
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-0 -bottom-px h-16 bg-ink sm:h-24" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
      </section>

      {/* ---------- TOWNS TICKER ---------- */}
      <section aria-label="Towns we deliver to" className="bg-ink py-5 text-white">
        <Marquee speed={90}>
          {towns.map((t) => (
            <span key={t} className="flex items-center whitespace-nowrap text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="px-6">{t}</span>
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---------- NUMBERS ---------- */}
      <section aria-label="RedCat in numbers" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Sri Lanka is becoming a delivery economy. <span className="text-ink/35">We built the network for it.</span>
          </p>
        </Reveal>
        <dl className="mt-14 grid grid-cols-2 border-t border-black/10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className={`flex flex-col border-b border-black/10 py-8 pr-4 lg:border-b-0 ${i % 2 ? "pl-5 lg:pl-8" : "lg:pl-8 lg:first:pl-0"} ${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "border-l" : ""}`}>
              <dt className="order-2 mt-2 text-base font-bold sm:text-lg">
                {s.label}
                <span className="block text-sm font-medium text-ink/55">{s.note}</span>
              </dt>
              <dd className="text-[clamp(3.5rem,8vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em] text-brand">
                <CountUp to={s.to} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ---------- SERVICES ---------- */}
      <Services />

      {/* ---------- MAP ---------- */}
      <section id="hubs" className="scroll-mt-20 bg-paper py-20 sm:py-28" aria-labelledby="map-heading">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">The network</p>
              <h2 id="map-heading" className="mt-3 max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-6xl">
                57 hubs across 25 districts.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-ink/70">
                Choose a district to see RedCat’s regional hubs. Pins mark hub towns.
              </p>
            </Reveal>
          </div>
          <div className="mt-10">
            <Suspense fallback={<p className="min-h-72 rounded-[1.75rem] bg-white p-6" role="status">Loading district map…</p>}>
              <NetworkExplorer />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <Journey />

      {/* ---------- FLEET ---------- */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.25fr_1fr]">
        <div className="overflow-hidden rounded-3xl">
          <Image src="/img/points/truck.webp" alt="A RedCat truck travelling across Sri Lanka" width={1400} height={700} sizes="(min-width: 1024px) 680px, 100vw" className="block h-auto w-full" />
        </div>
        <Reveal delay={100}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">The fleet</p>
          <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Trucks, vans and riders. All in red.</h2>
          <p className="mt-5 text-lg text-ink/70">
            Trucks run the long hauls between regional hubs overnight. Vans and scooters take the last mile. Our goal is simple: the largest delivery network in Sri Lanka.
          </p>
          <ArrowLink href="/about" className="mt-8">About RedCat</ArrowLink>
        </Reveal>
      </section>

      {/* ---------- TECH ---------- */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Technology</p>
            <h2 className="mt-3 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Unmatched technology.</h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {tech.map((t, i) => (
              <li key={t.title}>
                <Reveal delay={i * 100} className="group h-full overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
                    <Image src={t.img} alt={t.alt} fill sizes="(min-width: 1024px) 400px, 100vw" className={t.mediaClass} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold leading-snug tracking-tight">{t.title}</h3>
                    <p className="mt-2 text-ink/70">{t.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SocialImpact />

      {/* ---------- DEALER CTA ---------- */}
      <section className="relative overflow-clip bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">For business owners</p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
            Run a RedCat hub <span className="text-brand">in your town.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Drive traffic to your business, win repeat customers and be part of the revolution.
          </p>
          <div className="mt-10">
            <Magnetic>
              <ArrowLink href={FRANCHISE_OPTIONS_HREF} variant="brand" className="px-9 py-5 text-lg">Become a franchisee</ArrowLink>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
