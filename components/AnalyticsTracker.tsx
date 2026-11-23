"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Skip first mount because layout.tsx base script fires the initial PageView
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const query = searchParams?.toString();
    const url = pathname + (query ? `?${query}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}
