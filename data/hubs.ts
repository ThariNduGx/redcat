// Source: "Red Cat Dealer Brochure.pdf", Regional Hubs page.
// `km` is the brochure's distance from the regional hub to its zone center.
// lat/lng: town coordinates from OpenStreetMap (Nominatim), each verified to fall inside
// its own district boundary (geoBoundaries LKA ADM2). They mark the town, not a street address.

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

// [district, hub, km, lat, lng]
type Row = [string, string, number, number, number];

function build(zone: ZoneId, rows: Row[]): Hub[] {
  return rows.map(([district, name, km, lat, lng], i) => ({
    id: `${zone}-RH${String(i + 1).padStart(2, "0")}`,
    zone,
    district,
    name,
    km,
    lat,
    lng,
  }));
}

export const HUBS: Hub[] = [
  ...build("A", [
    ["Colombo", "Colombo Central", 12, 6.9328, 79.8549],
    ["Colombo", "Colombo North", 8, 6.9480, 79.8598],
    ["Colombo", "Colombo South", 22, 6.8511, 79.8659],
    ["Colombo", "Kaduwela", 18, 6.9357, 79.9843],
    ["Colombo", "Homagama", 32, 6.8412, 80.0034],
    ["Colombo", "Maharagama", 25, 6.8473, 79.9266],
    ["Gampaha", "Negombo", 38, 7.2094, 79.8331],
    ["Gampaha", "Gampaha", 28, 7.0926, 79.9951],
    ["Gampaha", "Minuwangoda", 35, 7.1693, 79.9485],
    ["Gampaha", "Kiribathgoda", 5, 6.9782, 79.9270],
    ["Kalutara", "Kalutara", 55, 6.5853, 79.9633],
    ["Kalutara", "Horana", 48, 6.7166, 80.0620],
  ]),
  ...build("B", [
    ["Kurunegala", "Kurunegala", 110, 7.4870, 80.3649],
    ["Kurunegala", "Kuliyapitiya", 135, 7.4701, 80.0440],
    ["Kurunegala", "Maho", 70, 7.8239, 80.2736],
    ["Puttalam", "Chilaw", 155, 7.5763, 79.7954],
    ["Puttalam", "Puttalam", 105, 8.0316, 79.8300],
    ["Anuradhapura", "Anuradhapura", 0, 8.3350, 80.4106],
    ["Anuradhapura", "Kekirawa", 45, 8.0408, 80.5971],
    ["Polonnaruwa", "Polonnaruwa", 105, 7.9395, 81.0003],
    ["Vavuniya", "Vavuniya", 115, 8.7594, 80.5001],
    ["Mannar", "Mannar", 110, 8.9813, 79.9044],
    ["Kilinochchi", "Kilinochchi", 190, 9.3840, 80.4087],
    ["Jaffna", "Jaffna", 200, 9.6651, 80.0093],
    ["Jaffna", "Chavakachcheri", 180, 9.6571, 80.1585],
    ["Mullaitivu", "Mullaitivu", 160, 9.2699, 80.8145],
  ]),
  ...build("C", [
    ["Kandy", "Kandy", 0, 7.2931, 80.6350],
    ["Kandy", "Peradeniya", 8, 7.2642, 80.5931],
    ["Kandy", "Kundasale", 12, 7.2805, 80.6845],
    ["Matale", "Dambulla", 72, 7.8742, 80.6511],
    ["Matale", "Matale", 25, 7.4720, 80.6234],
    ["Nuwara Eliya", "Nuwara Eliya", 78, 6.9740, 80.7670],
    ["Nuwara Eliya", "Hatton", 65, 6.8916, 80.5985],
    ["Kegalle", "Kegalle", 42, 7.2532, 80.3454],
    ["Kegalle", "Mawanella", 27, 7.2523, 80.4460],
    ["Trincomalee", "Trincomalee", 180, 8.5764, 81.2345],
    ["Trincomalee", "Kantale", 145, 8.3670, 81.0028],
    ["Batticaloa", "Batticaloa", 205, 7.7245, 81.6987],
    ["Ampara", "Kalmunai", 225, 7.4132, 81.8269],
    ["Ampara", "Ampara", 190, 7.2978, 81.6790],
    ["Ampara", "Akkaraipattu", 235, 7.2141, 81.8482],
  ]),
  ...build("D", [
    ["Galle", "Galle", 10, 6.0328, 80.2150],
    ["Galle", "Ambalangoda", 35, 6.2389, 80.0541],
    ["Galle", "Elpitiya", 45, 6.2919, 80.1619],
    ["Matara", "Matara", 45, 5.9478, 80.5483],
    ["Matara", "Akuressa", 48, 6.1012, 80.4765],
    ["Hambantota", "Hambantota", 115, 6.1249, 81.1243],
    ["Hambantota", "Tangalle", 80, 6.0251, 80.7949],
    ["Hambantota", "Tissamaharama", 145, 6.2771, 81.2893],
    ["Ratnapura", "Ratnapura", 125, 6.6804, 80.4023],
    ["Ratnapura", "Embilipitiya", 120, 6.3341, 80.8538],
    ["Ratnapura", "Balangoda", 155, 6.6501, 80.6986],
    ["Badulla", "Badulla", 235, 6.9900, 81.0570],
    ["Badulla", "Bandarawela", 205, 6.8305, 80.9888],
    ["Badulla", "Mahiyanganaya", 275, 7.3397, 80.9939],
    ["Monaragala", "Monaragala", 220, 6.8727, 81.3506],
    ["Monaragala", "Wellawaya", 180, 6.7318, 81.1018],
  ]),
];

export const DISTRICTS = Array.from(new Set(HUBS.map((h) => h.district))).sort();

export const zoneById = (id: ZoneId) => ZONES.find((z) => z.id === id)!;
export const hubsInZone = (id: ZoneId) => HUBS.filter((h) => h.zone === id);
export const hubById = (id: string) => HUBS.find((h) => h.id === id);
export const zoneOfDistrict = (district: string) => HUBS.find((h) => h.district === district)?.zone;
