export const CAREER_ROLES = {
  bdm: "Business Development Manager",
  zom: "Zone Operations Manager",
  general: "General application",
} as const;

export const MAX_CV_BYTES = 5_000_000;

export const CAREERS_CPANEL_URL = process.env.NEXT_PUBLIC_CAREERS_CPANEL_URL || "https://apply.bestproducts.lk/apply.php";

export function careerApplicationHref(role = "general") {
  return `/hr?role=${encodeURIComponent(role)}#apply`;
}
