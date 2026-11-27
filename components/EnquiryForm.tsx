"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, LoaderCircle } from "lucide-react";
import { CAREER_ROLES, careerApplicationHref } from "@/lib/careerRegistration";
import { DISTRICTS } from "@/data/hubs";
import { trackDealerEnquiry, trackContactEnquiry } from "@/lib/analytics";
import CatLoader from "./ui/CatLoader";

type Kind = "dealer" | "contact";
type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-base font-semibold outline-none transition placeholder:font-medium placeholder:text-ink/40 hover:border-black/20 focus:border-ink";
const lbl = "mb-1.5 block text-[13px] font-semibold text-ink/70";

const TOPICS = ["Pickup request", "A parcel I sent or am expecting", "Business account", "Careers", "Something else"] as const;
const POINT_ROLE = "Express point";

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
  const initialTopic = TOPICS.find((topic) => topic === params.get("topic")) ?? TOPICS[0];
  const [topic, setTopic] = useState<string>(initialTopic);
  const [seenTopicParam, setSeenTopicParam] = useState(initialTopic);
  if (initialTopic !== seenTopicParam) {
    setSeenTopicParam(initialTopic);
    setTopic(initialTopic);
  }
  const careerRole = Object.entries(CAREER_ROLES).find(([, label]) => label === params.get("role"))?.[0];
  const check = (name: string, value: string) => setErrors((e) => ({ ...e, [name]: validate(name, value) }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (kind === "contact" && topic === "Careers") return;
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
      const payload = {
        ...data,
        kind,
        topic: kind === "contact" ? topic : undefined,
        role: kind === "dealer" ? POINT_ROLE : undefined,
      };

      const selectedOption = kind === "dealer" ? POINT_ROLE : topic;
      const subject = kind === "dealer"
        ? `[RedCat Dealer Application] ${POINT_ROLE} - ${data.name}${data.district ? ` (${data.district})` : ""}`
        : `[RedCat Website Enquiry] ${topic} - ${data.name}`;

      // 1. Direct gateway submission delivering to info@redcat.lk
      const formSubmitPromise = fetch("https://formsubmit.co/ajax/info@redcat.lk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _replyto: data.email || undefined,
          _template: "table",
          _captcha: "false",
          "Form Type": kind === "dealer" ? "Franchise / Dealer Application" : "Website Contact Enquiry",
          "Selected Category": selectedOption,
          "Full Name": data.name,
          "Phone Number": data.phone,
          "Email Address": data.email || "Not provided",
          "District": data.district || "Not specified",
          "Message / Details": data.message || "None",
          "Pickup From": data.from || undefined,
          "Pickup To": data.to || undefined,
          "Package Size": data.size || undefined,
          "Submission URL": typeof window !== "undefined" ? window.location.href : "",
        }),
      })
        .then(async (res) => {
          if (!res.ok) return null;
          return await res.json().catch(() => null);
        })
        .catch(() => null);

      // 2. Netlify Forms submission
      const netlifyParams = new URLSearchParams();
      netlifyParams.append("form-name", "enquiry");
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined) netlifyParams.append(k, String(v));
      });
      const netlifyPromise = fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: netlifyParams.toString(),
      })
        .then((res) => res.ok)
        .catch(() => false);

      // 3. CloudFront Lambda endpoint, when configured
      const lambdaPromise = (async () => {
        try {
          const body = JSON.stringify(payload);
          const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body));
          const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
          const res = await fetch("/api/enquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-amz-content-sha256": hash },
            body,
          });
          if (res.ok) {
            const json = await res.json().catch(() => null);
            return json?.ok ?? false;
          }
          return false;
        } catch {
          return false;
        }
      })();

      const [fsRes, netlifyOk, lambdaOk] = await Promise.all([
        formSubmitPromise,
        netlifyPromise,
        lambdaPromise,
      ]);

      if (fsRes !== null || netlifyOk || lambdaOk) {
        if (kind === "dealer") {
          trackDealerEnquiry({
            role: POINT_ROLE,
            district: data.district,
            name: data.name,
          });
        } else {
          trackContactEnquiry({
            topic,
            district: data.district,
          });
        }
        setFirstName(String(data.name ?? "").trim().split(/\s+/)[0]);
        setStatus("sent");
        return;
      }

      throw new Error("Unable to send your enquiry. Please try again.");
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
          name="enquiry"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="website"
          exit={{ opacity: 0, scale: 0.98 }}
          onSubmit={onSubmit}
          noValidate
          className="relative space-y-5 rounded-[2rem] bg-white p-5 text-ink shadow-xl shadow-black/10 ring-1 ring-black/5 sm:p-8"
        >
          <input type="hidden" name="form-name" value="enquiry" />
          {/* honeypot */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {kind === "contact" && (
            <Choice legend="What can we help with?" options={TOPICS.map((t) => ({ value: t }))} value={topic} onChange={setTopic} cols="grid-cols-2" />
          )}

          {kind === "contact" && topic === "Careers" ? (
            <Link href={careerApplicationHref(careerRole)} className="inline-flex rounded-full bg-ink px-6 py-3 font-bold text-white">
              Open the careers application form
            </Link>
          ) : (
            <>
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
              <div role="alert" className="rounded-2xl bg-brand-soft p-4 font-semibold text-brand-deep">
                <p>{serverError}</p>
              </div>
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
            </>
          )}
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
