"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Map as MLMap, MapOptions, StyleSpecification } from "maplibre-gl";

// Free, keyless vector tiles (OpenStreetMap data via OpenMapTiles). Commercial use is allowed.
// To switch provider (e.g. MapTiler or Mapbox) replace this URL with that provider's style URL.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export const SRI_LANKA_BOUNDS: [[number, number], [number, number]] = [
  [79.42, 5.85],
  [82.05, 9.9],
];

export const INK = "#090908";
export const BRAND = "#ff4d4d";

/** Recolour the neutral basemap so it reads as RedCat's: warm paper land, soft blue water. */
function restyle(style: StyleSpecification): StyleSpecification {
  const paint: Record<string, Record<string, unknown>> = {
    background: { "background-color": "#f5f0e8" },
    water: { "fill-color": "#cfe1ec" },
    park: { "fill-color": "#e7ecdf" },
    landuse_residential: { "fill-color": "#efe8de" },
    landcover_wood: { "fill-color": "#e3eadb" },
    building: { "fill-color": "#ebe3d8", "fill-outline-color": "#e0d6c9" },
  };
  return {
    ...style,
    layers: style.layers
      // country/state labels outside Sri Lanka add noise at the zooms we use
      .filter((l) => !["label_country_1", "label_country_2", "label_country_3", "label_state"].includes(l.id))
      .map((l) => (paint[l.id] ? ({ ...l, paint: { ...(l as { paint?: object }).paint, ...paint[l.id] } } as typeof l) : l)),
  };
}

type Status = "idle" | "loading" | "ready" | "error";

/**
 * Lazily creates a MapLibre map once the container scrolls near the viewport.
 * maplibre-gl (~800 KB) is only downloaded at that point.
 */
export function useRedCatMap(
  container: RefObject<HTMLDivElement | null>,
  options: Partial<MapOptions> = {},
  { eager = false }: { eager?: boolean } = {},
) {
  const mapRef = useRef<MLMap | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [ready, setReady] = useState<MLMap | null>(null);
  const optsRef = useRef(options);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    async function init() {
      setStatus("loading");
      try {
        const [maplibregl, styleRes] = await Promise.all([
          import("maplibre-gl"),
          fetch(STYLE_URL).then((r) => {
            if (!r.ok) throw new Error(`style ${r.status}`);
            return r.json() as Promise<StyleSpecification>;
          }),
        ]);
        if (cancelled || !el) return;
        maplibregl.setWorkerUrl(`/vendor/maplibre-gl-worker.mjs?v=${maplibregl.getVersion()}`);
        const map = new maplibregl.Map({
          container: el,
          style: restyle(styleRes),
          bounds: SRI_LANKA_BOUNDS,
          fitBoundsOptions: { padding: 24 },
          // no maxBounds: on wide containers it forces a zoom that crops the island
          minZoom: 5,
          maxZoom: 15,
          attributionControl: { compact: true, customAttribution: "Boundaries: geoBoundaries" },
          dragRotate: false,
          pitchWithRotate: false,
          ...optsRef.current,
        });
        map.touchZoomRotate.disableRotation();
        mapRef.current = map;
        // Reveal as soon as the style is usable; our own layers draw instantly while basemap tiles stream in.
        let shown = false;
        const reveal = () => {
          if (cancelled || shown) return;
          shown = true;
          // MapLibre opens the compact attribution at first; keep it collapsed to the (i) button
          el.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
          setReady(map);
          setStatus("ready");
        };
        map.once("style.load", reveal);
        map.once("load", () => {
          reveal();
          el.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
        });
        map.on("error", (e) => console.warn("[map]", e.error?.message ?? e));
      } catch (err) {
        console.warn("[map] failed to start", err);
        if (!cancelled) setStatus("error");
      }
    }
    // start downloading the library early (when the browser is idle) so the map appears fast on scroll
    const warm = () => import("maplibre-gl");
    const idle = "requestIdleCallback" in window ? window.requestIdleCallback(warm, { timeout: 2500 }) : setTimeout(warm, 1200);

    if (eager || typeof IntersectionObserver === "undefined") {
      init();
    } else {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            io?.disconnect();
            init();
          }
        },
        { rootMargin: "400px" },
      );
      io.observe(el);
    }

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle as number);
      else clearTimeout(idle);
      io?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(null);
    };
  }, [container, eager]);

  return { map: ready, status };
}
