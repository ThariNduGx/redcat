import type { Metadata } from "next";
import { Suspense } from "react";
import PointFranchiseApplication from "@/components/PointFranchiseApplication";
import CatLoader from "@/components/ui/CatLoader";

export const metadata: Metadata = {
  title: "REDCAT Point Franchise Application",
  description:
    "Apply for a REDCAT Point Franchise in English or Sinhala. RedCat will review your proposed location and contact you about the qualification interview.",
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
