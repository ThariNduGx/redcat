import type { Metadata } from "next";
import Image from "next/image";
import { Footprints, Repeat2, Rocket, Sparkles } from "lucide-react";
import LegacyFranchiseLink from "@/components/LegacyFranchiseLink";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { HUB_APPLICATION_HREF, POINT_APPLICATION_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "RedCat Franchise Opportunities",
  description: "Join RedCat as a regional distributor or express point and bring next day delivery to your town.",
};

const benefits = [
  { icon: Sparkles, title: "A one time opportunity", body: "Be among the first to bring RedCat to your district while the network is still growing." },
  { icon: Footprints, title: "Drive traffic to your business", body: "Every parcel dropped off or collected brings someone new through your door." },
  { icon: Repeat2, title: "Get repeat customers", body: "Delivery is a habit. People come back to the place they send and collect from." },
  { icon: Rocket, title: "Be part of a revolution", body: "Help build what we aim to be: the largest delivery network in Sri Lanka." },
];

const roles = [
  {
    key: "hub",
    title: "Regional Hub Franchise",
    count: "57 hubs",
    body: "Operate a regional hub that connects express points to RedCat’s overnight delivery network.",
    application: "Full application · English or Sinhala",
    href: HUB_APPLICATION_HREF,
    action: "Apply for a regional hub",
  },
  {
    key: "point",
    title: "RedCat Point Franchise",
    count: "930+ points",
    body: "Run a local RedCat parcel drop-off and collection point from your shop.",
    application: "Initial application · English or Sinhala",
    href: POINT_APPLICATION_HREF,
    action: "Apply for a RedCat Point",
  },
];

export default function DealersPage() {
  return (
    <>
      <LegacyFranchiseLink />
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-24 pt-12 text-white sm:pb-32 sm:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="mt-4 text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
              Become a RedCat franchise partner.
            </h1>
            <p className="mt-6 max-w-lg text-xl font-bold leading-snug">
              Operate a regional hub or bring parcel drop-off and collection to your shop.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ArrowLink href="#roles" variant="light">Choose a franchise</ArrowLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <Image src="/img/points/storefront.webp" alt="A RedCat Express Point storefront" width={1400} height={790} preload sizes="(min-width: 1024px) 600px, 100vw" className="block h-auto w-full" />
          </div>
        </div>
        <div aria-hidden className="absolute inset-x-0 -bottom-px h-14 bg-white sm:h-20" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
      </section>

      <section id="roles" className="scroll-mt-24 bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">Choose your franchise</h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {roles.map((r, i) => (
              <li key={r.key}>
                <Reveal delay={i * 100} className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:p-9">
                  <p className="text-sm font-semibold text-brand-deep">{r.count} in the network</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{r.title}</h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-ink/75 sm:text-lg">{r.body}</p>
                  <p className="mt-4 border-t border-ink/10 pt-4 text-sm font-semibold text-ink/75">{r.application}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {/* Open intake in a fresh document so site-wide analytics cannot carry across. */}
                    <ArrowLink documentHref={r.href} className="min-h-12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep">
                      {r.action}
                    </ArrowLink>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
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

      <section id="apply" className="scroll-mt-24 border-t border-ink/10 bg-paper py-10">
        <div className="mx-auto max-w-7xl px-5">
          <ArrowLink href="#roles" variant="outline">Choose your application</ArrowLink>
        </div>
      </section>
    </>
  );
}
