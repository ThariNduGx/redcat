"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef } from "react";
import type { GeoJSONSource, Marker } from "maplibre-gl";
import { useReducedMotion } from "motion/react";
import type { Leg } from "@/lib/route";
import { arc } from "@/lib/geo";
import { BRAND, INK, useRedCatMap } from "./useRedCatMap";
import CatLoader from "@/components/ui/CatLoader";

function pathFor(route: Leg[]) {
  const segs = route.slice(1).map((leg, i) => arc([route[i].lng, route[i].lat], [leg.lng, leg.lat], i % 2 ? -0.16 : 0.16, 40));
  return segs;
}

/** A small map showing one parcel's route and where it is now. */
export default function RouteMap({ route, position, className = "" }: { route: Leg[]; position: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { map, status } = useRedCatMap(ref, { cooperativeGestures: true, interactive: true }, { eager: true });
  const parcel = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled) return;
      const segs = pathFor(route);
      const seg = Math.min(segs.length - 1, Math.floor(position));
      const frac = Math.min(1, position - seg);
      const cut = Math.round(frac * (segs[seg].length - 1));
      const done = [...segs.slice(0, seg).flat(), ...segs[seg].slice(0, cut + 1)];
      const todo = [...segs[seg].slice(cut), ...segs.slice(seg + 1).flat()];
      const here = done.length ? done[done.length - 1] : [route[0].lng, route[0].lat];

      const line = (coords: number[][]): GeoJSON.Feature => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } });
      const stops: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: route.map((l, i) => ({ type: "Feature", properties: { label: l.label, end: i === 0 || i === route.length - 1 ? 1 : 0 }, geometry: { type: "Point", coordinates: [l.lng, l.lat] } })),
      };

      const upsert = (id: string, data: GeoJSON.GeoJSON) => {
        const src = map.getSource(id) as GeoJSONSource | undefined;
        if (src) src.setData(data);
        else map.addSource(id, { type: "geojson", data });
      };
      upsert("todo", line(todo.length > 1 ? todo : [here, here]));
      upsert("done", line(done.length > 1 ? done : [here, here]));
      upsert("stops", stops);

      if (!map.getLayer("todo")) {
        map.addLayer({ id: "todo", type: "line", source: "todo", layout: { "line-cap": "round" }, paint: { "line-color": INK, "line-width": 3, "line-opacity": 0.45, "line-dasharray": [1, 2] } });
        map.addLayer({ id: "done", type: "line", source: "done", layout: { "line-cap": "round" }, paint: { "line-color": BRAND, "line-width": 5 } });
        map.addLayer({
          id: "stops",
          type: "circle",
          source: "stops",
          paint: { "circle-radius": ["case", ["==", ["get", "end"], 1], 7, 5], "circle-color": "#fff", "circle-stroke-color": INK, "circle-stroke-width": 2.5 },
        });
        map.addLayer({
          id: "stop-labels",
          type: "symbol",
          source: "stops",
          layout: { "text-field": ["get", "label"], "text-font": ["Noto Sans Bold"], "text-size": 12, "text-offset": [0, 1.2], "text-anchor": "top", "text-optional": true },
          paint: { "text-color": INK, "text-halo-color": "#fff", "text-halo-width": 1.8 },
        });
      }

      parcel.current?.remove();
      const el = document.createElement("div");
      el.className = "rc-parcel";
      el.setAttribute("aria-hidden", "true");
      parcel.current = new maplibregl.Marker({ element: el }).setLngLat(here as [number, number]).addTo(map);

      const lngs = route.map((l) => l.lng);
      const lats = route.map((l) => l.lat);
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        { padding: 60, maxZoom: 10, duration: reduce ? 0 : 800 },
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [map, route, position, reduce]);

  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-paper ${className}`}>
      <div ref={ref} className="h-full min-h-[inherit] w-full" aria-label="Map of this parcel's route" role="img" />
      {status !== "ready" && status !== "error" && (
        <div className="absolute inset-0 grid place-items-center bg-paper">
          <CatLoader label="Plotting the route…" />
        </div>
      )}
      {status === "error" && <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-ink/60">The route map couldn&rsquo;t load.</p>}
    </div>
  );
}
