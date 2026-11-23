// lib/analytics.ts

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const GTM_ID = "GTM-K6G4P8TP";
export const META_PIXEL_ID = "2271290716935198";

/**
 * Safe wrapper for Meta Pixel fbq call
 */
export function trackMetaEvent(
  action: "track" | "trackCustom",
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      if (params) {
        window.fbq(action, eventName, params);
      } else {
        window.fbq(action, eventName);
      }
    } catch (e) {
      console.warn("Meta Pixel track error:", e);
    }
  }
}

/**
 * Safe wrapper for GTM dataLayer push
 */
export function trackGtmEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    } catch (e) {
      console.warn("GTM dataLayer error:", e);
    }
  }
}

/**
 * -------------------------------------------------------------
 * Mandatory & Standard Tracking Events
 * -------------------------------------------------------------
 */

// 1. PageView: Initial and SPA Route Navigation
export function trackPageView(url?: string) {
  trackMetaEvent("track", "PageView");
  trackGtmEvent("page_view", {
    page_location:
      typeof window !== "undefined" ? url || window.location.href : url,
  });
}

// 2. Dealer / Franchise Application Submitted (Meta Lead)
export function trackDealerEnquiry(params: {
  role?: string;
  district?: string;
  name?: string;
}) {
  trackMetaEvent("track", "Lead", {
    content_name: "Franchise / Dealer Application",
    content_category: "Franchise",
    role: params.role,
    district: params.district,
  });
  trackGtmEvent("dealer_enquiry_submitted", {
    event_category: "Franchise",
    role: params.role,
    district: params.district,
  });
}

// 3. General Website Contact Submitted (Meta Contact)
export function trackContactEnquiry(params: {
  topic?: string;
  district?: string;
}) {
  trackMetaEvent("track", "Contact", {
    content_name: "Website Contact Enquiry",
    topic: params.topic,
    district: params.district,
  });
  trackGtmEvent("contact_form_submitted", {
    event_category: "Contact",
    topic: params.topic,
    district: params.district,
  });
}

// 4. Job / Career Application Submitted (Meta SubmitApplication & Lead)
export function trackCareerApplication(params: {
  role: string;
  area: string;
  reference_id: string;
}) {
  trackMetaEvent("track", "SubmitApplication", {
    content_name: "Career Application",
    role: params.role,
    area: params.area,
    reference_id: params.reference_id,
  });
  trackMetaEvent("track", "Lead", {
    content_name: "Career Application",
    role: params.role,
  });
  trackGtmEvent("career_application_submitted", {
    event_category: "Careers",
    role: params.role,
    area: params.area,
    reference_id: params.reference_id,
  });
}

// 5. Shipment Tracking Search (Meta Search)
export function trackShipmentSearch(query: string) {
  const clean = query.trim();
  if (!clean) return;
  trackMetaEvent("track", "Search", {
    search_string: clean,
    content_category: "Shipment Tracking",
  });
  trackGtmEvent("track_shipment", {
    event_category: "Tracking",
    search_term: clean,
  });
}

// 6. Direct Contact CTA (WhatsApp / Phone Call)
export function trackContactInitiation(
  method: "whatsapp" | "phone",
  detail?: string | null
) {
  trackMetaEvent("track", "Contact", {
    method,
    detail: detail || undefined,
  });
  trackMetaEvent(
    "trackCustom",
    method === "whatsapp" ? "WhatsAppClick" : "PhoneClick",
    {
      detail: detail || undefined,
    }
  );
  trackGtmEvent("contact_click", {
    contact_method: method,
    detail: detail || undefined,
  });
}

// 7. Franchise CTA Button Click
export function trackFranchiseCtaClick(location: string) {
  trackMetaEvent("trackCustom", "FranchiseCtaClick", {
    cta_location: location,
  });
  trackGtmEvent("franchise_cta_click", {
    cta_location: location,
  });
}
