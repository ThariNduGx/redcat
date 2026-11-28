import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Boxes,
  CheckCircle2,
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
  Store,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { HUB_APPLICATION_HREF, POINT_APPLICATION_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "REDCAT Point Franchise Opportunity",
  description:
    "Own a RedCat Point franchise business. Complete turnkey setup with IT system, equipment, branding, exclusive sales territory, and LKR 1.5Mn - 2.0Mn investment.",
};

const metrics = [
  {
    icon: Wallet,
    title: "Capital Outlay",
    value: "1.5 – 2.0 Mn",
    unit: "LKR Total Investment",
    detail: "Complete turnkey package covering IT, hardware, racking, branding, and training.",
  },
  {
    icon: Clock,
    title: "Operating Hours",
    value: "9 AM – 5 PM",
    unit: "Daytime Schedule",
    detail: "Convenient standard retail hours offering steady daily routine and great work-life balance.",
  },
  {
    icon: Banknote,
    title: "Revenue Model",
    value: "100% Cash Flow",
    unit: "Zero Debtor Risk",
    detail: "Instant commission settlement on drop-offs & collections with no delayed credit terms.",
  },
  {
    icon: MapPin,
    title: "Territory Protection",
    value: "Exclusive Area",
    unit: "Protected Radius",
    detail: "Guaranteed territorial allocation with zero internal competition from other RedCat points.",
  },
];

const advantages = [
  {
    icon: TrendingUp,
    num: "01",
    title: "Day-by-Day Growing Business",
    subtitle: "Compounding parcel volume",
    body: "Rapid growth in islandwide e-commerce and retail parcel delivery drives continuous customer footfall and compounding business value every single month.",
  },
  {
    icon: Monitor,
    num: "02",
    title: "100% IT System Operation",
    subtitle: "Automated & error-free",
    body: "Our cloud-based Point Management System automates waybills, tracking updates, and financial reconciliation—eliminating manual paperwork entirely.",
  },
  {
    icon: ShieldCheck,
    num: "03",
    title: "Fraud-Resistant & Secure",
    subtitle: "End-to-end digital audit",
    body: "Strict digital barcode verification, OTP-authenticated package handovers, and tamper-proof logs ensure every parcel and payment is 100% secure.",
  },
  {
    icon: Wallet,
    num: "04",
    title: "100% Cash-Based Business",
    subtitle: "Zero debtor risk",
    body: "Immediate fee collections and automated Cash on Delivery (COD) processing mean no receivables, no delayed credit terms, and reliable daily liquidity.",
  },
  {
    icon: BarChart3,
    num: "05",
    title: "Real-Time Profit Visibility",
    subtitle: "Instant daily ledger",
    body: "Track every rupee of commission live. Your digital merchant dashboard displays package throughput, commission earnings, and net profit in real time.",
  },
  {
    icon: Sparkles,
    num: "06",
    title: "High Profit Potential",
    subtitle: "Multi-stream commissions",
    body: "Earn attractive commission margins on parcel drop-offs, doorstep pickups, and collection handovers with minimal recurring overhead.",
  },
  {
    icon: Clock,
    num: "07",
    title: "Convenient Operating Hours",
    subtitle: "9:00 AM – 5:00 PM",
    body: "Standard daylight retail hours make it easy to run standalone with a single staff member or seamlessly integrate inside your existing shop.",
  },
  {
    icon: MapPin,
    num: "08",
    title: "Dedicated Exclusive Territory",
    subtitle: "Protected market boundary",
    body: "Guaranteed territorial allocation ensures you are the sole authorized RedCat Point in your designated area, with zero internal network competition.",
  },
];

