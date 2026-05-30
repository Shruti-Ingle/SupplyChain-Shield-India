"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CheckCircle, Circle, Truck } from "lucide-react";
import { useToast } from "@/components/Toast";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), { ssr: false });

interface TripDetail {
  id: number;
  from_city: string;
  to_city: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  current_lat: number;
  current_lng: number;
  status: string;
  eta: string;
  distance_remaining: number;
  cargo_type: string;
  weight: number;
  transporter_name: string;
  business_name: string;
}

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "picked_up", label: "Picked Up" },
  { key: "in_transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

export default function TrackingPage() {
  const params = useParams();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const { showToast, ToastComponent } = useToast();

  const load = useCallback(() => {
    fetch(`/api/trips?id=${tripId}`).then((r) => r.json()).then(setTrip);
  }, [tripId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!trip || trip.status === "delivered" || trip.status === "cancelled") return;
    const interval = setInterval(async () => {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: parseInt(tripId) }),
      });
      const updated = await res.json();
      setTrip((prev) => prev ? { ...prev, ...updated } : updated);
    }, 5000);
    return () => clearInterval(interval);
  }, [trip?.status, tripId]);

  if (!trip) {
    return <div className="min-h-screen flex items-center justify-center">Loading tracking...</div>;
  }

  const stepIndex = STEPS.findIndex((s) => s.key === trip.status);
  const currentStep = stepIndex >= 0 ? stepIndex : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {ToastComponent}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold">Shipment Tracking #{trip.id}</h1>
          <p className="text-sm text-gray-500">{trip.from_city} → {trip.to_city} · {trip.cargo_type} · {trip.weight} tons</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <TrackingMap
          fromLat={trip.from_lat}
          fromLng={trip.from_lng}
          toLat={trip.to_lat}
          toLng={trip.to_lng}
          currentLat={trip.current_lat}
          currentLng={trip.current_lng}
          height="400px"
        />

        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">ETA</p>
            <p className="font-bold">{trip.eta ? new Date(trip.eta).toLocaleString() : "Calculating..."}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Distance Remaining</p>
            <p className="font-bold">{Math.round(trip.distance_remaining || 0)} km</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-bold capitalize flex items-center gap-2">
              <Truck size={18} className="text-saffron-500" />
              {trip.status.replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold mb-4">Delivery Progress</h2>
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {i > 0 && <div className={`flex-1 h-0.5 ${i <= currentStep ? "bg-india-green" : "bg-gray-200"}`} />}
                  {i <= currentStep ? (
                    <CheckCircle className="text-india-green shrink-0" size={28} />
                  ) : (
                    <Circle className="text-gray-300 shrink-0" size={28} />
                  )}
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-india-green" : "bg-gray-200"}`} />}
                </div>
                <p className={`text-xs mt-2 text-center ${i <= currentStep ? "text-india-green font-medium" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Transporter</p>
            <p className="font-medium">{trip.transporter_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business</p>
            <p className="font-medium">{trip.business_name}</p>
          </div>
          <button
            onClick={() => showToast("Demo mode – Proof of Delivery PDF generated")}
            className="btn-outline text-sm self-start"
          >
            Download Proof of Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
