"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Keep old tracking URLs safe while tracking is temporarily hidden. */
export default function TrackingUnavailable() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-20">
      <noscript><meta httpEquiv="refresh" content="0;url=/" /></noscript>
      <p className="text-lg">Tracking is currently unavailable. <Link href="/" className="font-bold underline underline-offset-4">Return to the homepage</Link>.</p>
    </div>
  );
}
