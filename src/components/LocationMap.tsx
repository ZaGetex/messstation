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
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Leaflet Standard-Icon reparieren (Pfadprobleme in Next Bundling umgehen)
const fixLeafletDefaultIcon = async () => {
  const L = (await import("leaflet")).default;
  const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
  const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
  const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
  // @ts-ignore
  delete (L.Icon.Default as any).prototype._getIconUrl;
  L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
};

export default function LocationMap({ query, height = 200, zoom = 12 }: LocationMapProps) {
  const [center, setCenter] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const geocode = async () => {
      setError(null);
      try {
        // Leaflet Icon einmalig fixen
        await fixLeafletDefaultIcon();

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
        const res = await fetch(url, {
          headers: {
            // Nominatim wünscht eine Kennzeichnung der Anwendung
            "User-Agent": "messstation-web/0.1 (nextjs)"
          }
        });
        if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
        const json: Array<{ lat: string; lon: string } & Record<string, unknown>> = await res.json();
        if (!cancelled) {
          if (json.length === 0) {
            setError("Ort nicht gefunden");
            setCenter(null);
            return;
          }
          setCenter({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
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
      <div className="text-sm text-accent-dark dark:text-accent-light">{error}</div>
    );
  }

  if (!center) {
    return (
      <div className="w-full flex items-center justify-center" style={mapStyle}>
        <div className="text-primary-300 dark:text-primary-100 text-sm">Lade Karte…</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-primary-50/30 dark:border-primary-200/50 shadow-sm" style={mapStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <MapContainer center={[center.lat, center.lng]} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[center.lat, center.lng]}>
          <Popup>
            {query}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}


