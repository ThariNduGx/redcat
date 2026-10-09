import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import FooterTrack from "./FooterTrack";
import { CONTACT, NAV } from "@/lib/site";

// Rendered at build time: the static export bakes in the year it was built
function Year() {
  return <>{new Date().getFullYear()}</>;
}


export default function Footer() {
  const hasContact = CONTACT.phone || CONTACT.email || CONTACT.address || CONTACT.whatsapp;
  return (
    <footer className="relative overflow-clip bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="inline-block rounded-2xl bg-white p-2.5">
              <Logo className="h-14 w-auto" />
            </div>
            <p className="mt-6 max-w-sm text-2xl font-extrabold leading-tight tracking-tight">Next day delivery, everywhere in Sri Lanka.</p>
            <div className="mt-6 max-w-sm">
              <FooterTrack />
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Explore</h2>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="group inline-flex items-center gap-2 text-lg font-semibold text-white/80 transition hover:text-white">
                    {item.label}
                    <ArrowRight size={18} className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Contact</h2>
            {hasContact ? (
              <ul className="mt-5 space-y-3 text-lg text-white/80">
                {CONTACT.phone && <li><a href={`tel:${CONTACT.phone}`} className="hover:text-white">{CONTACT.phone}</a></li>}
                {CONTACT.whatsapp && <li>WhatsApp: {CONTACT.whatsapp}</li>}
                {CONTACT.email && <li><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>}
                {CONTACT.address && <li>{CONTACT.address}</li>}
              </ul>
            ) : (
              <p className="mt-5 text-lg text-white/70">
                Send us a message from the{" "}
                <Link href="/contact" className="font-semibold text-white underline underline-offset-4">contact page</Link>.
              </p>
            )}
          </div>
        </div>
      </div>

      <p aria-hidden className="pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[clamp(5rem,22vw,20rem)] font-extrabold leading-[0.78] tracking-[-0.06em]">
        <span className="text-brand">RED</span>
        <span className="text-white/[0.07]">CAT</span>
      </p>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-white/50">
          <span>© <Year /> RedCat. All rights reserved.</span>
          <span>Next day delivery · Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}
