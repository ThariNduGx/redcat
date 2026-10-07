import { HUBS, type Hub } from "@/data/hubs";
import { typicalRoute, type Leg } from "@/lib/route";

export interface TrackEvent {
  title: string;
  where: string;
  when: string;
  done: boolean;
}

export interface MockShipment {
  id: string;
  from: Hub;
  to: Hub;
  stage: number; // 0..5
  statusLabel: string;
  events: TrackEvent[];
  route: Leg[];
  /** index into `route` the parcel is at (fractional = between two stops) */
  position: number;
}

export const STAGES = ["Booked", "Collected", "In the network", "On the way", "Out for delivery", "Delivered"];

/**
 * DEMO ONLY. Builds a deterministic, made-up shipment from the tracking number so the
 * tracking page can be designed and tested. Replace with a call to RedCat's real system.
 */
export function mockShipment(rawId: string): MockShipment {
  const id = rawId.trim().toUpperCase();
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;

  const from = HUBS[h % HUBS.length];
  let to = HUBS[(h * 7 + 3) % HUBS.length];
  if (to.id === from.id || to.zone === from.zone) to = HUBS[(h + 23) % HUBS.length];
  if (to.id === from.id) to = HUBS[(h + 31) % HUBS.length];

  const stage = h % 6;
  const route = typicalRoute(from, to);
  const mixIdx = route.findIndex((l) => l.label.includes("Mix Center"));
  const mid = mixIdx >= 0 ? mixIdx : Math.floor(route.length / 2);
  const last = route.length - 1;
  const position = [0, 0, mid, (mid + last - 1) / 2 + 0.5, last - 0.15, last][stage];

  const steps: Omit<TrackEvent, "done">[] = [
    { title: "Booked", where: `${from.name}, ${from.district}`, when: "Day 1 · 09:12" },
    { title: "Collected by RedCat", where: `${from.name} hub`, when: "Day 1 · 15:40" },
    { title: "Sorted at the Mix Center", where: "Peliyagoda", when: "Day 1 · 22:05" },
    {
      title: to.zone === "A" ? `On the way to ${to.name}` : "On the way to the destination zone",
      where: route[Math.min(last, mid + 1)].label,
      when: "Day 2 · 02:30",
    },
    { title: "Out for delivery", where: `${to.name} hub`, when: "Day 2 · 08:15" },
    { title: "Delivered", where: `${to.name}, ${to.district}`, when: "Day 2 · 12:20" },
  ];

  return {
    id,
    from,
    to,
    stage,
    statusLabel: STAGES[stage],
    events: steps.map((s, i) => ({ ...s, done: i <= stage })),
    route,
    position,
  };
}
