import type { Metadata } from "next";
import { Suspense } from "react";
import PointFranchiseApplication from "@/components/PointFranchiseApplication";
import CatLoader from "@/components/ui/CatLoader";

export const metadata: Metadata = {
  title: "REDCAT Point Franchise Application",
  description:
    "Apply for a REDCAT Point Franchise. Complete the initial 2–3 minute registration or full detailed qualification in English or Sinhala.",
  alternates: {
    canonical: "https://redcat.lk/dealers/point/application",
  },
};

export default function PointApplicationPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[36rem] place-items-center bg-paper">
          <CatLoader />
        </div>
      }
    >
      <PointFranchiseApplication />
    </Suspense>
  );
}
