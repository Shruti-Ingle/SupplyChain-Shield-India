"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

interface TrackingMapProps {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  currentLat?: number;
  currentLng?: number;
  animate?: boolean;
  height?: string;
  markers?: { lat: number; lng: number; label?: string }[];
}

export default function TrackingMap({
  fromLat,
  fromLng,
  toLat,
  toLng,
  currentLat,
  currentLng,
  animate = false,
  height = "400px",
  markers,
}: TrackingMapProps) {
  const [pos, setPos] = useState({ lat: currentLat ?? fromLat, lng: currentLng ?? fromLng });
  const [icon, setIcon] = useState<L.Icon | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    import("leaflet").then((L) => {
      const truckIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setIcon(truckIcon);
    });
  }, []);

  useEffect(() => {
    if (currentLat !== undefined && currentLng !== undefined) {
      setPos({ lat: currentLat, lng: currentLng });
    }
  }, [currentLat, currentLng]);

  useEffect(() => {
    if (!animate) return;
    const steps = 20;
    const interval = setInterval(() => {
      stepRef.current = Math.min(stepRef.current + 1, steps);
      const t = stepRef.current / steps;
      setPos({
        lat: fromLat + (toLat - fromLat) * t,
        lng: fromLng + (toLng - fromLng) * t,
      });
      if (stepRef.current >= steps) clearInterval(interval);
    }, 5000);
    return () => clearInterval(interval);
  }, [animate, fromLat, fromLng, toLat, toLng]);

  const centerLat = (fromLat + toLat) / 2;
  const centerLng = (fromLng + toLng) / 2;

  if (!icon) {
    return (
      <div
        className="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"
        style={{ height }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={[
            [fromLat, fromLng],
            [toLat, toLng],
          ]}
          color="#FF9933"
          weight={4}
          opacity={0.7}
        />
        <Marker
          position={[fromLat, fromLng]}
          icon={icon}
        />
        {markers?.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={icon} />
        ))}
        <Marker position={[pos.lat, pos.lng]} icon={icon} />
      </MapContainer>
    </div>
  );
}
