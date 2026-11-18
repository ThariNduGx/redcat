import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Footprints, Repeat2, Rocket, Sparkles } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import CatLoader from "@/components/ui/CatLoader";
import Mascot from "@/components/ui/Mascot";

export const metadata: Metadata = {
  title: "Become a Dealer",
  description: "Join RedCat as a regional distributor or express point and bring next day delivery to your town.",
};

const benefits = [
  { icon: Sparkles, title: "A one time opportunity", body: "Be among the first to bring RedCat to your district while the network is still growing." },
  { icon: Footprints, title: "Drive traffic to your business", body: "Every parcel dropped off or collected brings someone new through your door." },
  { icon: Repeat2, title: "Get repeat customers", body: "Delivery is a habit. People come back to the place they send and collect from." },
  { icon: Rocket, title: "Be part of a revolution", body: "Help build what we aim to be: the largest delivery network in Sri Lanka." },
];

const roles = [
  { key: "hub", title: "Regional hub distributor", count: "57 hubs", body: "Run the regional hub for your district: the link between local express points and the zone." },
  { key: "point", title: "Express point", count: "930+ points", body: "Be the neighbourhood drop-off and collection point, right inside your shop." },
];

export default function DealersPage() {
  return (
    <>
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-24 pt-12 text-white sm:pb-32 sm:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink">For business owners</p>
            <h1 className="mt-4 text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
              Join us as a regional distributor.
            </h1>
            <p className="mt-6 max-w-lg text-xl font-bold leading-snug">
              Bring RedCat&rsquo;s next day delivery to your town, and grow your own business with it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ArrowLink href="#apply" variant="light">Apply now</ArrowLink>
              <ArrowLink href="#roles" variant="outline" className="text-white">Ways to join</ArrowLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <Image src="/img/points/storefront.webp" alt="A RedCat Express Point storefront" width={1400} height={790} preload sizes="(min-width: 1024px) 600px, 100vw" className="block h-auto w-full" />
          </div>
        </div>
        <div aria-hidden className="absolute inset-x-0 -bottom-px h-14 bg-white sm:h-20" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Why RedCat</p>
          <h2 className="mt-3 max-w-2xl text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Good for your business. Good for your town.</h2>
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 80} className="group h-full rounded-[2rem] bg-mist p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-black/10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <b.icon size={22} strokeWidth={2.4} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-ink/70">{b.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="roles" className="scroll-mt-24 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Ways to join</p>
            <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Pick your part of the network.</h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {roles.map((r, i) => (
              <li key={r.key}>
                <Reveal delay={i * 100} className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:p-9">
                  <span className="self-start rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white">{r.count}</span>
                  <h3 className="mt-5 text-3xl font-extrabold tracking-tight">{r.title}</h3>
                  <p className="mt-3 flex-1 text-lg text-ink/70">{r.body}</p>
                  <ArrowLink href={`/dealers?role=${r.key}#apply`} className="mt-8 self-start">Apply for this</ArrowLink>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="rc-grain relative scroll-mt-16 overflow-clip bg-brand pb-20 pt-16 text-white sm:pb-28">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink">Apply</p>
            <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Tell us about you.</h2>
            <p className="mx-auto mt-4 max-w-md text-xl font-bold">Two minutes, no commitment. We&rsquo;ll call you back.</p>
          </div>
          <div className="relative z-10 mt-24">
            <Mascot className="absolute bottom-[calc(100%-4px)] left-1/2 w-44 -translate-x-1/2 [&_svg]:h-auto [&_svg]:w-full" />
            <div className="relative z-10">
              <Suspense fallback={<div className="grid h-96 place-items-center rounded-[2rem] bg-white"><CatLoader /></div>}>
                <EnquiryForm kind="dealer" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
