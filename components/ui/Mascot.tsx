"use client";

import { useEffect, useRef } from "react";
import { MASCOT_HEAD_SVG } from "@/lib/mascotSvg";

/**
 * The RedCat cat peeking over an edge. Its eyes follow the pointer, it blinks now and then,
 * and it looks down at whatever form field has focus inside `watch`.
 */
export default function Mascot({
  className = "",
  watch,
}: {
  className?: string;
  watch?: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const pupils = Array.from(root.querySelectorAll<SVGGElement>("[data-pupil]"));
    const eyes = Array.from(root.querySelectorAll<SVGGElement>("[data-eye]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    eyes.forEach((e) => {
      e.style.transformBox = "fill-box";
      e.style.transformOrigin = "center";
      e.style.transition = "transform 90ms ease-in";
    });
    pupils.forEach((p) => (p.style.transition = "transform 120ms ease-out"));

    // pupils can travel ~9 units inside the eye (SVG user space)
    const MAX = 9;
    let target: { x: number; y: number } | null = null;
    let raf = 0;

    const lookAt = (x: number, y: number) => {
      target = { x, y };
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = 0;
      if (!target) return;
      const box = root.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height * 0.62;
      const dx = target.x - cx;
      const dy = target.y - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      const tx = (dx / d) * MAX * k;
      const ty = (dy / d) * MAX * k;
      pupils.forEach((p) => (p.style.transform = `translate(${tx}px, ${ty}px)`));
    };

    const onMove = (e: PointerEvent) => lookAt(e.clientX, e.clientY);
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (!watch?.current?.contains(t)) return;
      if (!/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return;
      const r = t.getBoundingClientRect();
      lookAt(r.left + Math.min(r.width, 160), r.top + r.height / 2);
    };

    let blinkTimer: ReturnType<typeof setTimeout>;
    const blink = () => {
      eyes.forEach((e) => (e.style.transform = "scaleY(0.1)"));
      setTimeout(() => eyes.forEach((e) => (e.style.transform = "")), 130);
      blinkTimer = setTimeout(blink, 2800 + Math.random() * 3500);
    };

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("focusin", onFocus);
      blinkTimer = setTimeout(blink, 1800);
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocus);
      clearTimeout(blinkTimer);
      cancelAnimationFrame(raf);
    };
  }, [watch]);

  return <div ref={ref} aria-hidden className={className} dangerouslySetInnerHTML={{ __html: MASCOT_HEAD_SVG }} />;
}
