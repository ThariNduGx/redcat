import { HUBS, type Hub } from "@/data/hubs";

const R = 6371;
const rad = (d: number) => (d * Math.PI) / 180;

/** Straight-line distance in km. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestHubs(point: { lat: number; lng: number }, n = 3): { hub: Hub; km: number }[] {
  return HUBS.map((hub) => ({ hub, km: haversineKm(point, hub) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}

/** A gentle curve between two points, as [lng, lat] pairs, for drawing routes on the map. */
export function arc(from: [number, number], to: [number, number], bend = 0.18, steps = 48): [number, number][] {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // control point offset perpendicular to the line
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    pts.push([u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]);
  }
  return pts;
}

/** Simple case- and accent-insensitive match used by the hub search boxes. */
export function normalise(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function searchHubs(query: string, limit = 8): Hub[] {
  const q = normalise(query);
  if (!q) return [];
  const scored = HUBS.map((h) => {
    const name = normalise(h.name);
    const district = normalise(h.district);
    let score = -1;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q)) score = 60;
    else if (district.startsWith(q)) score = 40;
    else if (district.includes(q)) score = 20;
    else if (normalise(h.id) === q) score = 90;
    return { h, score };
  }).filter((x) => x.score >= 0);
  return scored.sort((a, b) => b.score - a.score || a.h.name.localeCompare(b.h.name)).slice(0, limit).map((x) => x.h);
}
