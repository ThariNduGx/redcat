"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, LngLatBoundsLike, MapGeoJSONFeature, Popup } from "maplibre-gl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LocateFixed,
  Link2,
  Maximize2,
  Minus,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import { HUBS, MIX_CENTER, ZONES, hubById, hubsInZone, zoneById, type Hub, type ZoneId } from "@/data/hubs";
import { arc, nearestHubs, searchHubs } from "@/lib/geo";
import { toast } from "@/components/ui/Toaster";
import CatLoader from "@/components/ui/CatLoader";
import { BRAND, INK, SRI_LANKA_BOUNDS, useRedCatMap } from "./useRedCatMap";

type Filter = ZoneId | "all";
type DistrictFC = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, { district: string; zone: ZoneId }>;

const zoneColor = ["match", ["get", "zone"], ...ZONES.flatMap((z) => [z.id, z.color]), "#bbb"] as unknown as string;

function fillOpacity(zone: Filter) {
  const hover = ["boolean", ["feature-state", "hover"], false];
  if (zone === "all") return ["case", hover, 0.4, 0.2];
  return ["case", ["==", ["get", "zone"], zone], ["case", hover, 0.48, 0.32], 0.04];
}
function dimByZone(zone: Filter, on: number, off: number) {
  return zone === "all" ? on : ["case", ["==", ["get", "zone"], zone], on, off];
}

function bboxOf(fc: DistrictFC, pred: (p: { district: string; zone: ZoneId }) => boolean): LngLatBoundsLike | null {
  let minX = 180, minY = 90, maxX = -180, maxY = -90;
  let found = false;
  const visit = (c: unknown): void => {
    if (typeof (c as number[])[0] === "number") {
      const [x, y] = c as number[];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      found = true;
    } else (c as unknown[]).forEach(visit);
  };
  fc.features.filter((f) => pred(f.properties)).forEach((f) => visit(f.geometry.coordinates));
  return found ? [[minX, minY], [maxX, maxY]] : null;
}

const hubsFC: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: HUBS.map((h) => ({
    type: "Feature",
    properties: { id: h.id, name: h.name, zone: h.zone, district: h.district },
    geometry: { type: "Point", coordinates: [h.lng, h.lat] },
  })),
};

const spokesFC: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
  type: "FeatureCollection",
  features: HUBS.filter((h) => h.km > 0).map((h) => {
    const z = zoneById(h.zone);
    return {
      type: "Feature",
      properties: { zone: h.zone },
      geometry: { type: "LineString", coordinates: arc([z.lng, z.lat], [h.lng, h.lat], 0.08, 16) },
    };
  }),
};

const trunks = ZONES.filter((z) => z.id !== "A").map((z) => arc([MIX_CENTER.lng, MIX_CENTER.lat], [z.lng, z.lat], 0.22, 80));
const trunksFC: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
  type: "FeatureCollection",
  features: trunks.map((coords) => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } })),
};

function pointAlong(line: [number, number][], t: number): [number, number] {
  const i = Math.min(line.length - 2, Math.floor(t * (line.length - 1)));
  const f = t * (line.length - 1) - i;
  const [x1, y1] = line[i];
  const [x2, y2] = line[i + 1];
  return [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f];
}

function selectionRoute(h: Hub): GeoJSON.FeatureCollection<GeoJSON.LineString> {
  const z = zoneById(h.zone);
  const lines: [number, number][][] = [];
  if (h.km > 0) lines.push(arc([h.lng, h.lat], [z.lng, z.lat], 0.1, 32));
  if (z.id !== "A") lines.push(arc([z.lng, z.lat], [MIX_CENTER.lng, MIX_CENTER.lat], -0.22, 64));
  return {
    type: "FeatureCollection",
    features: lines.map((coordinates) => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates } })),
  };
}

const empty: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

/** Camera padding so the hub panel (an overlay on wide screens) never covers what we fly to. */
function padding() {
  const wide = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
  return wide ? { top: 60, bottom: 60, left: 440, right: 70 } : { top: 40, bottom: 40, left: 30, right: 30 };
}

