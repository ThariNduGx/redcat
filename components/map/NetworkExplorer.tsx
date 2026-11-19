"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import type { LngLatBoundsLike, MapMouseEvent, PaddingOptions } from "maplibre-gl";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { DISTRICTS, HUBS, hubById, type Hub } from "@/data/hubs";
import { BRAND, INK, useRedCatMap } from "./useRedCatMap";

type Position = [number, number];
type Districts = FeatureCollection<Polygon | MultiPolygon, { district: string }>;
type DistrictOutline = number[][][];
type DistrictShape = { district: string; path: string };
type MapState = { boundaries: Districts; shapes: DistrictShape[] } | { error: true };

const hubs = [...HUBS].sort((a, b) => a.name.localeCompare(b.name));
const mapViewBox = "0 0 265 465";
const islandBounds: LngLatBoundsLike = [[79.64, 5.91], [81.89, 9.85]];
const water = "#cfe1ec";
const hubPoints: FeatureCollection<Point, { id: string; name: string; district: string }> = {
  type: "FeatureCollection",
  features: hubs.map(({ id, name, district, lng, lat }) => ({
    type: "Feature",
    properties: { id, name, district },
    geometry: { type: "Point", coordinates: [lng, lat] },
  })),
};

function project([lng, lat]: number[]): Position {
  return [6 + (lng - 79.64) * 112, 8 + (9.85 - lat) * 113];
}

function outerRings(geometry: Polygon | MultiPolygon): DistrictOutline {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.map(([outer]) => outer);
}

function outlinePath(rings: DistrictOutline, projectPoint: (point: number[]) => Position) {
  return rings.map((ring) => {
    const points = ring.map((point) => projectPoint(point).map((axis) => axis.toFixed(1)).join(","));
    return `M${points.join("L")}Z`;
  }).join("");
}

function toShape({ properties, geometry }: Districts["features"][number]): DistrictShape {
  return { district: properties.district, path: outlinePath(outerRings(geometry), project) };
}

export default function NetworkExplorer() {
  const hubId = useSearchParams().get("hub") ?? "";
  return <DistrictMap key={hubId} hubId={hubId} />;
}

