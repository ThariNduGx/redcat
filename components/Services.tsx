"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import Reveal from "./Reveal";
import ArrowLink from "./ui/ArrowLink";

const SERVICES = [
  {
    title: "Next-Day Delivery",
    headline: "Send today. Deliver tomorrow.",
    body: "Reach customers across Sri Lanka through one connected islandwide delivery network. Your parcel travels overnight, ready for the next day.",
    img: "/img/process/delivery.webp",
    width: 1600, height: 1000,
    alt: "A RedCat rider handing a parcel to a customer at her door",
    href: "/contact?topic=Something%20else",
    action: "Enquire about delivery",
  },
  {
    title: "Pickup & Drop",
    headline: "Your doorstep. Your local point.",
    body: "Choose convenient doorstep pickup or drop your parcel at a nearby CAT Point. Send it in the way that fits your day.",
    img: "/img/process/pickup.webp",
    width: 1600, height: 1000,
    alt: "A RedCat delivery rider travelling along a local road",
    href: "/contact?topic=Pickup%20request",
    action: "Request a pickup",
  },
  {
    title: "Cash on Delivery",
    headline: "Deliver the order. Collect payment.",
    body: "Support your online business with cash on delivery (COD) collection and visibility of payments made at delivery, through the same connected network.",
    img: "/img/points/storefront.webp",
    width: 1400, height: 790,
    alt: "A RedCat Express Point ready to serve local customers and businesses",
    href: "/contact?topic=Business%20account",
    action: "Talk about your business",
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 id="services-heading" className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-5xl">Delivery your way.</h2>
          <p className="max-w-xl text-lg text-ink/80">Next-day parcels, convenient pickups and cash on delivery. Explore our services and find what works for you.</p>
        </Reveal>
        <div role="tablist" aria-label="Delivery services" className="mt-10 grid gap-2 sm:grid-cols-3" onKeyDown={(event) => {
          const next = event.key === "ArrowRight" ? (active + 1) % SERVICES.length : event.key === "ArrowLeft" ? (active + SERVICES.length - 1) % SERVICES.length : event.key === "Home" ? 0 : event.key === "End" ? SERVICES.length - 1 : null;
          if (next === null) return;
          event.preventDefault();
          setActive(next);
          tabs.current[next]?.focus();
        }}>
          {SERVICES.map((service, index) => (
            <button key={service.title} ref={(element) => { tabs.current[index] = element; }} type="button" role="tab" id={`${uid}-tab-${index}`} aria-controls={`${uid}-panel-${index}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} className={`press rounded-full px-5 py-4 text-base font-bold transition-colors ${active === index ? "bg-ink text-white" : "bg-white text-ink hover:bg-brand-soft"}`}>{service.title}</button>
          ))}
        </div>
        {SERVICES.map((service, index) => (
          <div key={service.title} role="tabpanel" id={`${uid}-panel-${index}`} aria-labelledby={`${uid}-tab-${index}`} tabIndex={0} hidden={active !== index} className="mt-6 overflow-hidden rounded-3xl bg-white">
            <div className="grid items-center lg:grid-cols-[1.1fr_1fr]">
              <div className="w-full">
                <Image src={service.img} alt={service.alt} width={service.width} height={service.height} sizes="(min-width: 1024px) 620px, 100vw" className="block h-auto w-full" />
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <h3 className="max-w-lg text-3xl font-extrabold leading-[1.1] tracking-[-0.035em] sm:text-4xl">{service.headline}</h3>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/80">{service.body}</p>
                <ArrowLink href={service.href} className="mt-7">{service.action}</ArrowLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
