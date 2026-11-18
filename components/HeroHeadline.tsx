"use client";

import { motion, useReducedMotion } from "motion/react";

const LINES = [["Next-Day", "Delivery,"], ["Anywhere"]];

export default function HeroHeadline() {
  const reduce = useReducedMotion();
  let n = 0;
  return (
    <h1 className="text-[clamp(2rem,4.3vw,4rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
      {LINES.map((line, li) => (
        <span key={li} className="block overflow-hidden pb-[0.06em]">
          {line.map((w) => {
            const i = n++;
            return (
              <motion.span
                key={w + i}
                className="mr-[0.22em] inline-block last:mr-0"
                initial={reduce ? false : { y: "105%", rotate: 4 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