function DistrictMap({ hubId }: { hubId: string }) {
  const initialHub = hubById(hubId);
  const [district, setDistrict] = useState(initialHub?.district ?? "");
  const [selectedHub, setSelectedHub] = useState(initialHub?.id ?? "");
  const [districtData, setDistrictData] = useState<MapState | null>(null);
  const hubList = useRef<HTMLUListElement>(null);
  const detailsHeading = useRef<HTMLHeadingElement>(null);
  const focusDetails = useRef(false);
  const returnToHub = useRef("");
  const visibleHubs = district ? hubs.filter((hub) => hub.district === district) : hubs;
  const activeHub = visibleHubs.find((hub) => hub.id === selectedHub);

  useEffect(() => {
    const request = new AbortController();
    fetch("/geo/districts.geojson", { signal: request.signal })
      .then((response) => {
        if (!response.ok) throw new Error("District boundaries unavailable");
        return response.json() as Promise<Districts>;
      })
      .then((boundaries) => setDistrictData({ boundaries, shapes: boundaries.features.map(toShape) }))
      .catch(() => {
        if (!request.signal.aborted) setDistrictData({ error: true });
      });
    return () => request.abort();
  }, []);

  useEffect(() => {
    if (activeHub && focusDetails.current) {
      focusDetails.current = false;
      detailsHeading.current?.focus();
    } else if (!activeHub && returnToHub.current) {
      hubList.current?.querySelector<HTMLButtonElement>(`[data-hub="${CSS.escape(returnToHub.current)}"]`)?.focus();
      returnToHub.current = "";
    }
  }, [activeHub]);

  const chooseHub = useCallback((id: string) => {
    if (detailsHeading.current?.dataset.hub === id) {
      detailsHeading.current.focus();
      return;
    }
    focusDetails.current = true;
    setSelectedHub(id);
  }, []);

  function closeHub() {
    returnToHub.current = selectedHub;
    setSelectedHub("");
  }

  const chooseDistrict = useCallback((name: string) => {
    setDistrict(name);
    setSelectedHub("");
  }, []);

  return (
    <div className="relative isolate grid overflow-hidden rounded-[1.75rem] bg-white shadow-xl shadow-ink/10 ring-1 ring-ink/10">
      <div className="relative order-2 flex h-[clamp(27rem,142vw,38rem)] items-center justify-center overflow-hidden bg-[#cfe1ec] lg:order-none lg:h-[clamp(42rem,55vw,48rem)] lg:pl-[23rem]">
        {districtData && "shapes" in districtData ? (
          <svg viewBox={mapViewBox} className="h-full w-full p-3 sm:p-4" aria-hidden="true">
            {districtData.shapes.map(({ district: name, path }) => (
              <path
                key={name}
                d={path}
                fill={name === district ? "#f8b9af" : "#fffaf3"}
                fillRule="evenodd"
                stroke="#817973"
                strokeWidth="0.7"
                className="cursor-pointer hover:fill-[#f8b9af]"
                onClick={() => chooseDistrict(name)}
              >
                <title>{name} District</title>
              </path>
            ))}
            {visibleHubs.map((hub) => {
              const [cx, cy] = project([hub.lng, hub.lat]);
              const active = selectedHub === hub.id;
              return (
                <circle key={hub.id} cx={cx} cy={cy} r={active ? 6 : 3.7} fill={active ? "#141210" : "#bb1c20"}
                  stroke="white" strokeWidth="1" className="cursor-pointer hover:fill-ink"
                  onClick={() => chooseHub(hub.id)}>
                  <title>{hub.name} · {hub.district} District</title>
                </circle>
              );
            })}
          </svg>
        ) : (
          <p role="status" className="text-sm text-ink/75">{districtData ? "Map unavailable. Browse hubs in the list." : "Loading district map…"}</p>
        )}
        <span className="absolute bottom-2 right-3 text-xs text-ink/70">Boundaries by geoBoundaries</span>
        {districtData && "boundaries" in districtData && (
          <DistrictBasemap boundaries={districtData.boundaries} district={district} selectedHub={selectedHub}
            onDistrict={chooseDistrict} onHub={chooseHub} />
        )}
        <span className="pointer-events-none absolute right-3 top-3 z-10 sm:right-5 sm:top-5 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-ink shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Regional hub
        </span>
      </div>

      <div className="contents lg:absolute lg:inset-y-4 lg:left-4 lg:z-20 lg:flex lg:w-[22rem] lg:flex-col lg:overflow-hidden lg:rounded-[1.35rem] lg:border lg:border-white lg:bg-white/95 lg:shadow-xl">
        <div className="order-1 p-5 lg:order-none lg:p-6">
          <label htmlFor="hub-district" className="block text-sm font-bold">Filter by district</label>
          <div className="relative mt-2">
            <select id="hub-district" className="w-full appearance-none rounded-xl border border-ink/25 bg-white py-3 pl-4 pr-10 font-semibold"
              value={district} onChange={(event) => chooseDistrict(event.target.value)}>
              <option value="">All 25 districts</option>
              {DISTRICTS.map((name) => <option key={name}>{name}</option>)}
            </select>
            <ChevronDown size={18} aria-hidden className="pointer-events-none absolute right-4 top-3.5" />
          </div>
          <p aria-live="polite" className="mt-3 text-sm text-ink/75">
            {visibleHubs.length} {visibleHubs.length === 1 ? "hub" : "hubs"}{district && ` in ${district}`}
          </p>
        </div>
        <div className="order-3 overflow-y-auto border-t border-ink/10 lg:order-none lg:min-h-0 lg:flex-1">
          {activeHub ? (
            <div className="p-4">
              <button type="button" onClick={closeHub} className="mb-3 flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold text-ink/70 hover:bg-mist hover:text-ink">
                <ArrowLeft size={16} aria-hidden /> Back to hubs
              </button>
              <HubDetails hub={activeHub} headingRef={detailsHeading} />
            </div>
          ) : (
            <ul ref={hubList} aria-label="Regional hubs" className="max-h-72 overflow-y-auto px-3 py-2 lg:max-h-none lg:overflow-visible">
              {visibleHubs.map((hub) => (
                <li key={hub.id}>
                  <button type="button" data-hub={hub.id} onClick={() => chooseHub(hub.id)}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-mist focus-visible:bg-mist">
                    <span aria-hidden="true" className="h-8 w-1.5 shrink-0 rounded-full bg-brand/75" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{hub.name}</span>
                      <span className="block text-sm text-ink/65">{hub.district} District</span>
                    </span>
                    <ArrowRight size={16} aria-hidden className="shrink-0 text-ink/40 transition group-hover:translate-x-0.5 group-hover:text-ink" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function HubDetails({ hub, headingRef }: { hub: Hub; headingRef: RefObject<HTMLHeadingElement | null> }) {
  const headingId = useId();
  const steps = [`${hub.name} hub`, "Overnight delivery network"];

  return (
    <article aria-labelledby={headingId} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div aria-hidden="true" className="h-1.5 bg-brand" />
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/60">Hub {hub.id}</p>
        <h3 id={headingId} ref={headingRef} tabIndex={-1} data-hub={hub.id}
          className="mt-1 text-[1.75rem] font-extrabold leading-tight tracking-tight focus:outline-none">
          {hub.name}
        </h3>
        <p className="mt-1 text-ink/70">{hub.district} District</p>

        <dl className="mt-4 rounded-xl bg-mist p-3">
          <dt className="text-xs font-semibold text-ink/65">Delivery</dt>
          <dd className="text-xl font-extrabold">Next day</dd>
        </dl>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-ink/60">Into the network</p>
        <ol className="mt-2 space-y-2" role="list">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2.5 text-sm font-semibold">
              <span aria-hidden="true" className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-extrabold ${index === 0 ? "bg-ink text-white" : "border-2 border-ink/20"}`}>
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function DistrictBasemap({ boundaries, district, selectedHub, onDistrict, onHub }: {
  boundaries: Districts;
  district: string;
  selectedHub: string;
  onDistrict: (name: string) => void;
  onHub: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const maskId = useId();
  const [visible, setVisible] = useState(false);
  const [hoverName, setHoverName] = useState("");
  const { map } = useRedCatMap(container, {
    bounds: islandBounds,
    fitBoundsOptions: { padding: 18 },
    renderWorldCopies: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragPan: false,
    keyboard: false,
    scrollZoom: false,
    touchPitch: false,
    touchZoomRotate: false,
  });

  useEffect(() => {
    if (!map) return;
    const canvas = map.getCanvas();
    const coastline = document.getElementById(maskId);
    const rings = boundaries.features.flatMap(({ geometry }) => outerRings(geometry));
    const drawMask = () => {
      coastline?.setAttribute("d", outlinePath(rings, ([lng, lat]) => {
        const point = map.project([lng, lat]);
        return [point.x, point.y];
      }));
    };
    const fitIsland = () => {
      const padding: PaddingOptions = {
        left: window.matchMedia("(min-width: 64rem)").matches ? 384 : 16,
        right: 18,
        top: 16,
        bottom: 18,
      };
      map.fitBounds(islandBounds, { padding, duration: 0 });
      drawMask();
    };
    fitIsland();
    const labelLayer = map.getStyle().layers.find((layer) => layer.type === "symbol")?.id;
    map.addSource("district-boundaries", { type: "geojson", data: boundaries });
    map.addLayer({
      id: "district-tint",
      type: "fill",
      source: "district-boundaries",
      filter: ["==", ["get", "district"], ""],
      paint: { "fill-color": BRAND, "fill-opacity": 0.24 },
    }, labelLayer);
    map.addLayer({
      id: "district-hit-area",
      type: "fill",
      source: "district-boundaries",
      paint: { "fill-color": "#fffaf3", "fill-opacity": 0.08 },
    }, labelLayer);
    map.addLayer({
      id: "district-outline",
      type: "line",
      source: "district-boundaries",
      paint: { "line-color": "#675953", "line-opacity": 0.58, "line-width": 1 },
    }, labelLayer);
    map.addSource("regional-hubs", { type: "geojson", data: hubPoints });
    map.addLayer({
      id: "selected-hub-halo",
      type: "circle",
      source: "regional-hubs",
      filter: ["==", ["get", "id"], ""],
      paint: { "circle-color": BRAND, "circle-opacity": 0.24, "circle-radius": 13, "circle-stroke-color": BRAND, "circle-stroke-width": 1 },
    });
    map.addLayer({
      id: "regional-hub-pins",
      type: "circle",
      source: "regional-hubs",
      paint: { "circle-color": BRAND, "circle-radius": 4.5, "circle-stroke-color": "#fff", "circle-stroke-width": 1.5 },
    });

    const reveal = () => {
      canvas.style.maskImage = `url(#${maskId}-region)`;
      setVisible(true);
    };
    const pinAtPoint = ({ point }: MapMouseEvent) => {
      const options = { layers: ["regional-hub-pins"] };
      return map.queryRenderedFeatures(point, options)[0] ?? map.queryRenderedFeatures(
        [[point.x - 6, point.y - 6], [point.x + 6, point.y + 6]], options,
      )[0];
    };
    const pick = (event: MapMouseEvent) => {
      const pin = pinAtPoint(event);
      if (pin) {
        onHub(String(pin.properties.id));
        return;
      }
      const [boundary] = map.queryRenderedFeatures(event.point, { layers: ["district-hit-area"] });
      if (boundary) onDistrict(String(boundary.properties.district));
    };
    const pointer = (event: MapMouseEvent) => {
      const pin = pinAtPoint(event);
      const [boundary] = map.queryRenderedFeatures(event.point, { layers: ["district-hit-area"] });
      canvas.style.cursor = pin || boundary ? "pointer" : "";
      setHoverName(pin ? String(pin.properties.name) : boundary ? `${boundary.properties.district} District` : "");
    };
    const clearHover = () => setHoverName("");
    map.once("idle", reveal);
    map.on("resize", fitIsland);
    map.on("click", pick);
    map.on("mousemove", pointer);
    map.on("mouseout", clearHover);

    return () => {
      map.off("idle", reveal);
      map.off("resize", fitIsland);
      map.off("click", pick);
      map.off("mousemove", pointer);
      map.off("mouseout", clearHover);
    };
  }, [map, boundaries, maskId, onDistrict, onHub]);

  useEffect(() => {
    if (!map?.getLayer("regional-hub-pins")) return;
    map.setFilter("district-tint", ["==", ["get", "district"], district]);
    map.setFilter("regional-hub-pins", district ? ["==", ["get", "district"], district] : null);
    map.setFilter("selected-hub-halo", ["==", ["get", "id"], selectedHub]);
    map.setPaintProperty("regional-hub-pins", "circle-color", ["case", ["==", ["get", "id"], selectedHub], INK, BRAND]);
    map.setPaintProperty("regional-hub-pins", "circle-radius", ["case", ["==", ["get", "id"], selectedHub], 7, 4.5]);
  }, [map, district, selectedHub]);

  return (
    <>
      <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
        <defs>
          <mask id={`${maskId}-region`} maskUnits="objectBoundingBox" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1" height="1">
            {/* Leave room over the surrounding water for coastal labels and pin halos. */}
            <path id={maskId} fill="white" stroke="white" strokeWidth="72" strokeLinejoin="round" />
          </mask>
        </defs>
      </svg>
      <div ref={container} aria-hidden={!visible} inert={!visible} style={{ backgroundColor: water }}
        className={`absolute inset-0 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      {visible && hoverName && (
        <p aria-hidden="true" className="pointer-events-none absolute bottom-10 right-4 z-10 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg">
          {hoverName}
        </p>
      )}
    </>
  );
}
