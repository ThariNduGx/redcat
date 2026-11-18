import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore careers in sales, business development, delivery and operations at RedCat. Help build Sri Lanka's next-day delivery network.",
};

const opportunities = [
  {
    title: "Business development",
    body: "Build relationships with merchants and businesses, identify new opportunities and help expand the RedCat network.",
    role: "Business Development Agent",
  },
  {
    title: "Sales",
    body: "Introduce RedCat services to prospective customers and support customer and business acquisition.",
    role: "Sales Executive",
  },
  {
    title: "Riders & drivers",
    body: "Connect our communities through parcel pickups, transportation and last-mile delivery.",
    role: "Rider or Driver",
  },
  {
    title: "Network operations",
    body: "Keep parcels moving through sorting, hub coordination and customer support across the network.",
    role: "Network Operations",
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="bg-brand text-white" aria-labelledby="careers-heading">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h1 id="careers-heading" className="text-[clamp(3rem,6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">Careers at RedCat.</h1>
            <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed sm:text-xl">Help build the next-day delivery network that brings Sri Lanka closer. Find your place in the team behind every parcel.</p>
            <ArrowLink href="#opportunities" variant="light" className="mt-8">Explore opportunities</ArrowLink>
          </Reveal>
          <Reveal delay={100} className="overflow-hidden rounded-3xl">
            <Image src="/img/points/partners.webp" alt="The RedCat team standing together in front of its delivery trucks" width={1400} height={700} preload sizes="(min-width: 1024px) 680px, 100vw" className="block h-auto w-full" />
          </Reveal>
        </div>
      </section>

      <section id="opportunities" aria-labelledby="opportunities-heading" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal className="max-w-3xl">
          <h2 id="opportunities-heading" className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Find your place.</h2>
          <p className="mt-6 max-w-2xl text-lg text-ink/80">Explore the teams helping us grow. Register your interest and tell us about your experience, preferred role and location.</p>
          <p className="mt-4 max-w-2xl text-base text-ink/70">These are areas of interest. Available positions, locations and requirements will be shared when recruitment opens.</p>
        </Reveal>
        <ul className="mt-12 space-y-5">
          {opportunities.map((opportunity, index) => (
            <li key={opportunity.role}>
              <Reveal delay={index * 70} className="grid items-center gap-6 rounded-[2rem] bg-mist p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:gap-12">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{opportunity.title}</h3>
                  <p className="mt-3 max-w-2xl text-lg text-ink/80">{opportunity.body}</p>
                </div>
                <ArrowLink href={`/contact?topic=Careers&role=${encodeURIComponent(opportunity.role)}`} aria-label={`Register your interest in ${opportunity.title}`} className="justify-self-start">Register interest</ArrowLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="career-enquiry-heading" className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:py-28 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <h2 id="career-enquiry-heading" className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Let’s move forward.</h2>
            <p className="mt-6 max-w-xl text-lg text-white/80">Have a different skill to bring to RedCat? Tell us how you would like to contribute.</p>
          </Reveal>
          <Reveal delay={100}>
            <ArrowLink href="/contact?topic=Careers" variant="light">Contact the team</ArrowLink>
            <p className="mt-5 max-w-sm text-base text-white/80">Want to run a local RedCat point? <a href="/dealers" className="font-bold text-white underline underline-offset-4">Become a dealer</a>.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
