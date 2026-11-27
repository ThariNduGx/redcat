import type { Metadata } from "next";
import { Suspense } from "react";
import { Banknote, CheckCircle2, Clock, MapPin, ShieldCheck } from "lucide-react";
import PointFranchiseApplication from "@/components/PointFranchiseApplication";
import CatLoader from "@/components/ui/CatLoader";
import { POINT_SELECTION_WORKFLOW } from "@/lib/pointFranchise";

export const metadata: Metadata = {
  title: "REDCAT Point Franchise Application",
  description:
    "Apply for a REDCAT Point Franchise. Complete the initial 2–3 minute registration or full detailed qualification in English and Sinhala.",
  alternates: {
    canonical: "https://redcat.lk/dealers/point/application",
  },
};

const HIGHLIGHTS = [
  {
    icon: Banknote,
    title: "LKR 1.5–2.0M",
    subtitle: "Proposed turnkey investment",
    si: "යෝජිත ආයෝජනය රු. මිලියන 1.5–2.0",
  },
  {
    icon: Clock,
    title: "9 AM – 5 PM",
    subtitle: "Daytime retail hours",
    si: "දෛනික වෙළඳ සේවා වේලාවන්",
  },
  {
    icon: ShieldCheck,
    title: "100% Cash Flow",
    subtitle: "Zero debtor risk",
    si: "ණය අවදානමකින් තොරයි",
  },
  {
    icon: MapPin,
    title: "930+ Points",
    subtitle: "Exclusive territory",
    si: "අනන්‍ය ව්‍යාපාරික කලාපය",
  },
];

export default function PointApplicationPage() {
  return (
    <>
      <section className="rc-grain relative isolate overflow-clip bg-brand pb-20 pt-12 text-white sm:pb-28 sm:pt-16">
        <div className="mx-auto max-w-6xl px-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
            <span className="h-2 w-2 rounded-full bg-brand" />
            REDCAT | POINT FRANCHISE
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.4rem,5.5vw,4.75rem)] font-extrabold leading-[0.96] tracking-[-0.04em]">
            Point Franchise Application
          </h1>
          <p className="mt-3 text-xl font-bold text-brand-soft sm:text-2xl">
            අපේක්ෂිත ෆ්‍රැන්චයිස් හිමිකරුවන්ගේ ප්‍රශ්නාවලිය හා සුදුසුකම් ඇගයීම
          </p>
          <p className="mt-4 max-w-2xl text-base font-medium text-white/90 sm:text-lg">
            Stage 1: Initial application (2–3 minutes). Stage 2: Detailed qualification and interview. / පළමු අදියර: මූලික අයදුම්පත (මිනිත්තු 2–3). දෙවැනි අදියර: සවිස්තර ඇගයීම හා සම්මුඛ පරීක්ෂණය.
          </p>

          <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-black/15 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2.5 text-brand-soft">
                  <item.icon size={18} />
                  <dt className="text-xs font-bold uppercase tracking-wider">{item.subtitle}</dt>
                </div>
                <dd className="mt-1.5 text-2xl font-extrabold tracking-tight text-white">
                  {item.title}
                </dd>
                <p className="mt-0.5 text-xs text-white/75">{item.si}</p>
              </div>
            ))}
          </dl>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-14 bg-paper sm:h-20"
          style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
      </section>

      <section id="apply" className="bg-paper pb-20 pt-10 sm:pb-28 sm:pt-14">
        <div className="mx-auto max-w-4xl px-5">
          <Suspense
            fallback={
              <div className="grid h-96 place-items-center rounded-[2rem] bg-white">
                <CatLoader />
              </div>
            }
          >
            <PointFranchiseApplication />
          </Suspense>
        </div>
      </section>

      <section className="border-t border-black/10 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">
            Selection workflow / තෝරාගැනීමේ ක්‍රියාවලිය
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-5xl">
            How Point partners are selected.
          </h2>
          <p className="mt-2 text-base text-ink/70">
            Multiple applicants are welcomed per Point so we can select the most suitable candidate.
          </p>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POINT_SELECTION_WORKFLOW.map((item) => (
              <li
                key={item.step}
                className="flex items-start gap-3.5 rounded-2xl border border-black/10 bg-mist/50 p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold text-white">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-ink">{item.en}</h3>
                  <p className="mt-0.5 text-sm font-medium text-ink/65">{item.si}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-ink/60">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>Submission does not guarantee approval. Location &amp; financial readiness are verified before agreement.</span>
          </div>
        </div>
      </section>
    </>
  );
}
