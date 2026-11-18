import { zoneById, type Hub } from "@/data/hubs";

export interface Leg {
  label: string;
  detail?: string;
  lat: number;
  lng: number;
}

/**
 * The typical path a parcel takes through RedCat's hierarchy
 * (regional hub → origin zone → destination zone → regional hub),
 * built from the network structure in the dealer deck. The exact routing rules
 * and intermediate sorting locations should be confirmed by RedCat ops.
 */
export function typicalRoute(from: Hub, to: Hub): Leg[] {
  const fz = zoneById(from.zone);
  const tz = zoneById(to.zone);

  if (from.id === to.id) {
    return [
      { label: `${from.name} hub`, detail: "Collected locally", lat: from.lat, lng: from.lng },
      { label: "Delivered", detail: `Within ${from.name}`, lat: to.lat, lng: to.lng },
    ];
  }

  const legs: Leg[] = [{ label: `${from.name} hub`, detail: `${from.district} District`, lat: from.lat, lng: from.lng }];

  if (from.zone === to.zone) {
    if (from.km > 0) legs.push({ label: `${fz.center} zone`, detail: `${from.km} km`, lat: fz.lat, lng: fz.lng });
  } else {
    if (from.km > 0) legs.push({ label: `${fz.center} zone`, detail: "Through the overnight network", lat: fz.lat, lng: fz.lng });
    if (to.km > 0) legs.push({ label: `${tz.center} zone`, detail: `On the way to ${to.name}`, lat: tz.lat, lng: tz.lng });
  }

  legs.push({ label: `${to.name} hub`, detail: "Out for delivery", lat: to.lat, lng: to.lng });
  return legs;
}

/** "Thu 8 Oct" for tomorrow, in the visitor's locale and Sri Lanka time. */
export function nextDayLabel(now = new Date()) {
  const t = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return t.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Colombo" });
}
