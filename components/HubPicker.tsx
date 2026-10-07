"use client";

import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin } from "lucide-react";
import { hubById, zoneById, type Hub } from "@/data/hubs";
import { searchHubs } from "@/lib/geo";

const SUGGESTED = ["A-RH01", "C-RH01", "D-RH01", "B-RH06", "B-RH12", "C-RH10"];

/** Accessible combobox for choosing a regional hub by town or district name. */
export default function HubPicker({
  label,
  value,
  onChange,
  placeholder = "Town or district",
  autoFocus,
}: {
  label: string;
  value: Hub | null;
  onChange: (h: Hub | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const uid = useId();
  const [text, setText] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [synced, setSynced] = useState(value);

  // keep the text in step when the parent swaps values
  if (value !== synced) {
    setSynced(value);
    setText(value?.name ?? "");
  }

  const options = useMemo(() => (text.trim() && text !== value?.name ? searchHubs(text, 7) : SUGGESTED.map((id) => hubById(id)!)), [text, value]);

  const choose = (h: Hub) => {
    onChange(h);
    setText(h.name);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={`${uid}-in`} className="mb-1.5 block text-[13px] font-semibold text-ink/70">
        {label}
      </label>
      <div className="relative">
        <MapPin size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          ref={inputRef}
          id={`${uid}-in`}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && options[active] ? `${uid}-${options[active].id}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          value={text}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(0);
            if (value) onChange(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(options.length - 1, a + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === "Enter" && open && options[active]) {
              e.preventDefault();
              choose(options[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="w-full rounded-2xl border-2 border-black/10 bg-white py-3.5 pl-10 pr-4 text-base font-semibold outline-none transition placeholder:font-medium placeholder:text-ink/40 hover:border-black/20 focus:border-ink"
        />
      </div>
      <AnimatePresence>
        {open && options.length > 0 && (
          <motion.ul
            id={`${uid}-list`}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-72 origin-top overflow-y-auto rounded-2xl border border-black/10 bg-white p-1.5 shadow-2xl shadow-black/15"
          >
            {!text.trim() && <li className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">Popular</li>}
            {options.map((h, i) => (
              <li
                key={h.id}
                id={`${uid}-${h.id}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(h);
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === active ? "bg-mist" : ""}`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: zoneById(h.zone).color }} />
                <span className="flex-1 font-semibold">{h.name}</span>
                <span className="text-sm text-ink/50">{h.district}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
