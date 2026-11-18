import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import {
  Banknote,
  BarChart3,
  Boxes,
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
    "Own a RedCat Point franchise business. Complete turnkey setup with IT system, equipment, branding, exclusive sales territory, and LKR 1.5Mn - 2.0Mn investment.",
};

const advantages = [
  {
    icon: TrendingUp,
    title: "Day-by-Day Growing Business",
    body: "Rapid growth in islandwide e-commerce and retail parcel delivery drives continuous customer footfall and compounding business value.",
  },
  {
    icon: Monitor,
    title: "100% IT System Operation",
    body: "Automated cloud-based point management system coordinates every parcel, label, and tracking milestone—eliminating manual paperwork and minimizing errors.",
  },
  {
    icon: ShieldCheck,
    title: "Fraud-Resistant & Secure",
    body: "Strict digital barcode verification, customer OTP release authentication, and encrypted audit trails ensure all packages and transactions remain fully protected.",
  },
  {
    icon: Banknote,
    title: "100% Cash-Based Business",
    body: "Immediate fee settlement and seamless Cash on Delivery (COD) processing with zero credit risk, no receivables, and dependable daily liquidity.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Profit Visibility",
    body: "Live analytics dashboard displays your parcel throughput, fee commissions, and exact net profit updated in real-time.",
  },
  {
    icon: Sparkles,
    title: "High Profit Potential",
    body: "Attractive commission tiers earned on parcel drop-offs, doorstep pickups, and collection handovers with minimal fixed recurring costs.",
  },
  {
    icon: Clock,
    title: "Convenient Operating Hours",
    body: "Standard 9:00 AM – 5:00 PM retail schedule offers a balanced business lifestyle, running standalone or alongside your existing shop.",
  },
  {
    icon: MapPin,
    title: "Dedicated Exclusive Territory",
    body: "Guaranteed territorial allocation ensures you operate as the sole authorized RedCat Point with zero internal network competition.",
  },
];

const turnkeyItems = [
  {
    icon: Cpu,
    title: "IT System & Software",
    desc: "Complete point management software, merchant portal access, automated label printing, and real-time islandwide tracking integration.",
  },
  {
    icon: ScanBarcode,
    title: "Operational Devices",
    desc: "Industrial commercial barcode scanner, receipt and shipping label printer, and precision digital parcel weighing scale.",
  },
  {
    icon: Boxes,
    title: "Plastic Containers",
    desc: "Heavy-duty stackable RedCat red parcel crates and secure handling containers to safeguard customer goods.",
  },
  {
    icon: Layers,
    title: "Racking Systems",
    desc: "Modular, space-efficient parcel storage shelving and organizing bays customized for your specific storefront floor plan.",
  },
  {
    icon: Printer,
    title: "Branding & Signage",
    desc: "Exterior illuminated 3D RedCat storefront sign, interior wall graphics, branded front counter wraps, and promotional signage.",
  },
  {
    icon: GraduationCap,
    title: "Training & Operational Support",
    desc: "Comprehensive staff training on software and standard SOPs, marketing launch support, and ongoing franchisee advisory.",
  },
];

