import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, MapPin, Package, Store } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import CatLoader from "@/components/ui/CatLoader";
import { CONTACT, FEATURES, HUB_MAP_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with RedCat: pickups, parcel questions and business accounts.",
};

const shortcuts = [
  ...(FEATURES.tracking ? [{ href: "/track", icon: Package, title: "Track a parcel", body: "Live status and route" }] : []),
  { href: HUB_MAP_HREF, icon: MapPin, title: "Find a hub", body: "57 hubs on the map" },
  { href: "/dealers", icon: Store, title: "Become a dealer", body: "Run RedCat in your town" },
];

export default function ContactPage() {
  const rows: [string, string | null, string?][] = [
    ["Phone", CONTACT.phone, CONTACT.phone ? `tel:${CONTACT.phone}` : undefined],
    ["WhatsApp", CONTACT.whatsapp],
    ["Address", CONTACT.address],
  ];
  const shown = rows.filter(([, v]) => v);

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Contact</p>
          <h1 className="mt-3 text-6xl font-extrabold leading-[0.92] tracking-[-0.045em] sm:text-7xl">Say hello.</h1>
          <p className="mt-6 max-w-md text-lg text-ink/70">
            Need a pickup, have a question about a parcel, or want a business account? Send us a message and the RedCat team will reply.
          </p>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.18em] text-ink/50">Quicker answers</p>
          <ul className="mt-3 space-y-2">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="press group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 transition hover:shadow-lg hover:shadow-black/5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist transition group-hover:bg-brand">
                    <s.icon size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold">{s.title}</span>
                    <span className="text-sm text-ink/55">{s.body}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-ink/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>

          {shown.length > 0 && (
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              {shown.map(([k, v, href]) => (
                <div key={k}>
                  <dt className="text-xs font-bold uppercase tracking-[0.18em] text-brand-deep">{k}</dt>
                  <dd className="mt-1 text-lg font-semibold">{href ? <a href={href} className="hover:underline">{v}</a> : v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Suspense fallback={<div className="grid min-h-[32rem] place-items-center rounded-[2rem] bg-white"><CatLoader /></div>}>
          <EnquiryForm kind="contact" />
        </Suspense>
      </div>
    </div>
  );
}
