"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import { Logo } from "./Logo";
import { NAV } from "@/lib/site";
import { openPalette } from "./CommandPalette";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${scrolled || open ? "bg-white/85 shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl" : "bg-white"}`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-[padding] duration-300 ${scrolled ? "py-1.5" : "py-3"}`}>
        <Link href="/" aria-label="RedCat home" onClick={() => setOpen(false)} className="press shrink-0">
          <Logo className={`w-auto transition-[height] duration-300 ${scrolled ? "h-10" : "h-12"}`} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative rounded-full px-4 py-2.5 text-[15px] font-semibold text-ink/80 transition-colors hover:text-ink"
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-brand-soft" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="press hidden items-center gap-2.5 rounded-full border border-black/10 py-2 pl-3.5 pr-2 text-sm font-medium text-ink/60 transition hover:border-ink/30 hover:text-ink md:flex"
          >
            <Search size={16} />
            Search hubs
            <kbd className="rounded-md bg-mist px-1.5 py-0.5 text-[11px] font-bold text-ink/60">{mac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <button type="button" onClick={openPalette} aria-label="Search" className="press grid h-11 w-11 place-items-center rounded-full border border-black/10 md:hidden">
            <Search size={18} />
          </button>
          <button
            type="button"
            className="press grid h-11 w-11 place-items-center rounded-full border border-black/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand" style={{ scaleX: progress }} />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 64px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden bg-white xl:hidden"
          >
            <ul className="flex flex-col px-5 pt-4">
              {NAV.map((item, i) => (
                <motion.li key={item.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-black/5 py-4 text-3xl font-extrabold tracking-tight">
                    {item.label}
                    <ArrowRight size={26} strokeWidth={2.5} className="text-brand" aria-hidden />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
