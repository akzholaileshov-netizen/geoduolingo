"use client";

import { useEffect } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

declare global {
  interface Window {
    __geoMap?: LeafletMap;
  }
}

export type ChoicePin = {
  id: string;
  lat: number;
  lng: number;
  letter: string;
  tone: "idle" | "selected" | "correct" | "wrong" | "muted";
};

type Props = {
  center: [number, number];
  zoom: number;
  fitKey: string;
  userPin: { lat: number; lng: number } | null;
  userTone: "idle" | "selected" | "correct" | "wrong";
  onMapClick?: (lat: number, lng: number) => void;
  choices: ChoicePin[];
  onChoice?: (id: string) => void;
  highlight: { lat: number; lng: number } | null;
  reveal: { lat: number; lng: number; radiusKm: number } | null;
};

const toneStyle: Record<ChoicePin["tone"] | "idle" | "correct" | "wrong", { background: string; color: string }> = {
  idle: { background: "#ffffff", color: "#3c3c3c" },
  selected: { background: "#1cb0f6", color: "#ffffff" },
  correct: { background: "#58cc02", color: "#ffffff" },
  wrong: { background: "#ff4b4b", color: "#ffffff" },
  muted: { background: "#d4d4d4", color: "#777777" },
};

function markerIcon(background: string, color: string, label: string, choiceId: string, selected: boolean) {
  const size = selected ? 36 : 30;
  return L.divIcon({
    className: "geo-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div data-choice-id="${choiceId}" style="width:${size}px;height:${size}px;border-radius:999px;background:${background};color:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;line-height:1">${label}</div>`,
  });
}

function MapBridge({ fitKey, zoom }: { fitKey: string; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") window.__geoMap = map;
    const timer = window.setTimeout(() => {
      map.invalidateSize();
      if (!fitKey) return;
      const points = fitKey
        .split(";")
        .filter(Boolean)
        .map((pair) => pair.split(",").map(Number))
        .filter((pair) => pair.length === 2 && pair.every((value) => Number.isFinite(value)))
        .map((pair) => [pair[0], pair[1]] as [number, number]);
      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 7, animate: false });
      } else if (points.length === 1) {
        map.setView(points[0], zoom, { animate: false });
      }
    }, 50);
    return () => window.clearTimeout(timer);
  }, [map, fitKey, zoom]);
  return null;
}

function MapClicks({ enabled, onMapClick }: { enabled: boolean; onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      if (!enabled || !onMapClick) return;
      onMapClick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export default function LessonMap({
  center,
  zoom,
  fitKey,
  userPin,
  userTone,
  onMapClick,
  choices,
  onChoice,
  highlight,
  reveal,
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={2}
      maxZoom={12}
      className={`h-full w-full ${onMapClick ? "cursor-crosshair" : ""}`}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBridge fitKey={fitKey} zoom={zoom} />
      <MapClicks enabled={Boolean(onMapClick)} onMapClick={onMapClick} />
      {reveal ? (
        <>
          <Circle
            center={[reveal.lat, reveal.lng]}
            radius={reveal.radiusKm * 1000}
            pathOptions={{ color: "#46a302", weight: 2, fillColor: "#58cc02", fillOpacity: 0.16 }}
          />
          <Marker
            position={[reveal.lat, reveal.lng]}
            icon={markerIcon("#166534", "#ffffff", "✓", "", false)}
          />
        </>
      ) : null}
      {highlight ? (
        <Marker position={[highlight.lat, highlight.lng]} icon={markerIcon("#1cb0f6", "#ffffff", "?", "", true)} />
      ) : null}
      {choices.map((choice) => {
        const style = toneStyle[choice.tone];
        return (
          <Marker
            key={choice.id}
            position={[choice.lat, choice.lng]}
            icon={markerIcon(style.background, style.color, choice.letter, choice.id, choice.tone === "selected")}
            eventHandlers={{
              click: (event) => {
                L.DomEvent.stopPropagation(event.originalEvent);
                onChoice?.(choice.id);
              },
            }}
          />
        );
      })}
      {userPin ? (
        <Marker
          position={[userPin.lat, userPin.lng]}
          icon={markerIcon(toneStyle[userTone].background, "#ffffff", "", "", true)}
        />
      ) : null}
    </MapContainer>
  );
}
