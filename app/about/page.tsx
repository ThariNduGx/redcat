import { HUB_MAP_HREF } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import CountUp from "@/components/ui/CountUp";
import Mascot from "@/components/ui/Mascot";
import SocialImpact from "@/components/SocialImpact";
import { Check, Sparkles, Target } from "lucide-react";
import { VISION, MISSION, CORE_VALUES, CUSTOMER_BENEFITS } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about RedCat’s vision, mission, core values and ambition to connect Sri Lanka through a nationwide parcel delivery network.",
};

const tiers = [
  { n: 930, suffix: "+", label: "Express points", note: "Local parcel drop-off and collection in your neighbourhood", tag: "Islandwide" },
  { n: 57, suffix: "", label: "Regional hubs", note: "Located in every district from Jaffna to Hambantota", tag: "Every district" },
];

export default function AboutPage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-24 pt-12 text-white sm:pb-32 sm:pt-16 lg:pb-36">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-3 pr-4 text-[12px] font-bold tracking-[0.14em] uppercase text-white shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              About RedCat
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
              Sri Lanka is becoming a delivery economy.
            </h1>
            <p className="mt-7 max-w-xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
              We are building the nation&apos;s fastest, most accessible parcel network — uniting local franchise entrepreneurs, smart digital tracking, and a steadfast promise of next-day delivery.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ArrowLink href={HUB_MAP_HREF} variant="light">Explore network</ArrowLink>
              <ArrowLink href="/dealers" variant="outline" className="text-white hover:bg-white hover:text-ink">
                Become a dealer
              </ArrowLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border-4 border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)]">
              <Image
                src="/img/points/storefront.webp"
                alt="A RedCat Express Point storefront ready to serve local communities"
                width={1400}
                height={790}
                preload
                sizes="(min-width: 1024px) 560px, 100vw"
                className="block h-auto w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-0 -bottom-px h-12 bg-white sm:h-20" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
      </section>

      {/* ---------- VISION & MISSION ---------- */}
      <section aria-label="Our vision and mission" className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Vision Card - Bold Red */}
          <Reveal className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand via-[#d11b1b] to-[#b81414] p-8 text-white shadow-xl shadow-brand/15 sm:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
                <Target className="h-4 w-4" />
                Our Vision
              </div>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
                The nation&apos;s most trusted delivery network.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/95 sm:text-xl font-medium">
                {VISION}
              </p>
            </div>
            <div className="mt-8 border-t border-white/20 pt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">RedCat Standard · 100% Islandwide</span>
            </div>
          </Reveal>

          {/* Mission Card - Ink with Red Accents */}
          <Reveal delay={100} className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-brand/20 bg-ink p-8 text-white shadow-xl sm:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl">
                Fast, reliable, and accessible everywhere.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/85 sm:text-xl font-medium">
                {MISSION}
              </p>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand">Next-Day Delivery · Empowering Communities</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CORE VALUES ---------- */}
      <section aria-labelledby="values-heading" className="bg-mist/70 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">What drives us</p>
            <h2 id="values-heading" className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Our core values.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/75">
              The foundational commitments that guide every parcel, rider, and franchise partner across our network.
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 60}>
                <div className="group h-full rounded-[2rem] border-2 border-black/5 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl hover:shadow-brand/5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-sm font-extrabold text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                      0{index + 1}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-brand/30 transition duration-300 group-hover:bg-brand group-hover:scale-125" />
                  </div>
                  <dt className="mt-6 text-2xl font-extrabold tracking-tight text-ink transition-colors group-hover:text-brand">
                    {value.title}
                  </dt>
                  <dd className="mt-3 text-base leading-relaxed text-ink/75">
                    {value.body}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- THE REDCAT ADVANTAGE ---------- */}
      <section aria-labelledby="advantage-heading" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <div className="rounded-[3rem] border border-brand/15 bg-gradient-to-b from-brand-soft/70 via-mist/50 to-white p-8 sm:p-14 lg:p-16">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Why RedCat</p>
            <h2 id="advantage-heading" className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              The RedCat advantage.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/75">
              Engineered specifically for Sri Lanka&apos;s geography, commerce, and growing digital economy.
            </p>
          </Reveal>

          <dl className="mt-12 grid gap-8 lg:grid-cols-2">
            {CUSTOMER_BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 80}>
                <div className="flex items-start gap-5 rounded-2xl bg-white p-6 shadow-sm border border-black/5">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/20">
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  </span>
                  <div>
                    <dt className="text-xl font-extrabold tracking-tight text-ink">
                      {benefit.title}
                    </dt>
                    <dd className="mt-2 text-base leading-relaxed text-ink/75">
                      {benefit.body}
                    </dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- THE NETWORK HIERARCHY ---------- */}
      <section aria-labelledby="network-hierarchy" className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Nationwide Infrastructure</p>
          <h2 id="network-hierarchy" className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
            Express points and regional hubs.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink/75">
            Connecting every corner of the island through synchronized line-haul logistics and local community touchpoints.
          </p>
        </Reveal>

        <ol className="mt-16 flex flex-col items-center">
          {tiers.map((t, i) => (
            <li key={t.label} className="flex w-full flex-col items-center">
              {i > 0 && (
                <div aria-hidden className="flex flex-col items-center my-1.5">
                  <span className="h-8 w-0.5 border-l-2 border-dashed border-brand" />
                </div>
              )}
              <Reveal delay={i * 90} className="w-full max-w-3xl">
                <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 border-black/10 bg-white p-6 transition duration-300 hover:border-brand hover:shadow-xl hover:shadow-brand/5">
                  <div className="flex items-center gap-5">
                    <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-3xl font-extrabold text-brand transition duration-300 group-hover:bg-brand group-hover:text-white sm:text-4xl">
                      <CountUp to={t.n} suffix={t.suffix} />
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-extrabold tracking-tight text-ink group-hover:text-brand transition-colors">
                          {t.label}
                        </span>
                        <span className="rounded-full bg-mist px-3 py-0.5 text-xs font-bold text-ink/70">
                          {t.tag}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-ink/65 sm:text-base">
                        {t.note}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- SOCIAL IMPACT PREVIEW ---------- */}
      <SocialImpact id="community-impact" />

      {/* ---------- CALL TO ACTION WITH MASCOT ---------- */}
      <section className="rc-grain relative overflow-clip bg-brand text-white">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 text-center sm:pb-28">
          <div className="relative mx-auto max-w-2xl">
            <Mascot className="absolute bottom-[calc(100%-4px)] left-1/2 w-48 -translate-x-1/2 [&_svg]:h-auto [&_svg]:w-full" />
            <div className="relative rounded-[2.5rem] border-[3px] border-ink bg-white px-6 py-12 text-ink shadow-2xl sm:px-12">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Our promise</p>
              <p className="mt-3 text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl">
                Next day delivery.
              </p>
              <p className="mt-4 text-base text-ink/70 sm:text-lg">
                Wherever your parcel needs to go, RedCat delivers across Sri Lanka.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ArrowLink href={HUB_MAP_HREF}>See the network</ArrowLink>
                <ArrowLink href="/dealers" variant="brand">Become a dealer</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
