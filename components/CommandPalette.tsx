"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, MapPin, Package, Search } from "lucide-react";
import { searchHubs } from "@/lib/geo";
import { zoneById } from "@/data/hubs";
import { NAV } from "@/lib/site";

export const openPalette = () => window.dispatchEvent(new Event("rc:palette"));

type Item = { key: string; label: string; hint: string; icon: "page" | "hub" | "track"; href: string };

const looksLikeTracking = (q: string) => /^[a-z]{0,3}\d[\w-]{5,}$/i.test(q.trim());

/** ⌘K / Ctrl+K search across hubs, pages and tracking numbers. */
export default function CommandPalette() {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const open = () => {
      setQ("");
      setActive(0);
      ref.current?.showModal();
      inputRef.current?.focus();
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (ref.current?.open) ref.current.close();
        else open();
      }
    };
    window.addEventListener("rc:palette", open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("rc:palette", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const items = useMemo<Item[]>(() => {
    const query = q.trim();
    const out: Item[] = [];
    if (query && looksLikeTracking(query)) {
      out.push({ key: "track", label: `Track ${query.toUpperCase()}`, hint: "Tracking", icon: "track", href: `/track?id=${encodeURIComponent(query)}` });
    }
    for (const h of searchHubs(query, 6)) {
      out.push({ key: h.id, label: h.name, hint: `${h.district} · ${zoneById(h.zone).name}`, icon: "hub", href: `/network?hub=${h.id}` });
    }
    const pages = [{ href: "/", label: "Home" }, ...NAV].filter((p) => !query || p.label.toLowerCase().includes(query.toLowerCase()));
    for (const p of pages) out.push({ key: p.href, label: p.label, hint: "Page", icon: "page", href: p.href });
    return out;
  }, [q]);

  const go = (item?: Item) => {
    if (!item) return;
    ref.current?.close();
    router.push(item.href);
  };

  return (
    <dialog
      ref={ref}
      aria-label="Search RedCat"
      className="rc-dialog m-auto mt-[12vh] w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-white p-0 text-ink shadow-2xl shadow-black/40 backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="flex items-center gap-3 border-b border-black/5 px-5">
        <Search size={20} className="shrink-0 text-ink/50" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(items.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(items[active]);
            }
          }}
          role="combobox"
          aria-label="Search hubs, pages or tracking numbers"
          aria-expanded="true"
          aria-controls="rc-palette-list"
          aria-activedescendant={items[active] ? `rc-pal-${items[active].key}` : undefined}
          placeholder="Search a town, hub, page or tracking number"
          className="h-16 w-full bg-transparent text-lg font-medium outline-none placeholder:text-ink/40"
        />
        <kbd className="hidden rounded-md border border-black/10 px-2 py-1 text-xs font-semibold text-ink/50 sm:block">esc</kbd>
      </div>
      <ul id="rc-palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {items.map((it, i) => {
          const Icon = it.icon === "hub" ? MapPin : it.icon === "track" ? Package : CornerDownLeft;
          return (
            <li
              key={it.key}
              id={`rc-pal-${it.key}`}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(it)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors ${i === active ? "bg-ink text-white" : ""}`}
            >
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${i === active ? "bg-white/15" : "bg-mist"}`}>
                <Icon size={17} />
              </span>
              <span className="flex-1 font-semibold">{it.label}</span>
              <span className={`text-sm ${i === active ? "text-white/70" : "text-ink/50"}`}>{it.hint}</span>
            </li>
          );
        })}
        {items.length === 0 && <li className="px-3 py-10 text-center text-ink/60">Nothing found for &ldquo;{q}&rdquo;.</li>}
      </ul>
    </dialog>
  );
}
