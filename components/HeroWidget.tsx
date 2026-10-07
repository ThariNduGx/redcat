"use client";

import { useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpDown, Clock, LocateFixed, Package, Search, X } from "lucide-react";
import HubPicker from "./HubPicker";
import Mascot from "./ui/Mascot";
import { toast } from "./ui/Toaster";
import { zoneById, type Hub } from "@/data/hubs";
import { nearestHubs } from "@/lib/geo";
import { nextDayLabel, typicalRoute } from "@/lib/route";

const TABS = [
  { id: "track", label: "Track" },
  { id: "send", label: "Send" },
  { id: "find", label: "Find a hub" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const SIZES = ["Documents", "Small", "Medium", "Large"] as const;
const RECENT_KEY = "rc:recent-tracking";

function readRaw(): string {
  try {
    return localStorage.getItem(RECENT_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}
function parse(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.slice(0, 3) : [];
  } catch {
    return [];
  }
}
function writeRecent(ids: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, 3)));
  } catch {}
  window.dispatchEvent(new Event("rc:recent"));
}
function subscribe(cb: () => void) {
  window.addEventListener("rc:recent", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("rc:recent", cb);
    window.removeEventListener("storage", cb);
  };
}
/** Recently tracked numbers, kept in this browser only. */
function useRecent() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => parse(raw), [raw]);
}

