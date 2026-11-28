"use client";

import { useEffect } from "react";
import { HUB_APPLICATION_HREF, POINT_APPLICATION_HREF } from "@/lib/site";

export default function LegacyFranchiseLink() {
  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "hub" || role === "point") {
      const application = role === "hub" ? HUB_APPLICATION_HREF : POINT_APPLICATION_HREF;
      window.location.replace(application + "#apply");
    }
  }, []);

  return null;
}
