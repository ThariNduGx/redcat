import type { Metadata } from "next";
import { Suspense } from "react";
import HubFranchisePageView from "@/components/HubFranchisePageView";
import CatLoader from "@/components/ui/CatLoader";

export const metadata: Metadata = {
  title: "Regional Hub Franchise Application",
  description:
    "Apply to become a REDCAT Regional Hub Franchisee. Complete the application in English or Sinhala across 57 regional hubs in Sri Lanka.",
  alternates: {
    canonical: "https://redcat.lk/dealers/hub-franchise",
  },
};

export default function HubFranchisePage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[36rem] place-items-center bg-paper">
          <CatLoader />
        </div>
      }
    >
      <HubFranchisePageView />
    </Suspense>
  );
}
