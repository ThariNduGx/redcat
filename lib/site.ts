export const SITE_URL = "https://redcat.lk";

// Add verified phone/address details when available.
export const CONTACT = {
  phone: null as string | null,
  whatsapp: null as string | null,
  address: null as string | null,
};

export const STATS = {
  expressPoints: "930+",
  regionalHubs: 57,
  districts: 25,
};

// Switch on when the customer tracking system is ready.
export const FEATURES = { tracking: false };

export const HUB_MAP_HREF = "/#hubs";

export function hubMapHref(hubId: string) {
  return `/?hub=${encodeURIComponent(hubId)}#hubs`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/social-impact", label: "Social Impact" },
];
