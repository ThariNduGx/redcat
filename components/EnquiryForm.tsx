"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, LoaderCircle } from "lucide-react";
import { DISTRICTS } from "@/data/hubs";
import CatLoader from "./ui/CatLoader";

type Kind = "dealer" | "contact";
type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-base font-semibold outline-none transition placeholder:font-medium placeholder:text-ink/40 hover:border-black/20 focus:border-ink";
const lbl = "mb-1.5 block text-[13px] font-semibold text-ink/70";

const TOPICS = ["Pickup request", "A parcel I sent or am expecting", "Business account", "Something else"] as const;
const ROLES = [
  { value: "Regional hub distributor", hint: "Run a hub for your district" },
  { value: "Express point", hint: "Drop-off and collection in your shop" },
  { value: "Not sure yet", hint: "Help me choose" },
] as const;
const ROLE_PARAM: Record<string, (typeof ROLES)[number]["value"]> = { hub: "Regional hub distributor", point: "Express point" };

const PHONE = /^[+\d][\d\s\-()]{6,}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(name: string, value: string): string {
  const v = value.trim();
  if (name === "name" && !v) return "Please tell us your name.";
  if (name === "phone" && !PHONE.test(v)) return "Enter a phone number we can call, e.g. 077 123 4567.";
  if (name === "email" && v && !EMAIL.test(v)) return "That email address doesn't look right.";
  if (name === "district" && !v) return "Choose your district.";
  return "";
}