export default function HeroWidget() {
  const [tab, setTab] = useState<Tab>("track");
  const uid = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <Mascot watch={cardRef} className="absolute bottom-[calc(100%-4px)] left-1/2 z-0 w-44 -translate-x-1/2 sm:w-52 [&_svg]:h-auto [&_svg]:w-full" />
      <div
        ref={cardRef}
        className="relative z-10 rounded-[1.75rem] border-[3px] border-ink bg-white p-3 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] sm:p-4"
      >
        <div
          role="tablist"
          aria-label="What would you like to do?"
          className="relative grid grid-cols-3 gap-1 rounded-2xl bg-mist p-1"
          onKeyDown={(e) => {
            const i = TABS.findIndex((x) => x.id === tab);
            const next = e.key === "ArrowRight" ? (i + 1) % 3 : e.key === "ArrowLeft" ? (i + 2) % 3 : -1;
            if (next >= 0) {
              setTab(TABS[next].id);
              document.getElementById(`${uid}-tab-${TABS[next].id}`)?.focus();
            }
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`${uid}-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`${uid}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
              className={`relative rounded-xl px-2 py-3 text-[15px] font-bold transition-colors ${tab === t.id ? "text-white" : "text-ink/70 hover:text-ink"}`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId={`${uid}-pill`}
                  className="absolute inset-0 rounded-xl bg-ink shadow-md"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="px-2 pb-2 pt-5 sm:px-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "track" && <TrackPanel />}
              {tab === "send" && <SendPanel />}
              {tab === "find" && <FindPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Track ---------------- */

function TrackPanel() {
  const router = useRouter();
  const uid = useId();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);
  const recent = useRecent();

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const ids = value.split(/[\s,;]+/).map((s) => s.trim().toUpperCase()).filter(Boolean).slice(0, 5);
    if (!ids.length) {
      setError("Enter a tracking number to continue.");
      setShake((n) => n + 1);
      return;
    }
    writeRecent([...new Set([...ids, ...recent])]);
    router.push(`/track?id=${encodeURIComponent(ids.join(","))}`);
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={`${uid}-id`} className="mb-1.5 block text-[13px] font-semibold text-ink/70">
        Tracking number
      </label>
      <motion.div key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : undefined} transition={{ duration: 0.35 }} className="relative">
        <Package size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          id={`${uid}-id`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          aria-invalid={!!error}
          aria-describedby={`${uid}-hint`}
          placeholder="e.g. RC1234567890"
          autoComplete="off"
          spellCheck={false}
          className={`w-full rounded-2xl border-2 bg-white py-4 pl-10 pr-4 text-lg font-semibold uppercase tracking-wide outline-none transition placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/40 focus:border-ink ${
            error ? "border-brand-deep" : "border-black/10 hover:border-black/20"
          }`}
        />
      </motion.div>
      <p id={`${uid}-hint`} className={`mt-2 text-[13px] ${error ? "font-semibold text-brand-deep" : "text-ink/55"}`}>
        {error || "Got several? Separate them with commas. Up to 5 at once."}
      </p>

      <button className="press group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-4 text-base font-bold text-white transition-colors hover:bg-brand-deep">
        Track parcel
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </button>

      {recent.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-ink/50">
            <Clock size={13} /> Recent
          </span>
          {recent.map((r) => (
            <span key={r} className="group inline-flex items-center rounded-full bg-mist text-xs font-bold">
              <Link href={`/track?id=${encodeURIComponent(r)}`} className="py-1.5 pl-3 pr-1 hover:underline">
                {r}
              </Link>
              <button
                type="button"
                aria-label={`Forget ${r}`}
                onClick={() => writeRecent(recent.filter((x) => x !== r))}
                className="mr-1 grid h-5 w-5 place-items-center rounded-full text-ink/40 hover:bg-black/10 hover:text-ink"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </form>
  );
}

/* ---------------- Send: route + next-day ETA ---------------- */

function SendPanel() {
  const [from, setFrom] = useState<Hub | null>(null);
  const [to, setTo] = useState<Hub | null>(null);
  const [size, setSize] = useState<(typeof SIZES)[number]>("Small");
  const [spin, setSpin] = useState(0);
  const route = from && to ? typicalRoute(from, to) : null;

  const pickupHref =
    from && to ? `/contact?${new URLSearchParams({ topic: "pickup", from: from.name, to: to.name, size })}` : "/contact?topic=pickup";

  return (
    <div>
      <div className="relative space-y-3">
        <HubPicker label="From" value={from} onChange={setFrom} placeholder="Where is it now?" />
        <HubPicker label="To" value={to} onChange={setTo} placeholder="Where is it going?" />
        <motion.button
          type="button"
          aria-label="Swap from and to"
          onClick={() => {
            setFrom(to);
            setTo(from);
            setSpin((s) => s + 180);
          }}
          animate={{ rotate: spin }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute right-3 top-[52%] z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-ink text-white shadow-md"
        >
          <ArrowUpDown size={16} />
        </motion.button>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-1.5 text-[13px] font-semibold text-ink/70">Package</legend>
        <div className="grid grid-cols-4 gap-1 rounded-2xl bg-mist p-1">
          {SIZES.map((s) => (
            <label key={s} className={`press cursor-pointer rounded-xl py-2.5 text-center text-[13px] font-bold transition ${size === s ? "bg-white shadow-sm" : "text-ink/60 hover:text-ink"}`}>
              <input type="radio" name="size" value={s} checked={size === s} onChange={() => setSize(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>

      <AnimatePresence initial={false}>
        {route && from && to && (
          <motion.div
            key="result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
            aria-live="polite"
          >
            <div className="mt-4 rounded-2xl bg-ink p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Book today, delivered</p>
              <p className="mt-0.5 text-2xl font-extrabold">
                Tomorrow, <span className="text-brand">{nextDayLabel()}</span>
              </p>
              <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] font-semibold text-white/85">
                {route.map((leg, i) => (
                  <li key={leg.label} className="flex items-center gap-1.5">
                    {i > 0 && <ArrowRight size={13} strokeWidth={3} className="text-brand" aria-hidden />}
                    {leg.label}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href={pickupHref}
        aria-disabled={!route}
        className={`press group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition-colors ${
          route ? "bg-brand text-ink hover:bg-ink hover:text-white" : "bg-ink text-white hover:bg-brand-deep"
        }`}
      >
        Request a pickup
        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

/* ---------------- Find a hub ---------------- */

function FindPanel() {
  const [hub, setHub] = useState<Hub | null>(null);
  const [nearby, setNearby] = useState<{ hub: Hub; km: number }[] | null>(null);
  const [locating, setLocating] = useState(false);

  function locate() {
    if (!("geolocation" in navigator)) return toast("Your browser can't share your location.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        setHub(null);
        setNearby(nearestHubs({ lat: p.coords.latitude, lng: p.coords.longitude }, 3));
      },
      (err) => {
        setLocating(false);
        toast(err.code === err.PERMISSION_DENIED ? "Location permission was declined." : "We couldn't find your location.");
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  const list = hub ? [{ hub, km: null as number | null }] : nearby ?? [];

  return (
    <div>
      <HubPicker
        label="Your town"
        value={hub}
        onChange={(h) => {
          setHub(h);
          if (h) setNearby(null);
        }}
        placeholder="Start typing, e.g. Galle"
      />
      <button
        type="button"
        onClick={locate}
        disabled={locating}
        className="press mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black/10 px-4 py-3.5 text-[15px] font-bold transition hover:border-ink disabled:opacity-60"
      >
        <LocateFixed size={18} className={locating ? "animate-spin" : ""} />
        {locating ? "Finding you…" : "Use my location"}
      </button>

      <AnimatePresence initial={false}>
        {list.length > 0 && (
          <motion.ul
            key={hub?.id ?? "near"}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
            aria-live="polite"
          >
            {list.map(({ hub: h, km }, i) => (
              <li key={h.id}>
                <Link
                  href={`/network?hub=${h.id}`}
                  className="group flex items-center gap-3 rounded-2xl border-2 border-black/5 p-3 transition hover:border-ink"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ background: zoneById(h.zone).color }}>
                    {h.zone}
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold">
                      {h.name}
                      {km !== null && i === 0 && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-extrabold uppercase text-ink">Nearest</span>}
                    </span>
                    <span className="text-sm text-ink/60">
                      {km !== null ? `${km < 10 ? km.toFixed(1) : Math.round(km)} km away · ` : ""}
                      {h.district} District
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-ink/50 transition group-hover:translate-x-0.5 group-hover:text-ink">Map <ArrowRight size={14} /></span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {!list.length && (
        <Link href="/network" className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-ink/60 hover:text-ink">
          <Search size={15} /> Or browse all 57 hubs on the map
        </Link>
      )}
    </div>
  );
}
