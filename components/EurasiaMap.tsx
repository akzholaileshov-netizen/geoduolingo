"use client";

import type { MapShape } from "@/lib/eurasia-map";
import { mapView, regionFeatures, regionLand } from "@/lib/map-regions";

export type RegionTone = "idle" | "selected" | "correct" | "wrong" | "marked" | "muted" | "found" | "missed";

export type MapFlash = "yellow" | "orange" | "blink";

export type MapRegionState = {
  id: string;
  tone: RegionTone;
  letter?: string;
  interactive: boolean;
  effect?: MapFlash;
};

const paints: Record<RegionTone, { fill: string; stroke: string }> = {
  idle: { fill: "#ffffff", stroke: "#334155" },
  selected: { fill: "#58cc02", stroke: "#3f9200" },
  correct: { fill: "#58cc02", stroke: "#3f9200" },
  wrong: { fill: "#ff9d9d", stroke: "#d62828" },
  marked: { fill: "#7ec8f8", stroke: "#1899d6" },
  muted: { fill: "#ececec", stroke: "#b5b5b5" },
  found: { fill: "#FFFFFF", stroke: "#333333" },
  missed: { fill: "#EF4444", stroke: "#333333" },
};

const flashClass: Record<MapFlash, string> = {
  yellow: "map-flash-yellow",
  orange: "map-flash-orange",
  blink: "map-miss-pulse",
};

const landById = new Map(regionLand.map((shape) => [shape.id, shape]));
const featureById = new Map(regionFeatures.map((shape) => [shape.id, shape]));

export type MapFrame = { x: number; y: number; width: number; height: number };

export function EurasiaMap({
  active,
  onSelect,
  frame,
  selectAny = false,
}: {
  active: MapRegionState[];
  onSelect?: (id: string) => void;
  frame?: MapFrame;
  selectAny?: boolean;
}) {
  const view = frame ?? { x: 0, y: 0, width: mapView.width, height: mapView.height };
  const byId = new Map(active.map((region) => [region.id, region]));

  function paintFor(region: MapRegionState | undefined, hotspot: boolean) {
    const tone = region?.tone ?? "idle";
    const paint = paints[tone];
    if (hotspot && tone === "idle") return { fill: "#ffffff", stroke: "#1d4e89" };
    return paint;
  }

  function shapePath(shape: MapShape, hotspot: boolean) {
    const region = byId.get(shape.id);
    const paint = paintFor(region, hotspot);
    const interactive = Boolean(onSelect && region?.interactive !== false && (region?.interactive || selectAny));
    return (
      <path
        key={shape.id}
        d={shape.d}
        data-region-id={shape.id}
        data-tone={region?.tone ?? "idle"}
        data-effect={region?.effect ?? ""}
        className={region?.effect ? flashClass[region.effect] : undefined}
        fill={paint.fill}
        stroke={paint.stroke}
        strokeWidth={hotspot ? 2.6 : 1.4}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        fillRule="evenodd"
        pointerEvents={interactive ? "auto" : "none"}
        style={{ cursor: interactive ? "pointer" : "default", pointerEvents: interactive ? "auto" : "none" }}
        onClick={
          interactive
            ? () => {
                onSelect?.(shape.id);
              }
            : undefined
        }
      />
    );
  }

  const letters = active.filter((region) => region.letter);
  return (
    <svg
      data-testid="eurasia-map"
      viewBox={`${view.x} ${view.y} ${view.width} ${view.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full"
      role="group"
      aria-label="Еуразия картасы"
    >
      <rect x={view.x} y={view.y} width={view.width} height={view.height} fill="#d7ecff" />
      {regionLand.map((shape) => shapePath(shape, false))}
      {active.map((region) => {
        const shape = featureById.get(region.id);
        if (!shape) return null;
        return shapePath(shape, true);
      })}
      {letters.map((region) => {
        const shape = landById.get(region.id) ?? featureById.get(region.id);
        if (!shape || !region.letter) return null;
        const light =
          region.tone === "selected" ||
          region.tone === "correct" ||
          region.tone === "wrong" ||
          region.tone === "marked" ||
          region.tone === "missed";
        return (
          <text
            key={`letter-${region.id}`}
            x={shape.cx}
            y={shape.cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="36"
            fontWeight="800"
            fill={light ? "#ffffff" : "#1f2933"}
            pointerEvents="none"
          >
            {region.letter}
          </text>
        );
      })}
    </svg>
  );
}
