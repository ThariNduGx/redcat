"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { hubById, type Hub } from "@/data/hubs";
import HubPicker from "@/components/HubPicker";
import {
  CAREER_ROLES,
  CAREERS_CPANEL_URL,
  MAX_CV_BYTES,
  MAX_DOC_BYTES,
} from "@/lib/careerRegistration";

const endpoint = CAREERS_CPANEL_URL;
const field = "mt-2 block w-full rounded-xl border border-ink/25 bg-white px-4 py-3";

function encodeFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CareerApplication() {
  const role = useSearchParams().get("role") ?? "";
  const selectedRole = Object.hasOwn(CAREER_ROLES, role) ? role : "general";
  const attempt = useRef<{
    id: string;
    fields: string;
    cv: string;
    doc?: string | null;
  } | null>(null);
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Hub | null>(null);
  const [receipt, setReceipt] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const data = new FormData(event.currentTarget);
    const cv = data.get("cv");
    const doc = data.get("document");
    setError("");

    if (!(cv instanceof File) || !cv.size || cv.size > MAX_CV_BYTES || !/\.pdf$/i.test(cv.name)) {
      setError("Choose a PDF CV under 10 MB.");
      return;
    }

    if (doc instanceof File && doc.size > 0) {
      if (doc.size > MAX_DOC_BYTES || !/\.pdf$/i.test(doc.name)) {
        setError("Work experience letter or document must be a PDF under 10 MB.");
        return;
      }
    }

    const hub = hubById(String(data.get("area") ?? ""));
    const experience = String(data.get("experience") ?? "").trim();
    if (!hub || !experience) {
      setError("Choose an area and describe your experience.");
      return;
    }

    const area = `${hub.name}, ${hub.district} District`;
    const fields = JSON.stringify({
      role: data.get("role"),
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: `Area: ${area}\nExperience: ${experience}`,
      website: data.get("website"),
    });

    pending.current = true;
    setBusy(true);
    try {
      const encodedCv = await encodeFile(cv);
      let encodedDoc: string | null = null;
      if (doc instanceof File && doc.size > 0) {
        encodedDoc = await encodeFile(doc);
      }

      const previous = attempt.current;
      const id =
        previous?.fields === fields &&
        previous.cv === encodedCv &&
        previous.doc === encodedDoc
          ? previous.id
          : crypto.randomUUID();
      attempt.current = { id, fields, cv: encodedCv, doc: encodedDoc };

      const payload = {
        ...JSON.parse(fields),
        id,
        cv: encodedCv,
        ...(encodedDoc ? { document: encodedDoc } : {}),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(35_000),
        credentials: "omit",
      });
      const result = await response.json();
      if (response.ok && result?.id === id) {
        attempt.current = null;
        setReceipt(id);
      } else {
        setError(typeof result?.error === "string" ? result.error : "We couldn’t confirm your submission. Please try again.");
      }
    } catch {
      setError("We couldn’t confirm your submission. Please try again.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  if (receipt) return <p role="status" className="mt-6">Your application was received. Your reference is <strong className="break-all">{receipt}</strong>.</p>;

  return (
    <form method="post" onSubmit={submit} className="mt-8">
      <fieldset disabled={busy} className="space-y-5">
        <label className="block font-semibold">Position
          <select key={selectedRole} name="role" defaultValue={selectedRole} className={`${field} max-sm:px-2.5 max-sm:font-medium`}>
            {Object.entries(CAREER_ROLES).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
        </label>
        <label className="block font-semibold">Name
          <input name="name" autoComplete="name" required maxLength={120} className={field} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block font-semibold">Contact number
            <input name="phone" type="tel" autoComplete="tel" required maxLength={32} className={field} />
          </label>
          <HubPicker label="Area" name="area" required value={selectedArea} onChange={setSelectedArea} placeholder="Search by town or district" />
        </div>
        <label className="block font-semibold">Email
          <input name="email" type="email" autoComplete="email" required maxLength={254} className={field} />
        </label>
        <label className="block font-semibold">Experience
          <textarea name="experience" rows={4} required maxLength={1800} className={field} />
        </label>
        <label className="block font-semibold">CV (PDF, under 10 MB)
          <input name="cv" type="file" accept=".pdf,application/pdf" required className={field} />
        </label>
        <label className="block font-semibold">Work experience letter or relevant document (PDF, under 10 MB, optional)
          <input name="document" type="file" accept=".pdf,application/pdf" className={field} />
        </label>
        <div className="hidden" aria-hidden="true">
          <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <p className="text-sm text-ink/70">RedCat will use your application details and uploaded documents to review your application and contact you about recruitment.</p>
        {error && <p role="alert" className="font-semibold text-brand-deep">{error}</p>}
        <button type="submit" className="rounded-full bg-ink px-7 py-4 font-bold text-white disabled:opacity-60">
          {busy ? "Submitting…" : "Register online"}
        </button>
      </fieldset>
    </form>
  );
}