export default function EnquiryForm({ kind }: { kind: Kind }) {
  const uid = useId();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [firstName, setFirstName] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const roleParam = ROLE_PARAM[params.get("role") ?? ""];
  const [role, setRole] = useState<string>(roleParam ?? "Regional hub distributor");
  // "Apply for this" links change ?role= on the same page, so follow it after mount too
  const [seenRoleParam, setSeenRoleParam] = useState(roleParam);
  if (roleParam !== seenRoleParam) {
    setSeenRoleParam(roleParam);
    if (roleParam) setRole(roleParam);
  }

  const check = (name: string, value: string) => setErrors((e) => ({ ...e, [name]: validate(name, value) }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const required = kind === "dealer" ? ["name", "phone", "email", "district"] : ["name", "phone", "email"];
    const next = Object.fromEntries(required.map((n) => [n, validate(n, data[n] ?? "")]));
    setErrors(next);
    const firstBad = required.find((n) => next[n]);
    if (firstBad) {
      (form.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind, topic: kind === "contact" ? topic : undefined, role: kind === "dealer" ? role : undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setFirstName(String(data.name ?? "").trim().split(/\s+/)[0]);
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          role="status"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2rem] bg-white p-8 text-center text-ink shadow-xl shadow-black/10 ring-1 ring-black/5 sm:p-12"
        >
          <CatLoader label="" width={190} />
          <p className="mt-4 text-3xl font-extrabold tracking-tight">Thanks{firstName ? `, ${firstName}` : ""}!</p>
          <p className="mx-auto mt-2 max-w-sm text-lg text-ink/70">
            {kind === "dealer"
              ? "Your details are on their way to our partnerships team. We'll call you about opportunities in your area."
              : "Your message is on its way. The RedCat team will get back to you."}
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, scale: 0.98 }}
          onSubmit={onSubmit}
          noValidate
          className="relative space-y-5 rounded-[2rem] bg-white p-5 text-ink shadow-xl shadow-black/10 ring-1 ring-black/5 sm:p-8"
        >
          {/* honeypot */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {kind === "dealer" ? (
            <Choice legend="I'm interested in" options={ROLES.map((r) => ({ value: r.value, hint: r.hint }))} value={role} onChange={setRole} cols="sm:grid-cols-3" />
          ) : (
            <Choice legend="What can we help with?" options={TOPICS.map((t) => ({ value: t }))} value={topic} onChange={setTopic} cols="grid-cols-2" />
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={`${uid}-name`} label="Full name" error={errors.name}>
              <input id={`${uid}-name`} name="name" autoComplete="name" onBlur={(e) => check("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} className={`${field} ${errors.name ? "border-brand-deep" : "border-black/10"}`} />
            </Field>
            <Field id={`${uid}-phone`} label="Phone" error={errors.phone}>
              <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" onBlur={(e) => check("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-phone-err` : undefined} className={`${field} ${errors.phone ? "border-brand-deep" : "border-black/10"}`} />
            </Field>
          </div>

          <div className={`grid gap-5 ${kind === "dealer" ? "sm:grid-cols-2" : ""}`}>
            <Field id={`${uid}-email`} label="Email" optional error={errors.email}>
              <input id={`${uid}-email`} name="email" type="email" autoComplete="email" onBlur={(e) => check("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${uid}-email-err` : undefined} className={`${field} ${errors.email ? "border-brand-deep" : "border-black/10"}`} />
            </Field>
            {kind === "dealer" && (
              <Field id={`${uid}-district`} label="District" error={errors.district}>
                <div className="relative">
                  <select id={`${uid}-district`} name="district" defaultValue="" onChange={(e) => check("district", e.target.value)} aria-invalid={!!errors.district} aria-describedby={errors.district ? `${uid}-district-err` : undefined} className={`${field} appearance-none pr-10 ${errors.district ? "border-brand-deep" : "border-black/10"}`}>
                    <option value="" disabled>Choose your district</option>
                    {DISTRICTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/50" />
                </div>
              </Field>
            )}
          </div>

          {kind === "contact" && topic === "Pickup request" && (
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id={`${uid}-from`} label="From">
                <input id={`${uid}-from`} name="from" defaultValue={params.get("from") ?? ""} className={`${field} border-black/10`} />
              </Field>
              <Field id={`${uid}-to`} label="To">
                <input id={`${uid}-to`} name="to" defaultValue={params.get("to") ?? ""} className={`${field} border-black/10`} />
              </Field>
              <Field id={`${uid}-size`} label="Package">
                <input id={`${uid}-size`} name="size" defaultValue={params.get("size") ?? ""} className={`${field} border-black/10`} />
              </Field>
            </div>
          )}

          <Field id={`${uid}-msg`} label={kind === "dealer" ? "Tell us about your business" : "Message"} optional>
            <textarea id={`${uid}-msg`} name="message" rows={4} maxLength={2000} className={`${field} resize-y border-black/10`} />
          </Field>

          {status === "error" && (
            <p role="alert" className="rounded-2xl bg-brand-soft px-4 py-3 font-semibold text-brand-deep">
              {serverError}
            </p>
          )}

          <button
            disabled={status === "sending"}
            className="press group flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-8 py-4 text-base font-bold text-white transition-colors hover:bg-brand-deep disabled:opacity-70 sm:w-auto"
          >
            {status === "sending" ? (
              <>
                <LoaderCircle size={18} className="animate-spin" /> Sending…
              </>
            ) : (
              <>
                {kind === "dealer" ? "Send my details" : "Send message"}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={lbl}>
        {label} {optional && <span className="font-normal text-ink/45">(optional)</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-[13px] font-semibold text-brand-deep"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Choice({
  legend,
  options,
  value,
  onChange,
  cols,
}: {
  legend: string;
  options: { value: string; hint?: string }[];
  value: string;
  onChange: (v: string) => void;
  cols: string;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className={lbl}>{legend}</legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((o) => {
          const on = o.value === value;
          return (
            <label
              key={o.value}
              className={`press relative cursor-pointer rounded-2xl border-2 p-3.5 transition-colors ${on ? "border-ink bg-ink text-white" : "border-black/10 hover:border-black/25"}`}
            >
              <input type="radio" name={name} value={o.value} checked={on} onChange={() => onChange(o.value)} className="sr-only" />
              <span className="flex items-start justify-between gap-2">
                <span className="text-[15px] font-bold leading-snug">{o.value}</span>
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${on ? "border-brand bg-brand" : "border-black/20"}`}>
                  {on && <Check size={12} strokeWidth={3.5} className="text-ink" />}
                </span>
              </span>
              {o.hint && <span className={`mt-0.5 block text-[13px] ${on ? "text-white/70" : "text-ink/55"}`}>{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
