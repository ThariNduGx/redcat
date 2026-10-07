"use client";

import { useSearchParams } from "next/navigation";
import NetworkExplorer from "./map/NetworkExplorer";

/** Reads ?hub=A-RH01 so links from search, the hero and shared URLs open a specific hub. */
export default function NetworkPageMap() {
  const hub = useSearchParams().get("hub") ?? undefined;
  return <NetworkExplorer key={hub ?? "none"} initialHubId={hub} syncUrl cooperative="touch" />;
}