export default function NetworkExplorer({
  initialHubId,
  syncUrl = false,
  cooperative = "touch",
  className = "",
}: {
  initialHubId?: string;
  syncUrl?: boolean;
  /** Require two fingers / ctrl+scroll to move the map. "touch" turns it on for touch screens only. */
  cooperative?: boolean | "touch";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const coop = cooperative === "touch" ? typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches : cooperative;
  const { map, status } = useRedCatMap(containerRef, { cooperativeGestures: coop, fitBoundsOptions: { padding: padding() } });

  const initial = initialHubId ? hubById(initialHubId) : undefined;
  const [zone, setZone] = useState<Filter>(initial?.zone ?? "all");
  const [selectedId, setSelectedId] = useState<string | null>(initial?.id ?? null);
  const [query, setQuery] = useState("");
  const [nearest, setNearest] = useState<{ hub: Hub; km: number }[] | null>(null);
  const [locating, setLocating] = useState(false);
  const [hoverDistrict, setHoverDistrict] = useState<{ district: string; zone: ZoneId } | null>(null);
  const [districts, setDistricts] = useState<DistrictFC | null>(null);
  const [layersReady, setLayersReady] = useState(false);
  const hoveredHub = useRef<string | null>(null);
  const hoveredDistrictId = useRef<number | string | null>(null);
  const popupRef = useRef<Popup | null>(null);

  const selected = selectedId ? hubById(selectedId) ?? null : null;
  const initialHubRef = useRef(initial);
  const userMoved = useRef(false);
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const results = useMemo(() => {
    const base = query ? searchHubs(query, 57) : HUBS;
    return zone === "all" ? base : base.filter((h) => h.zone === zone);
  }, [query, zone]);

  /* ---------- build the map layers once ---------- */
  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    (async () => {
      const [maplibregl, fc] = await Promise.all([
        import("maplibre-gl"),
        fetch("/geo/districts.geojson").then((r) => r.json() as Promise<DistrictFC>),
      ]);
      if (cancelled || map.getSource("districts")) return;
      setDistricts(fc);

      const firstSymbol = map.getStyle().layers.find((l) => l.type === "symbol")?.id;

      map.addSource("districts", { type: "geojson", data: fc });
      map.addLayer({ id: "district-fill", type: "fill", source: "districts", paint: { "fill-color": zoneColor, "fill-opacity": fillOpacity("all") as never } }, firstSymbol);
      map.addLayer({
        id: "district-line",
        type: "line",
        source: "districts",
        paint: { "line-color": "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.8, 10, 2] },
      }, firstSymbol);

      map.addSource("spokes", { type: "geojson", data: spokesFC });
      map.addLayer({
        id: "spokes",
        type: "line",
        source: "spokes",
        layout: { "line-cap": "round" },
        paint: { "line-color": INK, "line-opacity": 0.28, "line-width": 1, "line-dasharray": [2, 2] },
      });

      map.addSource("trunks", { type: "geojson", data: trunksFC });
      map.addLayer({
        id: "trunks",
        type: "line",
        source: "trunks",
        layout: { "line-cap": "round" },
        paint: { "line-color": INK, "line-opacity": 0.75, "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1.6, 10, 3] },
      });

      map.addSource("selection", { type: "geojson", data: empty });
      map.addLayer({
        id: "selection",
        type: "line",
        source: "selection",
        layout: { "line-cap": "round" },
        paint: { "line-color": BRAND, "line-width": ["interpolate", ["linear"], ["zoom"], 6, 3, 11, 5] },
      });

      map.addSource("parcels", { type: "geojson", data: empty });
      map.addLayer({
        id: "parcels",
        type: "circle",
        source: "parcels",
        paint: { "circle-radius": 4.5, "circle-color": BRAND, "circle-stroke-color": "#fff", "circle-stroke-width": 2 },
      });

      map.addSource("hubs", { type: "geojson", data: hubsFC, promoteId: "id" });
      map.addLayer({
        id: "hub-halo",
        type: "circle",
        source: "hubs",
        filter: ["==", ["get", "id"], ""],
        paint: { "circle-radius": 18, "circle-color": zoneColor, "circle-opacity": 0.28, "circle-stroke-color": INK, "circle-stroke-width": 1.5 },
      });
      map.addLayer({
        id: "hubs",
        type: "circle",
        source: "hubs",
        paint: {
          "circle-color": zoneColor,
          "circle-stroke-color": ["case", ["boolean", ["feature-state", "hover"], false], INK, "#ffffff"],
          "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 2.5, 1.8],
          // zoom must be the top-level input, so hover is resolved inside each stop
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            6, ["case", ["boolean", ["feature-state", "hover"], false], 7.5, 5],
            10, ["case", ["boolean", ["feature-state", "hover"], false], 11, 8.5],
            13, ["case", ["boolean", ["feature-state", "hover"], false], 13, 10.5],
          ],
        },
      });
      map.addLayer({
        id: "hub-labels",
        type: "symbol",
        source: "hubs",
        minzoom: 8.3,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 12,
          "text-offset": [0, 1.1],
          "text-anchor": "top",
          "text-optional": true,
        },
        paint: { "text-color": INK, "text-halo-color": "#fff", "text-halo-width": 1.6 },
      });
      map.addLayer({
        id: "hub-label-selected",
        type: "symbol",
        source: "hubs",
        filter: ["==", ["get", "id"], ""],
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 14,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          "text-allow-overlap": true,
        },
        paint: { "text-color": INK, "text-halo-color": "#fff", "text-halo-width": 2 },
      });

      // the Mix Center gets a custom HTML marker with the cat
      const el = document.createElement("div");
      el.className = "rc-mix";
      // a tiny cat face drawn for 40px, since the full logo doesn't survive at this size
      el.innerHTML = `<span class="rc-mix-pulse"></span><span class="rc-mix-core"><svg viewBox="0 0 40 40" width="40" height="40"><path d="M8 19 L9.5 4 L19 12Z" fill="#090908"/><path d="M21 12 L30.5 4 L32 19Z" fill="#090908"/><path d="M11 13.5 L11.8 8 L16 11.8Z" fill="#ff4d4d"/><path d="M24 11.8 L28.2 8 L29 13.5Z" fill="#ff4d4d"/><circle cx="20" cy="24" r="13" fill="#090908"/><circle cx="15" cy="22.5" r="4" fill="#fff"/><circle cx="25" cy="22.5" r="4" fill="#fff"/><circle cx="15.6" cy="22.8" r="2" fill="#090908"/><circle cx="25.6" cy="22.8" r="2" fill="#090908"/><rect x="18.3" y="28" width="3.4" height="2.4" rx="1" fill="#fff"/></svg></span><span class="rc-mix-label">Mix Center</span>`;
      el.setAttribute("aria-hidden", "true");
      new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([MIX_CENTER.lng, MIX_CENTER.lat]).addTo(map);

      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 14, className: "rc-popup" });

      // frame the whole island (or the hub we were asked to open) now that the container has its final size
      // (a hub from the URL is flown to by the selection effect below)
      if (!initialHubRef.current) map.fitBounds(SRI_LANKA_BOUNDS, { padding: padding(), duration: 0 });

      // keep the whole island framed when the container resizes, until the visitor moves the map
      map.on("movestart", (e: { originalEvent?: Event }) => {
        if (e.originalEvent) userMoved.current = true;
      });
      map.on("resize", () => {
        if (!userMoved.current && !selectedRef.current) map.fitBounds(SRI_LANKA_BOUNDS, { padding: padding(), duration: 0 });
      });

      setLayersReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [map]);

  /* ---------- hover + click on the map ---------- */
  useEffect(() => {
    if (!map || !layersReady) return;
    const canvas = map.getCanvas();

    const setHubHover = (id: string | null) => {
      if (hoveredHub.current === id) return;
      if (hoveredHub.current) map.setFeatureState({ source: "hubs", id: hoveredHub.current }, { hover: false });
      hoveredHub.current = id;
      if (id) map.setFeatureState({ source: "hubs", id }, { hover: true });
    };

    const onMove = (e: { point: { x: number; y: number }; lngLat: { lng: number; lat: number } }) => {
      const hub = map.queryRenderedFeatures([e.point.x, e.point.y], { layers: ["hubs"] })[0] as MapGeoJSONFeature | undefined;
      if (hub) {
        const id = String(hub.properties.id);
        setHubHover(id);
        canvas.style.cursor = "pointer";
        const h = hubById(id)!;
        popupRef.current
          ?.setLngLat([h.lng, h.lat])
          .setHTML(`<strong>${h.name}</strong><span>${zoneById(h.zone).name} · ${h.district}</span>`)
          .addTo(map);
      } else {
        setHubHover(null);
        popupRef.current?.remove();
        canvas.style.cursor = "";
      }

      const d = map.queryRenderedFeatures([e.point.x, e.point.y], { layers: ["district-fill"] })[0];
      const did = d?.id ?? null;
      if (did !== hoveredDistrictId.current) {
        if (hoveredDistrictId.current !== null) map.setFeatureState({ source: "districts", id: hoveredDistrictId.current }, { hover: false });
        hoveredDistrictId.current = did;
        if (did !== null) map.setFeatureState({ source: "districts", id: did }, { hover: true });
        setHoverDistrict(d ? { district: String(d.properties.district), zone: d.properties.zone as ZoneId } : null);
      }
    };
    const onLeave = () => {
      setHubHover(null);
      popupRef.current?.remove();
      if (hoveredDistrictId.current !== null) map.setFeatureState({ source: "districts", id: hoveredDistrictId.current }, { hover: false });
      hoveredDistrictId.current = null;
      setHoverDistrict(null);
    };
    const onClick = (e: { point: { x: number; y: number } }) => {
      const hub = map.queryRenderedFeatures([e.point.x, e.point.y], { layers: ["hubs"] })[0];
      if (hub) {
        const h = hubById(String(hub.properties.id))!;
        setZone(h.zone);
        setSelectedId(h.id);
        return;
      }
      const d = map.queryRenderedFeatures([e.point.x, e.point.y], { layers: ["district-fill"] })[0];
      if (d && districts) {
        const z = d.properties.zone as ZoneId;
        setSelectedId(null);
        setZone(z);
        const b = bboxOf(districts, (p) => p.district === d.properties.district);
        if (b) map.fitBounds(b, { padding: padding(), maxZoom: 10, duration: reduce ? 0 : 900 });
      }
    };

    map.on("mousemove", onMove);
    map.on("mouseout", onLeave);
    map.on("click", onClick);
    return () => {
      map.off("mousemove", onMove);
      map.off("mouseout", onLeave);
      map.off("click", onClick);
    };
  }, [map, layersReady, districts, reduce]);

  /* ---------- zone filter → paint ---------- */
  useEffect(() => {
    if (!map || !layersReady) return;
    map.setPaintProperty("district-fill", "fill-opacity", fillOpacity(zone) as never);
    map.setPaintProperty("hubs", "circle-opacity", dimByZone(zone, 1, 0.25) as never);
    map.setPaintProperty("hubs", "circle-stroke-opacity", dimByZone(zone, 1, 0.25) as never);
    map.setPaintProperty("spokes", "line-opacity", dimByZone(zone, 0.32, 0.06) as never);
  }, [map, layersReady, zone]);

  /* ---------- selection → camera, halo, route, url ---------- */
  useEffect(() => {
    if (!map || !layersReady) return;
    const id = selected?.id ?? "";
    map.setFilter("hub-halo", ["==", ["get", "id"], id]);
    map.setFilter("hub-label-selected", ["==", ["get", "id"], id]);
    (map.getSource("selection") as GeoJSONSource).setData(selected ? selectionRoute(selected) : empty);
    if (selected) {
      const p = padding();
      map.flyTo({
        center: [selected.lng, selected.lat],
        zoom: Math.max(map.getZoom(), 8.6),
        // shift the target so it lands in the visible part of the map, without persisting map padding
        offset: [(p.left - p.right) / 2, (p.top - p.bottom) / 2],
        speed: 0.9,
        curve: 1.5,
        // omit duration entirely unless we need it: an explicit `undefined` makes flyTo animate to NaN
        ...(reduce ? { duration: 0 } : {}),
      });
    }
    if (syncUrl) {
      const url = new URL(window.location.href);
      if (selected) url.searchParams.set("hub", selected.id);
      else url.searchParams.delete("hub");
      window.history.replaceState(null, "", url);
    }
  }, [map, layersReady, selected, syncUrl, reduce]);

  /* ---------- zone chip → camera ---------- */
  const chooseZone = useCallback(
    (z: Filter) => {
      setZone(z);
      setSelectedId(null);
      setNearest(null);
      if (!map) return;
      if (z === "all") {
        map.fitBounds(SRI_LANKA_BOUNDS, { padding: padding(), duration: reduce ? 0 : 900 });
      } else if (districts) {
        const b = bboxOf(districts, (p) => p.zone === z);
        if (b) map.fitBounds(b, { padding: padding(), duration: reduce ? 0 : 900 });
      }
    },
    [map, districts, reduce],
  );

  /* ---------- parcels moving along the trunk routes ---------- */
  useEffect(() => {
    if (!map || !layersReady) return;
    const src = map.getSource("parcels") as GeoJSONSource;
    const frame = (t: number): GeoJSON.FeatureCollection => ({
      type: "FeatureCollection",
      features: trunks.flatMap((line, i) => {
        const a = (t / 5200 + i * 0.27) % 1;
        const b = (t / 5200 + i * 0.27 + 0.5) % 1;
        return [
          { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: pointAlong(line, a) } },
          { type: "Feature", properties: {}, geometry: { type: "Point", coordinates: pointAlong(line, 1 - b) } },
        ];
      }),
    });
    if (reduce) {
      src.setData(frame(2600));
      return;
    }
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (wrapperRef.current) io.observe(wrapperRef.current);
    const tick = (t: number) => {
      if (visible && !document.hidden) src.setData(frame(t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [map, layersReady, reduce]);

  /* ---------- list hover → highlight pin ---------- */
  const previewHub = (id: string | null) => {
    if (!map || !layersReady) return;
    if (hoveredHub.current) map.setFeatureState({ source: "hubs", id: hoveredHub.current }, { hover: false });
    hoveredHub.current = id;
    if (id) map.setFeatureState({ source: "hubs", id }, { hover: true });
  };

  const pick = (h: Hub) => {
    setZone(h.zone);
    setSelectedId(h.id);
  };

  /* ---------- geolocation ---------- */
  const userMarker = useRef<{ remove: () => void } | null>(null);
  function locate() {
    if (!("geolocation" in navigator)) {
      toast("Your browser can't share your location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocating(false);
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const list = nearestHubs(here, 3);
        setNearest(list);
        setSelectedId(null);
        setZone("all");
        if (list[0].km > 120) toast("You look to be outside Sri Lanka. Showing the closest hubs anyway.");
        if (map) {
          const maplibregl = await import("maplibre-gl");
          userMarker.current?.remove();
          const el = document.createElement("div");
          el.className = "rc-me";
          el.setAttribute("aria-hidden", "true");
          userMarker.current = new maplibregl.Marker({ element: el }).setLngLat([here.lng, here.lat]).addTo(map);
          const pts = [here, ...list.map((x) => x.hub)];
          const lngs = pts.map((p) => p.lng);
          const lats = pts.map((p) => p.lat);
          map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
            padding: padding(),
            maxZoom: 11,
            duration: reduce ? 0 : 1000,
          });
        }
      },
      (err) => {
        setLocating(false);
        toast(err.code === err.PERMISSION_DENIED ? "Location permission was declined." : "We couldn't find your location. Try searching instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  async function copyLink(h: Hub) {
    const url = `${window.location.origin}/network?hub=${h.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied");
    } catch {
      toast(url);
    }
  }

  const zoom = (d: number) => {
    userMoved.current = true;
    map?.easeTo({ zoom: map.getZoom() + d, duration: reduce ? 0 : 300 });
  };
  const reset = () => {
    userMoved.current = false;
    setSelectedId(null);
    setNearest(null);
    chooseZone("all");
  };
  const fullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().then(() => setTimeout(() => map?.resize(), 50)).catch(() => {});
  };

  return (
    <div ref={wrapperRef} className={`relative bg-[#f5f0e8] text-ink ${className}`}>
      {/* ---------- map ---------- */}
      <div className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-[1.75rem] border border-black/10 lg:h-[680px] lg:min-h-0 [:fullscreen_&]:h-full [:fullscreen_&]:rounded-none">
        {/* maplibre forces position:relative on this element, so size it explicitly */}
        <div ref={containerRef} className="h-full w-full" />
        <p className="sr-only">
          Interactive map of RedCat&rsquo;s network. Every hub on the map is also in the list next to it, which works with a keyboard and screen reader.
        </p>

        <AnimatePresence>
          {status !== "ready" && status !== "error" && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 grid place-items-center bg-paper lg:pl-[420px]"
            >
              <CatLoader label="Fetching the island…" />
            </motion.div>
          )}
        </AnimatePresence>

        {status === "error" && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div className="max-w-sm rounded-2xl bg-white p-6 shadow-lg">
              <p className="font-bold">The map couldn&rsquo;t load.</p>
              <p className="mt-1 text-sm text-ink/70">Your browser may not support WebGL, or you&rsquo;re offline. The hub list still works.</p>
            </div>
          </div>
        )}

        {/* controls */}
        <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/90 shadow-lg shadow-black/5 backdrop-blur">
          <MapButton label="Zoom in" onClick={() => zoom(1)}><Plus size={18} /></MapButton>
          <MapButton label="Zoom out" onClick={() => zoom(-1)}><Minus size={18} /></MapButton>
          <MapButton label="Show the whole island" onClick={reset}><span className="text-[11px] font-extrabold">LK</span></MapButton>
          <MapButton label="Full screen" onClick={fullscreen}><Maximize2 size={16} /></MapButton>
        </div>

        {/* hover readout */}
        <AnimatePresence>
          {hoverDistrict && (
            <motion.div
              key={hoverDistrict.district}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18 }}
              aria-hidden
              className="pointer-events-none absolute bottom-10 right-3 z-10 flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg lg:bottom-4"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: zoneById(hoverDistrict.zone).color }} />
              {hoverDistrict.district} District · {zoneById(hoverDistrict.zone).name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- panel ---------- */}
      <div className="mt-4 flex flex-col rounded-[1.5rem] border border-black/10 bg-white/95 shadow-xl shadow-black/10 backdrop-blur-xl lg:absolute lg:bottom-4 lg:left-4 lg:top-4 lg:mt-0 lg:w-[400px]">
        <div className="border-b border-black/5 p-4">
          <div className="flex gap-2">
            <label className="group relative flex-1">
              <span className="sr-only">Search hubs by town or district</span>
              <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50 transition group-focus-within:text-ink" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setNearest(null);
                  if (selected) setSelectedId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) pick(results[0]);
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder="Search 57 hubs"
                className="w-full rounded-xl border-2 border-transparent bg-mist py-3 pl-10 pr-9 text-[15px] font-medium outline-none transition placeholder:text-ink/45 focus:border-ink focus:bg-white"
              />
              {query && (
                <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink/60 hover:bg-black/5">
                  <X size={16} />
                </button>
              )}
            </label>
            <button
              type="button"
              onClick={locate}
              disabled={locating}
              className="press flex shrink-0 items-center gap-2 rounded-xl bg-ink px-3.5 text-sm font-bold text-white transition hover:bg-brand-deep disabled:opacity-70"
            >
              <LocateFixed size={17} className={locating ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{locating ? "Locating" : "Near me"}</span>
              <span className="sr-only sm:hidden">Find hubs near me</span>
            </button>
          </div>

          <div role="group" aria-label="Filter by zone" className="mt-3 flex flex-wrap gap-1.5">
            <Chip active={zone === "all"} onClick={() => chooseZone("all")}>All · {HUBS.length}</Chip>
            {ZONES.map((z) => (
              <Chip key={z.id} active={zone === z.id} onClick={() => chooseZone(z.id)} color={z.color}>
                {z.center} · {hubsInZone(z.id).length}
              </Chip>
            ))}
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {selected ? (
              <motion.div
                key={`hub-${selected.id}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                className="h-full overflow-y-auto p-4"
                aria-live="polite"
              >
                <HubCard hub={selected} onBack={() => setSelectedId(null)} onCopy={() => copyLink(selected)} />
              </motion.div>
            ) : nearest ? (
              <motion.div key="nearest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto p-4" aria-live="polite">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Closest to you</p>
                <ul className="mt-3 space-y-2">
                  {nearest.map(({ hub, km }, i) => (
                    <li key={hub.id}>
                      <HubRow hub={hub} meta={`${km < 10 ? km.toFixed(1) : Math.round(km)} km away`} badge={i === 0 ? "Nearest" : undefined} onPick={pick} onHover={previewHub} />
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => setNearest(null)} className="mt-4 text-sm font-semibold underline underline-offset-4">
                  Show all hubs
                </button>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col">
                <p className="px-4 pt-3 text-xs font-bold uppercase tracking-[0.14em] text-ink/55" aria-live="polite">
                  {results.length} {results.length === 1 ? "hub" : "hubs"}
                  {query ? ` matching “${query}”` : zone === "all" ? " island-wide" : ` in ${zoneById(zone).name}`}
                </p>
                <ul className="max-h-[340px] flex-1 space-y-1 overflow-y-auto p-2 lg:max-h-none">
                  {results.map((h) => (
                    <li key={h.id}>
                      <HubRow hub={h} meta={`${h.district} · ${h.km === 0 ? "zone center" : `${h.km} km to ${zoneById(h.zone).center}`}`} onPick={pick} onHover={previewHub} />
                    </li>
                  ))}
                  {results.length === 0 && (
                    <li className="px-3 py-8 text-center text-ink/60">
                      No hubs match that. Try a district name, or use <strong>Near me</strong>.
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MapButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center border-b border-black/5 text-ink transition last:border-0 hover:bg-mist active:scale-90"
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`press flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${
        active ? "border-ink bg-ink text-white" : "border-black/10 bg-white hover:border-ink/40"
      }`}
    >
      {color && <span className="h-2.5 w-2.5 rounded-full ring-1 ring-black/20" style={{ background: color }} />}
      {children}
    </button>
  );
}

function HubRow({
  hub,
  meta,
  badge,
  onPick,
  onHover,
}: {
  hub: Hub;
  meta: string;
  badge?: string;
  onPick: (h: Hub) => void;
  onHover: (id: string | null) => void;
}) {
  const z = zoneById(hub.zone);
  return (
    <button
      type="button"
      onClick={() => onPick(hub)}
      onMouseEnter={() => onHover(hub.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(hub.id)}
      onBlur={() => onHover(null)}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-mist focus-visible:bg-mist"
    >
      <span className="h-8 w-1.5 shrink-0 rounded-full transition-all group-hover:h-9" style={{ background: z.color }} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-bold">
          {hub.name}
          {badge && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">{badge}</span>}
        </span>
        <span className="block truncate text-sm text-ink/60">{meta}</span>
      </span>
      <ArrowRight size={16} className="shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
    </button>
  );
}

function HubCard({ hub, onBack, onCopy }: { hub: Hub; onBack: () => void; onCopy: () => void }) {
  const z = zoneById(hub.zone);
  const [copied, setCopied] = useState(false);
  const steps = [
    `${hub.name} hub`,
    ...(hub.km > 0 ? [`${z.center} zone`] : []),
    ...(z.id !== "A" ? ["Peliyagoda Mix Center"] : []),
  ];
  return (
    <div>
      <button type="button" onClick={onBack} className="press -ml-1 flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-ink/70 transition hover:bg-mist hover:text-ink">
        <ArrowLeft size={16} /> All hubs
      </button>

      <div className="mt-3 overflow-hidden rounded-2xl border border-black/10">
        <div className="h-1.5" style={{ background: z.color }} />
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">
            {hub.id} · {z.name}
          </p>
          <h3 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">{hub.name}</h3>
          <p className="text-ink/70">{hub.district} District</p>

          <dl className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-mist p-3">
              <dt className="text-xs font-semibold text-ink/60">To zone center</dt>
              <dd className="text-xl font-extrabold">{hub.km === 0 ? "On site" : `${hub.km} km`}</dd>
            </div>
            <div className="rounded-xl bg-mist p-3">
              <dt className="text-xs font-semibold text-ink/60">Delivery</dt>
              <dd className="text-xl font-extrabold">Next day</dd>
            </div>
          </dl>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Into the network</p>
          <ol className="mt-2 space-y-1.5">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2.5 text-sm font-semibold">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-extrabold ${i === 0 ? "bg-ink text-white" : "border-2 border-ink/20"}`}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link
          href={`/contact?topic=pickup&from=${encodeURIComponent(hub.name)}`}
          className="press flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-deep"
        >
          <Send size={16} /> Send from here
        </Link>
        <button
          type="button"
          onClick={() => {
            onCopy();
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className="press flex items-center justify-center gap-2 rounded-xl border-2 border-ink/15 px-4 py-3 text-sm font-bold transition hover:border-ink"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? "Copied" : "Share"}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink/55">The pin marks the town. Ask us for the hub&rsquo;s street address.</p>
    </div>
  );
}
