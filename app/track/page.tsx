import type { Metadata } from "next";
import { Suspense } from "react";
import TrackView from "@/components/TrackView";
import CatLoader from "@/components/ui/CatLoader";
import TrackingUnavailable from "@/components/TrackingUnavailable";
import { FEATURES } from "@/lib/site";

export const metadata: Metadata = {
  title: FEATURES.tracking ? "Track a Parcel" : "RedCat",
  robots: FEATURES.tracking ? undefined : { index: false, follow: false },
  description: "Track one or more RedCat parcels and see where they are on the map.",
};

export default function TrackPage() {
  if (!FEATURES.tracking) return <TrackingUnavailable />;
  return (
    <Suspense fallback={<div className="grid min-h-[70vh] place-items-center bg-paper"><CatLoader label="Finding your parcel…" /></div>}>
      <TrackView />
    </Suspense>
  );
}
