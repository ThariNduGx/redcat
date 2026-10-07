"use client";

import { useRouter } from "next/navigation";
import { useId, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export default function FooterTrack() {
  const router = useRouter();
  const uid = useId();
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = String(new FormData(e.currentTarget).get("id") ?? "").trim();
    if (id) router.push(`/track?id=${encodeURIComponent(id)}`);
  }
  return (
    <form onSubmit={onSubmit} className="flex rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 transition focus-within:ring-white/60">
      <label htmlFor={`${uid}-ft`} className="sr-only">Tracking number</label>
      <input
        id={`${uid}-ft`}
        name="id"
        placeholder="Track a parcel"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent px-4 text-base font-semibold text-white outline-none placeholder:text-white/50"
      />
      <button aria-label="Track" className="press grid h-11 w-11 place-items-center rounded-full bg-brand text-ink transition hover:bg-white">
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