const turnkeyItems = [
  {
    icon: Cpu,
    category: "Software & Cloud",
    title: "IT System & Software",
    desc: "Complete Point Management software license, merchant portal, automated label generation, and real-time islandwide tracking synchronization.",
    highlights: ["Cloud POS Terminal", "Live Tracking Sync", "Automated Waybills"],
  },
  {
    icon: ScanBarcode,
    category: "Hardware Suite",
    title: "Operational Devices",
    desc: "Commercial 2D high-speed barcode scanner, high-output thermal shipping label and receipt printer, and certified digital parcel weighing scale.",
    highlights: ["2D Barcode Scanner", "Thermal Label Printer", "Digital Weighing Scale"],
  },
  {
    icon: Boxes,
    category: "Logistics Containers",
    title: "Plastic Containers",
    desc: "Heavy-duty stackable RedCat red parcel crates and tamper-evident transit containers built to protect customer items throughout transport.",
    highlights: ["Heavy-Duty Crates", "Stackable Modular Fit", "Secure Transit Seals"],
  },
  {
    icon: Layers,
    category: "Store Fixtures",
    title: "Racking Systems",
    desc: "Industrial modular steel parcel storage shelving and organized sorting bays customized to fit your storefront dimensions perfectly.",
    highlights: ["Steel Racking Bays", "Destination Bins", "Space-Optimized Layout"],
  },
  {
    icon: Printer,
    category: "Brand Assets",
    title: "Branding & Signage",
    desc: "Exterior illuminated 3D RedCat storefront sign, interior wall graphics, branded front counter wrap, and official window marketing decals.",
    highlights: ["3D Illuminated Sign", "Branded Counter Wrap", "Official Window Decals"],
  },
  {
    icon: GraduationCap,
    category: "Operational Readiness",
    title: "Training & Ongoing Support",
    desc: "Comprehensive onboarding for owners and staff covering software operations, parcel safety, customer service SOPs, and dedicated helpline.",
    highlights: ["Hands-On SOP Training", "Dedicated Area Helpline", "Launch Marketing Kit"],
  },
];

const dailySteps = [
  {
    step: "01",
    title: "Accept Parcels",
    desc: "Receive packages from walk-in retail senders, local online merchants, and corporate clients at your counter.",
    icon: Store,
  },
  {
    step: "02",
    title: "Scan & Register",
    desc: "Scan the barcode with the 2D scanner. Weight and tariff calculate instantly; print waybill and label in seconds.",
    icon: ScanBarcode,
  },
  {
    step: "03",
    title: "Sort & Store",
    desc: "Place packages into designated destination crates on your organized RedCat modular racking shelving.",
    icon: Boxes,
  },
  {
    step: "04",
    title: "Hand Over",
    desc: "Transfer outgoing crates to the daily RedCat line-haul truck, or release customer arrivals using secure OTP.",
    icon: Truck,
  },
  {
    step: "05",
    title: "See Your Profit",
    desc: "Commissions credit automatically to your digital account ledger with real-time balance updates.",
    icon: TrendingUp,
  },
];

