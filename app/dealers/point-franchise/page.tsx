import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import {
  Banknote,
  BarChart3,
  Boxes,
  Check,
  Clock,
  Cpu,
  GraduationCap,
  Layers,
  MapPin,
  Monitor,
  Printer,
  ScanBarcode,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import CatLoader from "@/components/ui/CatLoader";
import Mascot from "@/components/ui/Mascot";

export const metadata: Metadata = {
  title: "REDCAT Point Franchise Opportunity",
  description:
    "Own a RedCat Point franchise business. Complete turnkey setup with IT system, equipment, branding, exclusive sales area, and LKR 1.5Mn - 2.0Mn investment.",
};

const advantages = [
  {
    icon: TrendingUp,
    titleEn: "Day by Day Growing Business",
    titleSi: "දිනෙන් දින වර්ධනය වන ව්‍යාපාරයක්",
    body: "Rapidly expanding e-commerce and courier volume creates steady daily customer footfall and compounding business value.",
  },
  {
    icon: Monitor,
    titleEn: "100% IT System Operation",
    titleSi: "සම්පූර්ණයෙන්ම IT පද්ධතියක් මඟින් ක්‍රියාත්මක වේ (වැරදි අවමයි)",
    body: "Cloud-based automated point management system handles every parcel, barcode scan, and tracking step with zero guesswork.",
  },
  {
    icon: ShieldCheck,
    titleEn: "Fraud-Resistant & Secure",
    titleSi: "වංචා සිදු කළ නොහැකි, ආරක්ෂිත පද්ධතියක්",
    body: "Full digital traceability, encrypted audit trails, and OTP verification ensure that every handover and cash transaction is protected.",
  },
  {
    icon: Banknote,
    titleEn: "100% Cash Business",
    titleSi: "සම්පූර්ණයෙන්ම මුදල් මත පදනම් වූ ව්‍යාපාරයක්",
    body: "Immediate cash-in-hand transactions with zero credit risk, transparent settlements, and dependable daily cash flow.",
  },
  {
    icon: BarChart3,
    titleEn: "Real-Time Profit Visibility",
    titleSi: "ඔබගේ ලාභය සජීවීව (Real-time) දැකගත හැකිය",
    body: "Dedicated live dashboard lets you monitor your commissions, parcel throughput, and exact profit in real-time.",
  },
  {
    icon: Sparkles,
    titleEn: "Higher Profit Potential",
    titleSi: "ඉහළ ලාභ උපයාගැනීමේ හැකියාව",
    body: "Lucrative commission structure for parcel drop-offs, doorstep pickups, and collection handling with low fixed operational overheads.",
  },
  {
    icon: Clock,
    titleEn: "Convenient Operating Hours",
    titleSi: "සුවපහසු මෙහෙයුම් කාලය: 9.00 AM – 5.00 PM",
    body: "Predictable, balanced retail hours (9:00 AM – 5:00 PM) that can either run standalone or integrate into your existing retail shop.",
  },
  {
    icon: MapPin,
    titleEn: "Dedicated Sales Area",
    titleSi: "ඔබට වෙන් කළ ප්‍රදේශයක් – අභ්‍යන්තර තරඟයක් නොමැත",
    body: "Strict territorial exclusivity with no internal RedCat competition within your allocated community or catchment area.",
  },
];

const turnkeyItems = [
  {
    icon: Cpu,
    titleEn: "IT System & Software",
    titleSi: "IT පද්ධතිය සහ මෘදුකාංග",
    desc: "Complete point management software, merchant portal access, automated label printing, and live islandwide tracking integration.",
  },
  {
    icon: ScanBarcode,
    titleEn: "Operational Devices",
    titleSi: "මෙහෙයුම් උපකරණ",
    desc: "High-speed commercial barcode scanner, receipt and shipping label printer, and precision digital parcel weighing scale.",
  },
  {
    icon: Boxes,
    titleEn: "Plastic Containers",
    titleSi: "පාර්සල් බහාලුම්",
    desc: "Durable, heavy-duty stackable RedCat red parcel crates and secure handling containers to safeguard customer goods.",
  },
  {
    icon: Layers,
    titleEn: "Racking Systems",
    titleSi: "රාක්ක පද්ධති",
    desc: "Modular, space-efficient parcel storage shelving and organizing bays customized for your specific storefront floor plan.",
  },
  {
    icon: Printer,
    titleEn: "Branding & Signage",
    titleSi: "බ්‍රෑන්ඩින් සහ සයින්බෝඩ්",
    desc: "Exterior illuminated 3D RedCat storefront sign, interior wall graphics, branded front counter wraps, and marketing collaterals.",
  },
  {
    icon: GraduationCap,
    titleEn: "Training & Operational Support",
    titleSi: "පුහුණුව හා මෙහෙයුම් සහාය",
    desc: "Comprehensive staff training on software and standard SOPs, marketing launch support, and ongoing franchisee advisory.",
  },
];

const dailySteps = [
  {
    step: "01",
    titleEn: "Accept Parcels",
    titleSi: "පාර්සල් ලබාගැනීම",
    desc: "Receive parcels from walk-in customers, local online merchants, and businesses.",
  },
  {
    step: "02",
    titleEn: "Scan & Register",
    titleSi: "ස්කෑන් කර ලියාපදිංචි කිරීම",
    desc: "Quick barcode scan automatically registers the waybill and confirms parcel weight.",
  },
  {
    step: "03",
    titleEn: "Sort & Store",
    titleSi: "වර්ගීකරණය හා ගබඩා කිරීම",
    desc: "Place packages into designated destination zone bins on organized RedCat racks.",
  },
  {
    step: "04",
    titleEn: "Hand Over",
    titleSi: "පාරිභෝගිකයාට / රයිඩර්ට භාරදීම",
    desc: "Hand over outgoing parcels to RedCat line-haul vans, or deliver inward parcels to recipients.",
  },
  {
    step: "05",
    titleEn: "See Your Profit",
    titleSi: "ඔබගේ ලාභය සජීවීව බලන්න",
    desc: "Your commission is credited instantly with real-time profit analytics on your screen.",
  },
];

export default function PointFranchisePage() {
  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-24 pt-12 text-white sm:pb-32 sm:pt-16 lg:pb-36">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-3 pr-4 text-xs font-bold tracking-[0.14em] uppercase text-white shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              Point Franchise Opportunity
            </div>

            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
              Own a REDCAT Point Franchise Business
            </h1>

            <p className="mt-4 text-xl font-bold leading-snug text-white/95 sm:text-2xl">
              ඔබේම REDCAT Point එකක් අරඹා, දිනෙන් දින වර්ධනය වන ව්‍යාපාරයක හිමිකරුවෙකු වන්න!
            </p>

            <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">
              Partner with Sri Lanka&apos;s fastest growing delivery network. Turn your storefront or retail commercial space into an official RedCat parcel hub with 100% IT automation, zero credit risk, and guaranteed territorial exclusivity.
            </p>

            {/* Investment Highlight Pill */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl bg-ink p-4 sm:p-5 shadow-2xl border border-white/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Franchise Investment · Franchise ආයෝජනය
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                  LKR 1.5 Mn – 2.0 Mn
                </p>
              </div>
              <div className="border-l border-white/20 pl-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">Turnkey Setup</p>
                <p className="text-sm font-semibold text-white/90">IT, Equipment & Branding Included</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ArrowLink href="#apply" variant="light">
                Apply for Point Franchise
              </ArrowLink>
              <ArrowLink href="#advantages" variant="outline" className="text-white hover:bg-white hover:text-ink">
                View Advantages
              </ArrowLink>
            </div>
          </div>

          {/* Hero Storefront Image */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border-4 border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)]">
              <Image
                src="/img/points/point-franchise.jpg"
                alt="Own a REDCAT Point Franchise Business official opportunity showcase"
                width={1024}
                height={682}
                preload
                sizes="(min-width: 1024px) 560px, 100vw"
                className="block h-auto w-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2 text-xs font-bold tracking-wide uppercase text-white/70">
              <span>Send Today. Receive Tomorrow.</span>
              <span>Exclusive Territory · 930+ Points</span>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-12 bg-white sm:h-20"
          style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
      </section>

      {/* ---------- AT A GLANCE INVESTMENT METRICS ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Capital Outlay</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">1.5 - 2.0 Mn</p>
            <p className="mt-1 text-xs font-medium text-ink/70">LKR total franchise investment</p>
          </div>
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Working Hours</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">9 AM – 5 PM</p>
            <p className="mt-1 text-xs font-medium text-ink/70">Convenient daytime retail hours</p>
          </div>
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Revenue Model</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">100% Cash</p>
            <p className="mt-1 text-xs font-medium text-ink/70">Immediate commission & zero credit</p>
          </div>
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Exclusivity</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">Dedicated Area</p>
            <p className="mt-1 text-xs font-medium text-ink/70">No internal RedCat competition</p>
          </div>
        </div>
      </section>

      {/* ---------- FRANCHISEE ADVANTAGES ---------- */}
      <section id="advantages" className="scroll-mt-24 bg-mist/60 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Key Benefits</span>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Franchisee Advantages (REDCAT Point හි වාසි)
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/75">
              Built to give independent business owners and entrepreneurs a high-demand, technology-driven business model with maximum security and transparent daily earnings.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((adv, i) => (
              <Reveal key={adv.titleEn} delay={i * 60}>
                <div className="group flex h-full flex-col justify-between rounded-3xl border-2 border-black/5 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl hover:shadow-brand/5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                        <adv.icon size={22} strokeWidth={2.4} />
                      </span>
                      <span className="text-xs font-extrabold text-ink/30">0{i + 1}</span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold tracking-tight text-ink group-hover:text-brand transition-colors">
                      {adv.titleEn}
                    </h3>
                    <p className="mt-1.5 text-xs font-bold text-brand-deep">
                      {adv.titleSi}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">
                      {adv.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHAT REDCAT PROVIDES ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Turnkey Franchise Package</span>
          <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
            What REDCAT Provides (REDCAT වෙතින් ඔබට ලැබෙන දේ)
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink/75">
            Everything required to open and operate your store from day one is supplied, installed, and supported directly by RedCat.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {turnkeyItems.map((item, i) => (
            <Reveal key={item.titleEn} delay={i * 70}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-black/10 bg-white p-8 shadow-sm transition duration-300 hover:border-brand hover:shadow-lg">
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
                    <item.icon size={26} strokeWidth={2.3} />
                  </div>
                  <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">
                    {item.titleEn}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-brand">
                    {item.titleSi}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/40">
                  <Check className="h-4 w-4 text-brand" /> Included in Setup
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- SIMPLE DAILY OPERATION ---------- */}
      <section className="bg-ink py-20 sm:py-28 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Smooth Workflow</span>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Simple Daily Operation (සරල දිනපතා මෙහෙයුම්)
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
              Operating a RedCat Point is straightforward and fully assisted by automated software. No courier background required.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {dailySteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 80}>
                <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-brand hover:bg-white/10">
                  <div>
                    <span className="text-3xl font-extrabold text-brand sm:text-4xl">
                      {step.step}
                    </span>
                    <h3 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                      {step.titleEn}
                    </h3>
                    <p className="mt-1 text-xs font-bold text-brand-soft">
                      {step.titleSi}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STOREFRONT REQUIREMENTS ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <div className="rounded-[3rem] border border-brand/20 bg-gradient-to-b from-brand-soft/60 to-white p-8 sm:p-14 lg:p-16">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Location Criteria</span>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Franchise Space & Eligibility Criteria
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/75">
              Ideal for new independent shopfronts or as an add-on service to an existing grocery, pharmacy, stationery, or retail store.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Floor Space</span>
              <p className="mt-2 text-2xl font-extrabold text-ink">150 – 300 Sq.Ft</p>
              <p className="mt-2 text-sm text-ink/70">
                Dedicated customer reception desk and organized parcel racking area.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Accessibility</span>
              <p className="mt-2 text-2xl font-extrabold text-ink">Street Frontage</p>
              <p className="mt-2 text-sm text-ink/70">
                Ground floor commercial space with convenient customer parking or easy curbside vehicle access.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Infrastructure</span>
              <p className="mt-2 text-2xl font-extrabold text-ink">Power & Internet</p>
              <p className="mt-2 text-sm text-ink/70">
                Continuous electricity supply and dependable Wi-Fi/4G internet connection for point software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- APPLICATION FORM ---------- */}
      <section id="apply" className="rc-grain relative scroll-mt-16 overflow-clip bg-brand pb-20 pt-16 text-white sm:pb-28">
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink bg-white/90 px-4 py-1.5 rounded-full inline-block">
              Become a Franchisee
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-5xl">
              Apply for a REDCAT Point Franchise Today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-lg font-bold text-white/95">
              අදම REDCAT Point Franchise හවුල්කරුවෙකු වන්න!
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
              Submit your details below. Our franchise recruitment team will review your location and get in touch within 24 hours.
            </p>
          </div>

          <div className="relative mt-12 rounded-[2.5rem] border-[3px] border-ink bg-white p-6 text-ink shadow-2xl sm:p-12">
            <Mascot className="absolute -top-16 left-1/2 w-32 -translate-x-1/2 sm:-top-20 sm:w-40 [&_svg]:h-auto [&_svg]:w-full" />
            <Suspense fallback={<div className="grid min-h-[300px] place-items-center"><CatLoader label="Loading application form…" /></div>}>
              <EnquiryForm kind="dealer" />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
