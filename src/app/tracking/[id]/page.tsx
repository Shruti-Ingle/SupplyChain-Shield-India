"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CheckCircle, Circle, Truck, Leaf, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/Toast";
import ParticleField from "@/components/ParticleField";
import FadeIn from "@/components/FadeIn";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <Leaf className="text-sage-300 animate-pulse-soft" size={40} />
          <p className="text-sage-500">Loading tracking...</p>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === trip.status);
  const currentStep = stepIndex >= 0 ? stepIndex : 0;

  return (
    <div className="min-h-screen bg-cream">
      {ToastComponent}

      <div className="relative hero-gradient text-white overflow-hidden">
        <ParticleField count={20} variant="subtle" />
        <div className="relative max-w-5xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sage-200 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shipment #{trip.id}</h1>
          <p className="text-sage-200/90 mt-1">
            {trip.from_city} → {trip.to_city} · {trip.cargo_type} · {trip.weight} tons
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 -mt-2">
        <FadeIn>
          <div className="card p-2 shadow-card">
            <TrackingMap
              fromLat={trip.from_lat}
              fromLng={trip.from_lng}
              toLat={trip.to_lat}
              toLng={trip.to_lng}
              currentLat={trip.current_lat}
              currentLng={trip.current_lng}
              height="400px"
            />
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "ETA", value: trip.eta ? new Date(trip.eta).toLocaleString() : "Calculating..." },
              { label: "Distance Remaining", value: `${Math.round(trip.distance_remaining || 0)} km` },
              { label: "Status", value: trip.status.replace("_", " "), icon: Truck },
            ].map((item) => (
              <div key={item.label} className="stat-card">
                <p className="text-sm text-sage-500">{item.label}</p>
                <p className="font-bold text-sage-800 flex items-center gap-2 capitalize">
                  {item.icon && <item.icon size={18} className="text-moss" />}
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="card-hover">
            <h2 className="font-bold text-sage-900 mb-6">Delivery Progress</h2>
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div className={`flex-1 h-0.5 transition-colors duration-500 ${i <= currentStep ? "bg-sage-500" : "bg-sage-200"}`} />
                    )}
                    {i <= currentStep ? (
                      <CheckCircle className="text-moss shrink-0 transition-transform duration-300 hover:scale-110" size={28} />
                    ) : (
                      <Circle className="text-sage-200 shrink-0" size={28} />
                    )}
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 transition-colors duration-500 ${i < currentStep ? "bg-sage-500" : "bg-sage-200"}`} />
                    )}
                  </div>
                  <p className={`text-xs mt-2 text-center ${i <= currentStep ? "text-moss font-medium" : "text-sage-400"}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="card-hover flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="text-sm text-sage-500">Transporter</p>
              <p className="font-medium text-sage-800">{trip.transporter_name}</p>
            </div>
            <div>
              <p className="text-sm text-sage-500">Business</p>
              <p className="font-medium text-sage-800">{trip.business_name}</p>
            </div>
            <button
              onClick={() => showToast("Demo mode – Proof of Delivery PDF generated")}
              className="btn-outline text-sm self-start"
            >
              Download Proof of Delivery
            </button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
