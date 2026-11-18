"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

type Step = { title: string; body: string; img: string; alt: string; width: number; height: number };

/** Every frame matches its photograph’s proportions, with no inset or letterboxing. */
function StepImage({ step, sizes }: { step: Step; sizes: string }) {
  return <Image src={step.img} alt={step.alt} fill sizes={sizes} className="object-cover" />;
}

const STEPS: Step[] = [
  {
    title: "Book in a minute",
    body: "Tell us where from, where to and how big. Book online or in the app.",
    img: "/img/process/booking.webp",
    width: 1199, height: 1312,
    alt: "A customer booking a Colombo to Kandy delivery in the RedCat app",
  },
  {
    title: "We pick it up",
    body: "A RedCat rider collects it, or you drop it at one of 930+ express points.",
    img: "/img/process/pickup.webp",
    width: 1400, height: 788,
    alt: "A RedCat rider collecting parcels along a local road",
  },
  {
    title: "Overnight through the network",
    body: "Your parcel travels through our extensive delivery network overnight, ready for delivery the next day.",
    img: "/img/process/transit.webp",
    width: 1400, height: 788,
    alt: "A RedCat truck transporting parcels through the network",
  },
  {
    title: "At the door, next day",
    body: "A friendly RedCat rider hands it over. That's the promise.",
    img: "/img/process/delivery.webp",
    width: 1400, height: 933,
    alt: "A RedCat rider handing a parcel to a customer",
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

            <div className="flex h-[72vh] items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                  className="relative overflow-hidden rounded-3xl"
                  style={{
                    aspectRatio: `${STEPS[active].width} / ${STEPS[active].height}`,
                    width: `min(100%, ${72 * STEPS[active].width / STEPS[active].height}vh)`,
                  }}
                >
                  <StepImage step={STEPS[active]} sizes="640px" />
                  <div className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-sm font-bold">
                    Step {active + 1} of {STEPS.length}
                  </div>
                </motion.div>
              </AnimatePresence>
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
              <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: `${s.width} / ${s.height}` }}>
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
