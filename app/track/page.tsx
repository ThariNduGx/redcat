import type { Metadata } from "next";
import { Suspense } from "react";
import TrackView from "@/components/TrackView";
import CatLoader from "@/components/ui/CatLoader";

export const metadata: Metadata = {
  title: "Track a Parcel",
  description: "Track one or more RedCat parcels and see where they are on the map.",
};

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="grid min-h-[70vh] place-items-center bg-paper"><CatLoader label="Finding your parcel…" /></div>}>
      <TrackView />
    </Suspense>
  );
}
