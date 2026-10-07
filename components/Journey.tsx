"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

type Step = { title: string; body: string; img: string; alt: string; cutout?: boolean };

/** Photos fill the frame; the fleet cut-out sits on brand red like in the deck. */
function StepImage({ step, sizes }: { step: Step; sizes: string }) {
  if (step.cutout) {
    return (
      <div className="absolute inset-0 bg-brand">
        <div aria-hidden className="absolute inset-x-[-10%] bottom-[-40%] h-[70%] rounded-[50%] bg-ink" />
        <Image src={step.img} alt={step.alt} fill sizes={sizes} className="object-contain object-bottom p-6 pb-3" />
      </div>
    );
  }
  return <Image src={step.img} alt={step.alt} fill sizes={sizes} className="object-cover" />;
}

const STEPS: Step[] = [
  {
    title: "Book in a minute",
    body: "Tell us where from, where to and how big. Book online or in the app.",
    img: "/img/app.jpg",
    alt: "A customer booking a Colombo to Kandy delivery in the RedCat app",
  },
  {
    title: "We pick it up",
    body: "A RedCat rider collects it, or you drop it at one of 930+ express points.",
    img: "/img/fleet.png",
    alt: "RedCat trucks, vans and scooter riders lined up",
    cutout: true,
  },
  {
    title: "Overnight through the network",
    body: "Regional hub, zone, Peliyagoda Mix Center and back out. We watch every parcel move.",
    img: "/img/dashboard.jpg",
    alt: "A RedCat operator watching the network dashboard",
  },
  {
    title: "At the door, next day",
    body: "A friendly RedCat rider hands it over. That's the promise.",
    img: "/img/rider.jpg",
    alt: "A smiling RedCat rider holding a parcel",
  },
];

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dotY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length * 0.999)));
  });

  return (
    <section aria-labelledby="journey-heading" className="relative bg-white">
      {/* desktop: pinned, scroll-driven */}
      <div ref={ref} className="hidden lg:block" style={{ height: `${STEPS.length * 70}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_1.1fr] items-center gap-16 px-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">How it works</p>
              <h2 id="journey-heading" className="mt-3 text-6xl font-extrabold leading-[0.95] tracking-[-0.035em]">
                Today to tomorrow, in four steps.
              </h2>
              <div className="relative mt-12 pl-10">
                <div className="absolute bottom-3 left-[11px] top-3 w-[3px] rounded-full bg-black/10">
                  <motion.div className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-brand" style={{ scaleY: fill }} />
                  <motion.div className="absolute -left-[7.5px] -mt-[9px] h-[18px] w-[18px] rounded-full border-[3px] border-white bg-ink shadow-md" style={{ top: dotY }} />
                </div>
                <ol className="space-y-7">
                  {STEPS.map((s, i) => (
                    <li key={s.title}>
                      <motion.div animate={{ opacity: i === active ? 1 : 0.32, x: i === active ? 0 : -4 }} transition={{ duration: 0.3 }}>
                        <p className="text-sm font-extrabold tabular-nums text-brand-deep">0{i + 1}</p>
                        <h3 className="text-2xl font-extrabold tracking-tight">{s.title}</h3>
                        <p className="mt-1 max-w-md text-lg text-ink/70">{s.body}</p>
                      </motion.div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2.5rem] bg-mist shadow-2xl shadow-black/15">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <StepImage step={STEPS[active]} sizes="640px" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur">
                Step {active + 1} of {STEPS.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile: simple stacked list */}
      <div className="px-5 py-16 lg:hidden">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">How it works</p>
        <h2 className="mt-3 text-4xl font-extrabold leading-[0.98] tracking-[-0.03em]">Today to tomorrow, in four steps.</h2>
        <ol className="mt-10 space-y-10">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
                <StepImage step={s} sizes="100vw" />
              </div>
              <p className="mt-4 text-sm font-extrabold text-brand-deep">0{i + 1}</p>
              <h3 className="text-2xl font-extrabold tracking-tight">{s.title}</h3>
              <p className="mt-1 text-lg text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
