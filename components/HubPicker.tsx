"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { HUBS, hubById, type Hub } from "@/data/hubs";
import { searchHubs } from "@/lib/geo";

const suggestedHubs = ["A-RH01", "C-RH01", "D-RH01", "B-RH06", "B-RH12", "C-RH10"].map((id) => hubById(id)!);
const allHubs = [...HUBS].sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name));

export default function HubPicker({
  label,
  value,
  onChange,
  placeholder = "Town or district",
  autoFocus,
  name,
  required,
}: {
  label: string;
  value: Hub | null;
  onChange: (hub: Hub | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
  required?: boolean;
}) {
  const uid = useId();
  const listId = `${uid}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [invalid, setInvalid] = useState(false);
  const search = query.trim().replace(/\s+district$/i, "");
  const options = search ? searchHubs(search, name ? HUBS.length : 7) : name ? allHubs : suggestedHubs;
  const activeOption = open ? options[active] : undefined;

  useEffect(() => {
    inputRef.current?.setCustomValidity(required && query && !value ? "Choose a location from the list." : "");
  }, [query, required, value]);

  useEffect(() => {
    if (activeOption) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active, activeOption]);

  function selectHub(hub: Hub) {
    onChange(hub);
    setQuery("");
    setActive(-1);
    setInvalid(false);
    setOpen(false);
  }

  function clearSelection() {
    onChange(null);
    setQuery("");
    setActive(-1);
    setInvalid(false);
    inputRef.current?.focus();
    setOpen(true);
  }

  return (
    <div className="relative min-w-0">
      <label htmlFor={uid} className={name ? "block font-semibold" : "mb-1.5 block text-[13px] font-semibold text-ink/70"}>
        {label}
      </label>
      {name && <input type="hidden" name={name} value={value?.id ?? ""} />}
      <div className={`relative ${name ? "mt-2" : ""}`}>
        <MapPin size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50" />
        <input
          ref={inputRef}
          id={uid}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-required={required}
          aria-invalid={invalid || undefined}
          aria-activedescendant={activeOption ? `${uid}-${activeOption.id}` : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          required={required}
          value={value?.name ?? query}
          placeholder={placeholder}
          onFocus={(event) => {
            if (value) event.currentTarget.select();
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setActive(-1);
          }}
          onInvalid={() => {
            setInvalid(true);
            setOpen(true);
          }}
          onChange={(event) => {
            if (value) onChange(null);
            setQuery(event.target.value);
            setActive(-1);
            setInvalid(false);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((index) => Math.min(options.length - 1, index + 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActive((index) => index < 0 ? options.length - 1 : Math.max(0, index - 1));
            } else if (event.key === "Enter" && open) {
              event.preventDefault();
              const option = activeOption ?? (options.length === 1 ? options[0] : undefined);
              if (option) selectHub(option);
            } else if (event.key === "Escape" && open) {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              setActive(-1);
            }
          }}
          className={`block w-full bg-white pl-10 pr-11 text-base outline-none transition placeholder:font-normal placeholder:text-ink/55 focus:border-ink focus:ring-2 focus:ring-ink/15 ${name ? "rounded-xl border border-ink/25 py-3" : "rounded-2xl border-2 border-black/10 py-3.5 font-semibold"} ${invalid ? "border-brand-deep" : ""}`}
        />
        {name && (query || value) && (
          <button type="button" onClick={clearSelection} aria-label={`Clear ${label.toLowerCase()}`}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-ink/65 hover:text-ink">
            <X size={17} aria-hidden />
          </button>
        )}
      </div>
      {open && (
        <div className={`z-30 mt-1.5 overflow-hidden rounded-xl border border-ink/15 bg-white shadow-xl shadow-ink/10 ${name ? "relative sm:absolute sm:inset-x-0 sm:top-full" : "absolute inset-x-0 top-full"}`}>
          <ul ref={listRef} id={listId} role="listbox" aria-label={label} className="max-h-56 overflow-y-auto overscroll-contain p-1 sm:max-h-64">
            {options.map((hub, index) => (
              <li key={hub.id} id={`${uid}-${hub.id}`} role="option"
                aria-selected={active < 0 ? value?.id === hub.id : active === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectHub(hub)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-mist ${index === active ? "bg-mist" : ""}`}>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{hub.name}</span>
                  <span className="block text-xs text-ink/65">{hub.district} District</span>
                </span>
                {value?.id === hub.id && <Check size={16} aria-hidden className="shrink-0 text-brand-deep" />}
              </li>
            ))}
          </ul>
          {options.length === 0 && <p role="status" className="px-3 pb-4 pt-2 text-sm text-ink/70">No matches. Try a nearby town or district.</p>}
        </div>
      )}
    </div>
  );
}
