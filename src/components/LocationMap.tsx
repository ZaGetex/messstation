"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

type LatLng = {
  lat: number;
  lng: number;
};

type LocationMapProps = {
  query: string;
  height?: number;
  zoom?: number;
};

// Dynamische Imports, um SSR-Probleme mit Leaflet zu vermeiden
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const ZoomControl = dynamic(
  () => import("react-leaflet").then((m) => m.ZoomControl),
  { ssr: false }
);

// Modern custom marker creation
const createModernMarker = async () => {
  const L = (await import("leaflet")).default;

  // Create a modern SVG marker
  const createSVGIcon = (color: string = "#123a98") => {
    const svgIcon = `
      <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.3"/>
          </filter>
        </defs>
        <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z" 
              fill="${color}" 
              filter="url(#shadow)"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="${color}"/>
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: "custom-marker",
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      popupAnchor: [0, -40],
    });
  };

  return createSVGIcon();
};

export default function LocationMap({
  query,
  height = 200,
  zoom = 12,
}: LocationMapProps) {
  const [center, setCenter] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;

    const geocode = async () => {
      setError(null);
      try {
        // Create modern custom marker
        const icon = await createModernMarker();
        if (!cancelled) {
          setCustomIcon(icon);
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`;
        const res = await fetch(url, {
          headers: {
            // Nominatim wünscht eine Kennzeichnung der Anwendung
            "User-Agent": "messstation-web/0.1 (nextjs)",
          },
        });
        if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
        const json: Array<
          { lat: string; lon: string } & Record<string, unknown>
        > = await res.json();
        if (!cancelled) {
          if (json.length === 0) {
            setError("Ort nicht gefunden");
            setCenter(null);
            return;
          }
          setCenter({
            lat: parseFloat(json[0].lat),
            lng: parseFloat(json[0].lon),
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Unbekannter Fehler beim Geocoding");
        }
      }
    };

    geocode();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const mapStyle = useMemo(() => ({ height }), [height]);

  if (error) {
    return (
      <div className="text-sm text-accent-dark dark:text-accent-light">
        {error}
      </div>
    );
  }

  if (!center) {
    return (
      <div
        className="w-full overflow-hidden rounded-2xl border border-primary-50/30 dark:border-primary-200/50 shadow-sm bg-gradient-to-br from-primary-50/50 to-accent-light/30 dark:from-primary-600/20 dark:to-primary-700/30"
        style={mapStyle}
      >
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Modern loading animation */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 border-3 border-primary-200 dark:border-primary-300 border-t-primary-400 dark:border-t-primary-100 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-primary-300 dark:border-t-primary-200 rounded-full animate-spin"
                style={{ animationDelay: "0.15s", animationDuration: "0.8s" }}
              ></div>
            </div>
            <div className="text-primary-300 dark:text-primary-100 text-sm font-medium">
              Lade Karte…
            </div>
          </div>
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-to-br from-primary-400/10 to-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-primary-50/30 dark:border-primary-200/50 shadow-lg bg-white/80 dark:bg-primary-800/80 backdrop-blur-sm"
      style={mapStyle}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
        className="modern-map"
      >
        {/* Modern CartoDB Positron tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        <Marker position={[center.lat, center.lng]} icon={customIcon}>
          <Popup className="modern-popup">
            <div className="p-2 text-center">
              <div className="font-semibold text-primary-600 dark:text-primary-200 text-sm">
                {query}
              </div>
            </div>
          </Popup>
        </Marker>
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}
