import Image from "next/image";
import HeroHeadline from "@/components/HeroHeadline";
import HeroWidget from "@/components/HeroWidget";
import Journey from "@/components/Journey";
import Reveal from "@/components/Reveal";
import NetworkExplorer from "@/components/map/NetworkExplorer";
import ArrowLink from "@/components/ui/ArrowLink";
import CountUp from "@/components/ui/CountUp";
import Magnetic from "@/components/ui/Magnetic";
import Marquee from "@/components/ui/Marquee";
import Parallax from "@/components/ui/Parallax";
import { HUBS } from "@/data/hubs";

const stats = [
  { to: 57, suffix: "", label: "Regional hubs", note: "in every district" },
  { to: 930, suffix: "+", label: "Express points", note: "to send and collect" },
  { to: 25, suffix: "", label: "Districts covered", note: "all of Sri Lanka" },
  { to: 4, suffix: "", label: "Zones", note: "one Mix Center" },
];

const tech = [
  { img: "/img/app.jpg", tag: "App", title: "Book in a few taps", body: "Route, package and next-day delivery, from your phone.", alt: "A customer booking a delivery in the RedCat app" },
  { img: "/img/dashboard.jpg", tag: "Ops", title: "The island on one screen", body: "Every hub, vehicle and parcel, watched from a single dashboard.", alt: "A RedCat operator looking at the network dashboard" },
  { img: "/img/rider.jpg", tag: "People", title: "A friendly face at the door", body: "Uniformed RedCat riders hand your parcel over, on time.", alt: "A smiling RedCat rider holding a parcel" },
];

const towns = [...new Set(HUBS.map((h) => h.name.replace(/ (Central|North|South)$/, "")))];

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-28 pt-10 text-white sm:pb-36 sm:pt-14 lg:pb-44">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="rc-blob rc-drift-a left-[-10%] top-[-20%] h-[60%] w-[55%] bg-[#ff7a6b] opacity-70" />
          <div className="rc-blob rc-drift-b bottom-[-25%] right-[-10%] h-[70%] w-[60%] bg-[#e23a3a] opacity-80" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-ink py-1.5 pl-2 pr-4 text-[13px] font-bold tracking-[0.12em] text-white">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
              NEXT DAY, ISLAND-WIDE
            </p>
            <div className="mt-6">
              <HeroHeadline />
            </div>
            <p className="mt-7 max-w-xl text-xl font-bold leading-snug sm:text-[22px]">
              RedCat moves parcels from Jaffna to Galle overnight, through 57 regional hubs and 930+ express points.
            </p>
            <div className="mt-9 hidden flex-wrap gap-3 sm:flex">
              <ArrowLink href="/network" variant="light">Explore the network</ArrowLink>
              <ArrowLink href="/dealers" variant="outline" className="text-white">Become a dealer</ArrowLink>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[460px] pt-20 lg:pt-16">
            <HeroWidget />
          </div>
        </div>

        <div aria-hidden className="absolute inset-x-0 -bottom-px h-16 bg-ink sm:h-24" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
      </section>

      {/* ---------- TOWNS TICKER ---------- */}
      <section aria-label="Towns we deliver to" className="bg-ink py-5 text-white">
        <Marquee speed={90}>
          {towns.map((t) => (
            <span key={t} className="flex items-center whitespace-nowrap text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="px-6">{t}</span>
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
          ))}
        </Marquee>
      </section>

      {/* ---------- NUMBERS ---------- */}
      <section aria-label="RedCat in numbers" className="mx-auto max-w-7xl px-5 py-20 sm:py-28">
        <Reveal>
          <p className="max-w-3xl text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Sri Lanka is becoming a delivery economy. <span className="text-ink/35">We built the network for it.</span>
          </p>
        </Reveal>
        <dl className="mt-14 grid grid-cols-2 border-t border-black/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className={`flex flex-col border-b border-black/10 py-8 pr-4 lg:border-b-0 ${i % 2 ? "pl-5 lg:pl-8" : "lg:pl-8 lg:first:pl-0"} ${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "border-l" : ""}`}>
              <dt className="order-2 mt-2 text-base font-bold sm:text-lg">
                {s.label}
                <span className="block text-sm font-medium text-ink/55">{s.note}</span>
              </dt>
              <dd className="text-[clamp(3.5rem,8vw,6.5rem)] font-extrabold leading-none tracking-[-0.05em] text-brand">
                <CountUp to={s.to} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <Journey />

      {/* ---------- MAP ---------- */}
      <section className="bg-paper py-20 sm:py-28" aria-labelledby="map-heading">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">The network</p>
              <h2 id="map-heading" className="mt-3 max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] sm:text-6xl">
                One island. Four zones. 57 hubs.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-ink/70">
                Search your town, tap any hub, or let us find the closest one to you.
              </p>
            </Reveal>
            <ArrowLink href="/network" variant="dark">Full network view</ArrowLink>
          </div>
          <div className="mt-10">
            <NetworkExplorer className="rounded-[1.75rem]" />
          </div>
        </div>
      </section>

      {/* ---------- FLEET ---------- */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.25fr_1fr]">
        <div className="rc-grain relative aspect-[4/3] overflow-clip rounded-[2.5rem] bg-brand sm:rounded-[3.5rem]">
          <div aria-hidden className="absolute inset-x-[-10%] bottom-[-38%] h-[70%] rounded-[50%] bg-ink" />
          <Parallax amount={5} className="absolute inset-x-[4%] bottom-[2%] top-[10%]">
            <Image src="/img/fleet.png" alt="RedCat trucks, vans and scooter riders lined up" fill sizes="(min-width: 1024px) 680px, 100vw" className="object-contain object-bottom drop-shadow-[0_30px_30px_rgba(0,0,0,0.35)]" />
          </Parallax>
        </div>
        <Reveal delay={100}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">The fleet</p>
          <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Trucks, vans and riders. All in red.</h2>
          <p className="mt-5 text-lg text-ink/70">
            Trucks run the long hauls between zones overnight. Vans and scooters take the last mile. Our goal is simple: the largest delivery network in Sri Lanka.
          </p>
          <ArrowLink href="/about" className="mt-8">About RedCat</ArrowLink>
        </Reveal>
      </section>

      {/* ---------- TECH ---------- */}
      <section className="bg-mist py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Technology</p>
            <h2 className="mt-3 max-w-2xl text-5xl font-extrabold leading-[0.95] tracking-[-0.035em]">Built to keep up with you.</h2>
          </Reveal>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {tech.map((t, i) => (
              <li key={t.title}>
                <Reveal delay={i * 100} className="group h-full overflow-hidden rounded-[2rem] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={t.img} alt={t.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur">{t.tag}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-extrabold tracking-tight">{t.title}</h3>
                    <p className="mt-2 text-ink/70">{t.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- DEALER CTA ---------- */}
      <section className="relative overflow-clip bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">For business owners</p>
          <h2 className="mt-4 max-w-4xl text-[clamp(2.75rem,7vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
            Run a RedCat hub <span className="text-brand">in your town.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Drive traffic to your business, win repeat customers and be part of the revolution.
          </p>
          <div className="mt-10">
            <Magnetic>
              <ArrowLink href="/dealers" variant="brand" className="px-9 py-5 text-lg">Become a dealer</ArrowLink>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
