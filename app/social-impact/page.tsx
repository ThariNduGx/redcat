import { HUB_MAP_HREF } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { ImpactStats } from "@/components/SocialImpact";
import { IMPACT_AREAS } from "@/lib/company";

export const metadata: Metadata = {
  title: "Social Impact",
  description: "RedCat's ambition to create local employment, empower franchise owners and connect small businesses across Sri Lanka.",
};

export default function SocialImpactPage() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <Reveal>
            <h1 className="max-w-5xl text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">Opportunity, islandwide.</h1>
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-ink/80">Our social impact starts with connecting people and businesses. As RedCat grows, we aim to open up local work, support entrepreneurs and bring reliable parcel delivery closer to communities across Sri Lanka.</p>
          </Reveal>
          <Reveal delay={100} className="mt-12 overflow-hidden rounded-3xl">
            <Image src="/img/points/partners.webp" alt="RedCat staff and delivery riders standing together beside their vehicles" width={1400} height={700} preload sizes="(min-width: 1280px) 1240px, 100vw" className="block h-auto w-full" />
          </Reveal>
          <div className="mt-12"><ImpactStats /></div>
        </div>
      </section>

      <section aria-labelledby="community-heading" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal><h2 id="community-heading" className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Growing with communities.</h2></Reveal>
        <div className="mt-12 space-y-12">
          {IMPACT_AREAS.map((area, index) => (
            <Reveal key={area.title} delay={index * 80} className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <h3 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">{area.title}</h3>
              <div>
                <p className="max-w-2xl text-lg leading-relaxed text-ink/80">{area.body}</p>
                <ArrowLink href={area.href} className="mt-6">{area.action}</ArrowLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="access-heading" className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
          <Reveal className="overflow-hidden rounded-3xl"><Image src="/img/points/storefront.webp" alt="A RedCat Express Point serving its local community" width={1400} height={790} sizes="(min-width: 1024px) 620px, 100vw" className="block h-auto w-full" /></Reveal>
          <Reveal delay={100}>
            <h2 id="access-heading" className="max-w-lg text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Bringing delivery closer.</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">Our planned nationwide Express Point network is designed to make sending and receiving parcels more convenient, including in communities with fewer delivery access points.</p>
            <ArrowLink href={HUB_MAP_HREF} variant="light" className="mt-8">Explore the network</ArrowLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
