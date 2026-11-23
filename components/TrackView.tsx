"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Link2, Package, Share2 } from "lucide-react";
import { mockShipment, STAGES, type MockShipment } from "@/lib/mockTracking";
import { trackShipmentSearch } from "@/lib/analytics";
import { toast } from "./ui/Toaster";
import RouteMap from "./map/RouteMap";

export default function TrackView() {
  const params = useSearchParams();
  const router = useRouter();
  const uid = useId();
  const raw = params.get("id") ?? "";
  const ids = useMemo(() => [...new Set(raw.split(/[\s,;]+/).map((s) => s.trim().toUpperCase()).filter(Boolean))].slice(0, 5), [raw]);
  const shipments = useMemo(() => ids.map(mockShipment), [ids]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = shipments.find((s) => s.id === activeId) ?? shipments[0] ?? null;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = String(new FormData(e.currentTarget).get("id") ?? "").trim();
    setActiveId(null);
    if (next) trackShipmentSearch(next);
    router.push(next ? `/track?id=${encodeURIComponent(next)}` : "/track");
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-14">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Tracking</p>
        <h1 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-6xl">Where&rsquo;s my parcel?</h1>

        <form onSubmit={onSubmit} className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[1.5rem] bg-white p-2 shadow-xl shadow-black/5 ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-ink sm:flex-row">
          <label htmlFor={`${uid}-id`} className="sr-only">Tracking numbers</label>
          <div className="relative flex-1">
            <Package size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              id={`${uid}-id`}
              name="id"
              defaultValue={ids.join(", ")}
              key={raw}
              autoComplete="off"
              spellCheck={false}
              placeholder="Tracking number(s), separated by commas"
              className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-lg font-semibold uppercase tracking-wide outline-none placeholder:font-medium placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/40"
            />
          </div>
          <button className="press group flex items-center justify-center gap-2 rounded-2xl bg-ink px-8 py-4 font-bold text-white transition-colors hover:bg-brand-deep">
            Track <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="mt-4 inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-medium">
          <strong className="mr-1">Preview:</strong> results are sample data until live tracking is connected.
        </p>

        {shipments.length > 1 && (
          <div role="tablist" aria-label="Your parcels" className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5">
            {shipments.map((s) => {
              const on = s.id === active?.id;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveId(s.id)}
                  className={`press relative shrink-0 rounded-2xl px-4 py-3 text-left transition-colors ${on ? "text-white" : "bg-white hover:bg-white/70"}`}
                >
                  {on && <motion.span layoutId="track-tab" className="absolute inset-0 rounded-2xl bg-ink" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                  <span className="relative block text-xs font-bold tracking-wider opacity-70">{s.id}</span>
                  <span className="relative block font-bold">{s.statusLabel}</span>
                </button>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {active && (
            <motion.div key={active.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <Result s={active} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Result({ s }: { s: MockShipment }) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const pct = (s.stage / (STAGES.length - 1)) * 100;

  async function copy() {
    const url = `${window.location.origin}/track?id=${encodeURIComponent(s.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Tracking link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast(url);
    }
  }
  async function share() {
    const url = `${window.location.origin}/track?id=${encodeURIComponent(s.id)}`;
    if (navigator.share) await navigator.share({ title: `RedCat parcel ${s.id}`, url }).catch(() => {});
    else copy();
  }

  return (
    <section aria-live="polite" className="mt-8">
      <div className="overflow-hidden rounded-[2rem] bg-ink text-white">
        <div className="flex flex-wrap items-start justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-white/55">{s.id}</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">{s.statusLabel}</p>
            <p className="mt-2 text-lg text-white/75">
              {s.from.name} <ArrowRight size={18} strokeWidth={2.5} className="inline -mt-0.5 text-brand" aria-hidden /><span className="sr-only">to</span> {s.to.name}
              <span className="text-white/45"> · {s.from.district} to {s.to.district}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={copy} className="press flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20">
              {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? "Copied" : "Copy link"}
            </button>
            <button onClick={share} className="press flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-white">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* progress rail */}
        <div className="px-6 pb-8 sm:px-8">
          <div className="relative h-2 rounded-full bg-white/15">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-brand"
              initial={{ width: reduce ? `${pct}%` : 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            />
            <motion.div
              className="absolute top-1/2 -ml-3.5 -mt-3.5 grid h-7 w-7 place-items-center rounded-lg border-[3px] border-ink bg-brand"
              initial={{ left: reduce ? `${pct}%` : 0 }}
              animate={{ left: `${pct}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              aria-hidden
            >
              <Package size={13} className="text-ink" />
            </motion.div>
          </div>
          <ol className="mt-4 hidden grid-cols-6 text-xs font-semibold sm:grid">
            {STAGES.map((st, i) => (
              <li key={st} className={`${i <= s.stage ? "text-white" : "text-white/40"} ${i === 0 ? "" : i === STAGES.length - 1 ? "text-right" : "text-center"}`}>
                {st}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <ol className="rounded-[2rem] bg-white p-6 sm:p-8">
          {s.events.map((e, i) => (
            <motion.li
              key={e.title}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {i < s.events.length - 1 && (
                <span aria-hidden className={`absolute left-[11px] top-7 h-[calc(100%-1.25rem)] w-0.5 ${e.done && s.events[i + 1].done ? "bg-brand" : "bg-black/10"}`} />
              )}
              <span
                aria-hidden
                className={`relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                  e.done ? (i === s.stage ? "bg-brand ring-4 ring-brand/25" : "bg-ink") : "border-2 border-black/15 bg-white"
                }`}
              >
                {e.done && i !== s.stage && <Check size={13} className="text-white" strokeWidth={3} />}
              </span>
              <div className={e.done ? "" : "opacity-50"}>
                <p className="font-extrabold">
                  {e.title}
                  <span className="sr-only">{e.done ? " (done)" : " (upcoming)"}</span>
                </p>
                <p className="text-ink/70">{e.where}</p>
                <p className="text-sm text-ink/50">{e.when}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <RouteMap route={s.route} position={s.position} className="min-h-[420px]" />
      </div>
    </section>
  );
}
