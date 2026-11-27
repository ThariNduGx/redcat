// Source: "Red Cat Dealer Brochure.pdf", Regional Hubs page.
// `km` is the brochure's distance from the regional hub to its zone center.
// lat/lng: town coordinates from OpenStreetMap (Nominatim), each verified to fall inside
// its own district boundary (geoBoundaries LKA ADM2). They mark the town, not a street address.

import catalog from "@/infra/cpanel-hub-franchise/hub-catalog.json";

export type ZoneId = "A" | "B" | "C" | "D";

export interface Zone {
  id: ZoneId;
  name: string;
  center: string;
  color: string;
  lat: number;
  lng: number;
}

export interface Hub {
  id: string;
  zone: ZoneId;
  district: string;
  name: string;
  km: number;
  lat: number;
  lng: number;
}

export const ZONES: Zone[] = [
  { id: "A", name: "Zone A", center: "Peliyagoda", color: "#e5645f", lat: 6.9634, lng: 79.8819 },
  { id: "B", name: "Zone B", center: "Anuradhapura", color: "#e9b336", lat: 8.335, lng: 80.4106 },
  { id: "C", name: "Zone C", center: "Kandy", color: "#4461f2", lat: 7.2931, lng: 80.635 },
  { id: "D", name: "Zone D", center: "Galle", color: "#14a37f", lat: 6.0328, lng: 80.215 },
];

export const HUBS: Hub[] = catalog.hubs.map((hub) => ({ ...hub, zone: hub.zone as ZoneId }));
export const DISTRICTS = catalog.districts;

export const zoneById = (id: ZoneId) => ZONES.find((z) => z.id === id)!;
export const hubsInZone = (id: ZoneId) => HUBS.filter((h) => h.zone === id);
export const hubById = (id: string) => HUBS.find((h) => h.id === id);
export const zoneOfDistrict = (district: string) => HUBS.find((h) => h.district === district)?.zone;