export default function PointFranchisePage() {
  return (
    <>
      {/* ---------- HERO SECTION ---------- */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-20 pt-12 text-white sm:pb-28 sm:pt-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-ink/90 border border-white/20 py-1.5 pl-3.5 pr-4 text-xs font-bold tracking-[0.14em] uppercase text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                Point Franchise Opportunity
              </div>

              <h1 className="mt-5 text-[clamp(2.5rem,5.5vw,4.75rem)] font-extrabold leading-[0.96] tracking-[-0.04em] text-white">
                Own a REDCAT Point
                <span className="block text-brand-soft">Franchise Business</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
                Step into Sri Lanka&apos;s fastest-expanding delivery network. Open a dedicated RedCat Point in your town with full IT automation, zero credit risk, guaranteed territorial exclusivity, and dependable daily cash flow.
              </p>

              {/* Franchise Investment Callout Card */}
              <div className="mt-8 rounded-3xl border-2 border-white/20 bg-white p-5 text-ink shadow-2xl sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-brand animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/70">
                      Turnkey Franchise Investment
                    </span>
                  </div>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-extrabold text-brand uppercase tracking-wider">
                    All-Inclusive Setup
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand">
                    LKR 1.5 Mn – 2.0 Mn
                  </span>
                  <span className="text-sm font-semibold text-ink/60">
                    total capital outlay
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium leading-relaxed text-ink/80">
                  Includes complete IT system & software, commercial barcode scanner, thermal printer, digital scale, racking, crates, 3D illuminated exterior signage, and full staff training.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ArrowLink documentHref={POINT_APPLICATION_HREF} variant="light" className="text-base font-bold shadow-xl">
                  Apply for Franchise
                </ArrowLink>
                <ArrowLink
                  href="#turnkey"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-ink text-base font-semibold"
                >
                  What&apos;s Included
                </ArrowLink>
                <ArrowLink
                  href="#advantages"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white hover:text-ink text-base font-semibold"
                >
                  Franchisee Advantages
                </ArrowLink>
              </div>
            </div>

            {/* Right Storefront Showcase Column */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="group relative overflow-hidden rounded-[2.5rem] border-4 border-white/25 bg-black/10 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)]">
                  <Image
                    src="/img/points/storefront.webp"
                    alt="Modern RedCat Point Express Storefront serving customers and merchants"
                    width={1400}
                    height={790}
                    preload
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="block h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-5 right-5 rounded-full bg-ink/85 border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Express Storefront Format
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-soft">
                      SEND TODAY. RECEIVE TOMORROW.
                    </p>
                    <p className="mt-1 text-lg font-extrabold leading-snug">
                      Engineered for high-volume parcel intake and instant customer service.
                    </p>
                  </div>
                </div>

                {/* Sub-badge strip */}
                <div className="mt-4 flex items-center justify-between px-2 text-xs font-bold tracking-wider uppercase text-white/90">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-white" />
                    Turnkey Equipment
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-white" />
                    Protected Area
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-white" />
                    930+ Points
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------- AT A GLANCE INVESTMENT METRICS ---------- */}
      <section className="relative z-10 -mt-8 sm:-mt-12 mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.title}
              className="group flex flex-col justify-between rounded-3xl border-2 border-black/5 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-2xl hover:shadow-brand/10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <m.icon size={22} strokeWidth={2.4} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">
                    {m.title}
                  </span>
                </div>
                <p className="mt-5 text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  {m.value}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink/60">
                  {m.unit}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">
                  {m.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FRANCHISEE ADVANTAGES ---------- */}
      <section id="advantages" className="scroll-mt-20 bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black/10 pb-8">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
                  Franchise Benefits
                </span>
                <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
                  8 Powerful Franchisee Advantages
                </h2>
              </div>
              <p className="max-w-xl text-lg text-ink/75">
                Designed to provide independent business owners with consistent daily cash flow, zero credit exposure, and full operational automation.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((adv, i) => (
              <Reveal key={adv.title} delay={i * 50}>
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl hover:shadow-brand/5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20 transition-transform duration-300 group-hover:scale-110">
                        <adv.icon size={22} strokeWidth={2.4} />
                      </span>
                      <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-black tracking-wider text-ink/40">
                        {adv.num}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold tracking-tight text-ink group-hover:text-brand transition-colors">
                      {adv.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand">
                      {adv.subtitle}
                    </p>
                    <p className="mt-3.5 text-sm leading-relaxed text-ink/75">
                      {adv.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHAT REDCAT PROVIDES (TURNKEY PACKAGE) ---------- */}
      <section id="turnkey" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Turnkey Franchise Setup
            </span>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              What REDCAT Provides
            </h2>
            <p className="mt-4 text-lg text-ink/75">
              Everything required to open and operate your RedCat Point is supplied, installed, and configured directly by our logistics engineering team.
            </p>
          </div>
        </Reveal>

        {/* 6 Comprehensive Turnkey Deliverable Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {turnkeyItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <div className="flex h-full flex-col justify-between rounded-3xl border-2 border-black/5 bg-white p-7 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                      <item.icon size={22} strokeWidth={2.4} />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 border-t border-black/5 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-mist px-2.5 py-1 text-xs font-bold text-ink/80"
                      >
                        <CheckCircle2 size={13} className="text-brand shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Turnkey Deployment Operational Banner */}
        <Reveal delay={200} className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-12 text-white">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Fast 14-Day Launch
                </span>
                <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  From Lease Signing to Opening Day in 2 Weeks
                </h3>
                <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
                  Our team delivers your illuminated 3D signage, installs industrial shelving, sets up your barcode hardware and POS terminal, and conducts complete staff training on site.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <ArrowLink documentHref={POINT_APPLICATION_HREF} variant="light" className="text-center font-bold">
                  Apply for Your Location
                </ArrowLink>
                <ArrowLink documentHref={HUB_APPLICATION_HREF} variant="outline" className="border-white/30 text-white hover:bg-white hover:text-ink text-center">
                  Explore Hub Options
                </ArrowLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- SIMPLE DAILY OPERATION ---------- */}
      <section className="bg-mist/80 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Effortless Routine
            </span>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Simple Daily Operation
            </h2>
            <p className="mt-4 text-lg text-ink/75">
              Operating a RedCat Point is straightforward and fully assisted by our digital system. No prior courier background is required.
            </p>
          </Reveal>

          {/* 5-Step Process Flow Cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {dailySteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 80}>
                <div className="relative flex h-full flex-col justify-between rounded-3xl border-2 border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-brand tracking-tight">
                        {step.step}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                        <step.icon size={20} strokeWidth={2.4} />
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">
                      {step.desc}
                    </p>
                  </div>

                  {i < dailySteps.length - 1 && (
                    <div className="mt-5 hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand">
                      <span>Next step</span>
                      <ArrowRight size={14} />
                    </div>
                  )}
                  {i === dailySteps.length - 1 && (
                    <div className="mt-5 hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
                      <span>Repeat daily</span>
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- STOREFRONT REQUIREMENTS ---------- */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Site Selection
            </span>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-[-0.035em] sm:text-5xl">
              Storefront & Space Requirements
            </h2>
            <p className="mt-4 text-lg text-ink/75">
              Ideal as a dedicated standalone parcel point, or as an integrated service counter inside an existing retail business.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          <Reveal delay={0}>
            <div className="h-full rounded-3xl border-2 border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:border-brand hover:shadow-lg">
              <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                Floor Space
              </span>
              <p className="mt-4 text-3xl font-extrabold text-ink">150 – 300 Sq.Ft</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Ground-floor retail commercial space with room for a customer reception counter, queue area, and modular parcel storage racking.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full rounded-3xl border-2 border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:border-brand hover:shadow-lg">
              <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                Accessibility
              </span>
              <p className="mt-4 text-3xl font-extrabold text-ink">Street Frontage</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Prominent roadside location with high footfall, convenient pedestrian access, and temporary stopping space for customer drop-offs and collection vans.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="h-full rounded-3xl border-2 border-black/5 bg-white p-8 shadow-sm transition duration-300 hover:border-brand hover:shadow-lg">
              <span className="inline-block rounded-full bg-brand-soft px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                Essential Utilities
              </span>
              <p className="mt-4 text-3xl font-extrabold text-ink">Power & Internet</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Continuous 230V electricity supply and stable 4G or Wi-Fi broadband connection for instant cloud barcode sync and receipt printing.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Existing Store Integration Callout */}
        <Reveal delay={300} className="mt-8">
          <div className="rounded-3xl border-2 border-brand/20 bg-brand-soft/50 p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand">
                  Existing Shop Owners Special Integration
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-ink">
                  Already have an existing store or commercial premises?
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/80">
                  Pharmacies, stationery shops, supermarkets, communication counters, and bookshops can integrate a RedCat Point directly into their premises—monetizing unused floor space and driving hundreds of new foot-traffic customers weekly.
                </p>
              </div>
              <ArrowLink documentHref={POINT_APPLICATION_HREF} className="shrink-0 font-bold">
                Apply for Your Shop
              </ArrowLink>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- APPLICATION FORM SECTION ---------- */}
      <section
        id="apply"
        className="rc-grain relative scroll-mt-16 overflow-clip bg-brand pb-24 pt-16 text-white sm:pb-32 sm:pt-20"
      >
        <div className="mx-auto max-w-3xl px-5">
          <div className="text-center">
            <span className="inline-block rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-md">
              Franchise Application
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-5xl lg:text-6xl text-white">
              Apply for a REDCAT Point Franchise Today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg font-medium text-white/90">
              Share your preferred location and business details in the initial application.
            </p>
          </div>

          <div className="mt-8 text-center">
            <a href={POINT_APPLICATION_HREF} className="press inline-flex min-h-12 items-center rounded-full bg-white px-6 py-3 font-bold text-ink">
              Open the RedCat Point application
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-center text-xs font-bold uppercase tracking-wider text-white/80">
            <span>✓ 930+ Planned Express Points</span>
            <span>✓ 100% Cash Model · Zero Debtors</span>
            <span>✓ Full Turnkey Package</span>
            <span>✓ Protected Exclusive Territory</span>
          </div>
        </div>
      </section>
    </>
  );
}