const dailySteps = [
  {
    step: "01",
    title: "Accept Parcels",
    desc: "Receive parcels from walk-in retail customers, online merchants, and local commercial senders.",
  },
  {
    step: "02",
    title: "Scan & Register",
    desc: "Quick barcode scan registers the waybill, confirms destination, and auto-calculates weight in seconds.",
  },
  {
    step: "03",
    title: "Sort & Store",
    desc: "Place packages into designated destination zone bins on organized RedCat racking shelves.",
  },
  {
    step: "04",
    title: "Hand Over",
    desc: "Hand over outgoing parcels to the RedCat line-haul collection vehicle, or deliver incoming parcels to customers via OTP.",
  },
  {
    step: "05",
    title: "See Your Profit",
    desc: "Commission credits post directly to your digital ledger with instant visibility on your dashboard.",
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

            <h1 className="mt-5 text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
              Own a REDCAT Point Franchise Business
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
              Step into Sri Lanka&apos;s fastest-growing delivery network. Open a dedicated RedCat Point in your town with full IT automation, zero credit risk, guaranteed territorial exclusivity, and dependable daily cash flow.
            </p>

            {/* Investment Highlight Pill */}
            <div className="mt-8 inline-flex flex-wrap items-center gap-5 rounded-2xl bg-ink p-4 sm:p-5 shadow-2xl border border-white/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                  Total Franchise Investment
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                  LKR 1.5 Mn – 2.0 Mn
                </p>
              </div>
              <div className="border-l border-white/20 pl-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">Complete Turnkey Package</p>
                <p className="text-sm font-semibold text-white/90">IT, Equipment, Signage & Training Included</p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <ArrowLink href="#apply" variant="light">
                Apply for Point Franchise
              </ArrowLink>
              <ArrowLink href="#advantages" variant="outline" className="text-white hover:bg-white hover:text-ink">
                Franchisee Advantages
              </ArrowLink>
            </div>
          </div>

          {/* Hero Storefront Image */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border-4 border-white/20 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)]">
              <Image
                src="/img/points/storefront.webp"
                alt="Modern RedCat Point Express Storefront serving customers and merchants"
                width={1400}
                height={790}
                preload
                sizes="(min-width: 1024px) 560px, 100vw"
                className="block h-auto w-full object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between px-2 text-xs font-bold tracking-wide uppercase text-white/80">
              <span>Send Today. Receive Tomorrow.</span>
              <span>930+ Planned Express Points</span>
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
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Capital Outlay</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">1.5 - 2.0 Mn</p>
            <p className="mt-1 text-xs font-medium text-ink/70">LKR total turnkey investment</p>
          </div>
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Working Hours</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">9 AM – 5 PM</p>
            <p className="mt-1 text-xs font-medium text-ink/70">Convenient daytime retail schedule</p>
          </div>
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Revenue Model</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">100% Cash</p>
            <p className="mt-1 text-xs font-medium text-ink/70">Immediate commission & zero credit risk</p>
          </div>
          <div className="rounded-2xl border-2 border-black/5 bg-mist p-6 transition duration-300 hover:border-brand hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Territory</p>
            <p className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">Exclusive Area</p>
            <p className="mt-1 text-xs font-medium text-ink/70">No internal RedCat competition</p>
          </div>
        </div>
      </section>

      {/* ---------- FRANCHISEE ADVANTAGES ---------- */}
      <section id="advantages" className="scroll-mt-24 bg-mist/60 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Partner Benefits</span>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Franchisee Advantages
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/75">
              Engineered to provide independent entrepreneurs with a recession-resilient, technology-powered business model offering complete operational safety and high daily returns.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((adv, i) => (
              <Reveal key={adv.title} delay={i * 60}>
                <div className="group flex h-full flex-col justify-between rounded-3xl border-2 border-black/5 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl hover:shadow-brand/5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition duration-300 group-hover:bg-brand group-hover:text-white">
                        <adv.icon size={22} strokeWidth={2.4} />
                      </span>
                      <span className="text-xs font-extrabold text-ink/30">0{i + 1}</span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold tracking-tight text-ink group-hover:text-brand transition-colors">
                      {adv.title}
                    </h3>
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
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Reveal>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Turnkey Franchise Package</span>
              <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
                What REDCAT Provides
              </h2>
              <p className="mt-4 max-w-xl text-lg text-ink/75">
                From hardware and software to custom racking and physical signage, everything you need to open and run your store successfully is supplied and installed by RedCat.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {turnkeyItems.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition duration-300 hover:border-brand">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                        <item.icon size={20} strokeWidth={2.4} />
                      </span>
                      <h3 className="text-base font-extrabold text-ink">{item.title}</h3>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-ink/70">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Automated System Showcase Visual */}
          <Reveal delay={100} className="relative">
            <div className="overflow-hidden rounded-3xl border-2 border-black/10 bg-brand-soft p-4 shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white">
                <Image
                  src="/img/technology/point-management.webp"
                  alt="RedCat Point Management System display terminal"
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-contain p-4"
                />
              </div>
              <div className="mt-4 rounded-xl bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">Automated Point System</p>
                <p className="mt-1 text-sm font-bold text-ink">
                  Every parcel, barcode scan, weight calculation, and commission is tracked in real-time.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- SIMPLE DAILY OPERATION ---------- */}
      <section className="bg-ink py-20 sm:py-28 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Effortless Workflow</span>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Simple Daily Operation
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
              Running a RedCat Point is intuitive and fully assisted by our digital software. No prior courier experience is necessary.
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
                      {step.title}
                    </h3>
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
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">Storefront Criteria</span>
            <h2 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Location & Space Requirements
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/75">
              Ideal as a dedicated standalone parcel point, or as an integrated service counter inside an existing retail business.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Storefront Space</span>
              <p className="mt-2 text-2xl font-extrabold text-ink">150 – 300 Sq.Ft</p>
              <p className="mt-2 text-sm text-ink/70">
                Ground-floor commercial space suitable for a customer reception counter and parcel shelving.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Accessibility</span>
              <p className="mt-2 text-2xl font-extrabold text-ink">Street Frontage</p>
              <p className="mt-2 text-sm text-ink/70">
                Convenient roadside access with easy customer parking or temporary vehicle stopping space.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-black/5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Utilities</span>
              <p className="mt-2 text-2xl font-extrabold text-ink">Power & Internet</p>
              <p className="mt-2 text-sm text-ink/70">
                Continuous electricity supply and stable 4G/Wi-Fi internet connection for the POS software.
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
              Franchise Application
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-5xl">
              Apply for a REDCAT Point Franchise Today
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-lg font-medium text-white/90">
              Submit your preferred location and business details. Our franchise recruitment team will review your area and get in touch within 24 hours.
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
