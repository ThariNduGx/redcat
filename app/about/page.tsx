import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import CountUp from "@/components/ui/CountUp";
import Mascot from "@/components/ui/Mascot";
import SocialImpact from "@/components/SocialImpact";
import { VISION, MISSION, CORE_VALUES, CUSTOMER_BENEFITS } from "@/lib/company";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about RedCat’s vision, mission, core values and ambition to connect Sri Lanka through a nationwide parcel delivery network.",
};

const tiers = [
  { n: 1, suffix: "", label: "Mix Center", note: "Coordinated overnight sorting across the network", width: "w-[58%]" },
  { n: 4, suffix: "", label: "Zones", note: "Four connected operating zones", width: "w-[70%]" },
  { n: 57, suffix: "", label: "Regional hubs", note: "In every district, Jaffna to Monaragala", width: "w-[84%]" },
  { n: 930, suffix: "+", label: "Express points", note: "Where you send and collect parcels", width: "w-full" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:pt-16">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">About RedCat</p>
          <h1 className="mt-3 max-w-5xl text-[clamp(2.75rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
            Sri Lanka is becoming a delivery economy.
          </h1>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <p className="max-w-xl text-xl text-ink/70">
              RedCat is building a technology-driven national parcel delivery network in Sri Lanka. Our franchise model brings local entrepreneurs, connected digital systems and <strong className="text-ink">next-day delivery</strong> together, making parcel services more accessible for people and businesses.
            </p>
            <div className="overflow-hidden rounded-3xl">
              <Image src="/img/points/storefront.webp" alt="A RedCat Express Point storefront" width={1400} height={790} preload sizes="(min-width: 1024px) 640px, 100vw" className="block h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Our vision and mission" className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">Our vision</h2>
            <p className="mt-7 max-w-xl text-xl leading-relaxed text-white/90">{VISION}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">Our mission</h2>
            <p className="mt-7 max-w-xl text-xl leading-relaxed text-white/90">{MISSION}</p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal><h2 id="values-heading" className="text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">Our core values</h2></Reveal>
        <dl className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((value, index) => (
            <Reveal key={value.title} delay={index * 60}>
              <dt className="text-2xl font-extrabold tracking-tight">{value.title}</dt>
              <dd className="mt-3 max-w-sm text-lg leading-relaxed text-ink/80">{value.body}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section aria-labelledby="advantage-heading" className="bg-mist">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
          <Reveal><h2 id="advantage-heading" className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">The RedCat advantage</h2></Reveal>
          <dl className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {CUSTOMER_BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 80}>
                <dt className="max-w-lg text-2xl font-extrabold tracking-tight">{benefit.title}</dt>
                <dd className="mt-3 max-w-xl text-lg leading-relaxed text-ink/80">{benefit.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="how" className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">The network</p>
          <h2 id="how" className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Built in four layers.</h2>
        </Reveal>
        <ol className="mt-12 flex flex-col items-center">
          {tiers.map((t, i) => (
            <li key={t.label} className="flex w-full flex-col items-center">
              {i > 0 && <span aria-hidden className="my-1 h-8 border-l-[3px] border-dotted border-brand" />}
              <Reveal delay={i * 120} className={`${t.width} min-w-[min(100%,20rem)]`}>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full border-[3px] border-ink bg-white px-6 py-4 text-center transition hover:bg-ink hover:text-white">
                  <span className="text-4xl font-extrabold tracking-tight text-brand">
                    <CountUp to={t.n} suffix={t.suffix} />
                  </span>
                  <span className="text-xl font-extrabold">{t.label}</span>
                  <span className="hidden text-ink/60 md:inline [li:hover_&]:text-white/70">· {t.note}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <SocialImpact id="community-impact" />

      <section className="rc-grain relative overflow-clip bg-brand text-white">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-32 text-center sm:pb-28">
          <div className="relative mx-auto max-w-2xl">
            <Mascot className="absolute bottom-[calc(100%-4px)] left-1/2 w-48 -translate-x-1/2 [&_svg]:h-auto [&_svg]:w-full" />
            <div className="relative rounded-[2.5rem] border-[3px] border-ink bg-white px-6 py-12 text-ink shadow-2xl sm:px-12">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Our promise</p>
              <p className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl">Next day delivery.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ArrowLink href="/network">See the network</ArrowLink>
                <ArrowLink href="/dealers" variant="brand">Become a dealer</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
