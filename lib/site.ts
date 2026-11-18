// Public email from the investor proposal. Add verified phone/address details when available.
export const CONTACT = {
  phone: null as string | null,
  whatsapp: null as string | null,
  email: "info@redcat.lk" as string | null,
  address: null as string | null,
};

export const STATS = {
  expressPoints: "930+",
  regionalHubs: 57,
  zones: 4,
  mixingPoints: 1,
};

// Switch on when the customer tracking system is ready.
export const FEATURES = { tracking: false };

export const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/network", label: "Network" },
  ...(FEATURES.tracking ? [{ href: "/track", label: "Track" }] : []),
  { href: "/dealers", label: "Become a dealer" },
  { href: "/about", label: "About" },
  { href: "/social-impact", label: "Social impact" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];
