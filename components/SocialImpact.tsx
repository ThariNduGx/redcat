import Image from "next/image";
import { EMPLOYMENT_AMBITIONS } from "@/lib/company";
import Reveal from "./Reveal";
import ArrowLink from "./ui/ArrowLink";

export function ImpactStats() {
  return (
    <div>
      <p className="max-w-2xl text-lg font-semibold">Planned employment opportunities as the network grows</p>
      <dl className="mt-8 grid gap-8 sm:grid-cols-3">
        {EMPLOYMENT_AMBITIONS.map((opportunity, index) => (
          <Reveal key={opportunity.label} delay={index * 80} className="flex flex-col">
            <dt className="mt-3 max-w-xs text-lg font-semibold">{opportunity.label}</dt>
            <dd className="-order-1 mt-2 text-[clamp(3rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.05em] text-brand">{opportunity.value}</dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}

export default function SocialImpact({ id = "social-impact" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 id={`${id}-heading`} className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Our social impact</h2>
            <p className="mt-7 max-w-xl text-2xl font-bold leading-snug tracking-tight">Local work. Wider opportunity.</p>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">We’re building more than a parcel network. RedCat aims to create local employment, empower franchise owners and help small businesses reach customers across Sri Lanka.</p>
            <ArrowLink href="/social-impact" className="mt-8">Explore our impact</ArrowLink>
          </Reveal>
          <Reveal delay={100} className="overflow-hidden rounded-3xl">
            <Image src="/img/points/partners.webp" alt="The RedCat team standing together in front of its delivery fleet" width={1400} height={700} sizes="(min-width: 1024px) 680px, 100vw" className="block h-auto w-full" />
          </Reveal>
        </div>
        <div className="mt-14"><ImpactStats /></div>
      </div>
    </section>
  );
}
