"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Trip {
  id: number;
  from_city: string;
  to_city: string;
  cargo_type: string;
  weight: number;
  business_name: string;
  status: string;
  created_at: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tab, setTab] = useState<"current" | "completed" | "upcoming">("current");

  useEffect(() => {
    fetch("/api/trips").then((r) => r.json()).then(setTrips);
  }, []);

  const filtered = trips.filter((t) => {
    if (tab === "completed") return t.status === "delivered";
    if (tab === "upcoming") return t.status === "pending";
    return !["delivered", "cancelled"].includes(t.status);
  });

  const statusLabel: Record<string, string> = {
    pending: "Pending Pickup",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Trips</h1>
      <div className="flex gap-2 mb-6">
        {(["current", "upcoming", "completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? "bg-saffron-500 text-white" : "bg-white text-gray-600 border"}`}>
            {t === "current" ? "Current Trips" : t === "upcoming" ? "Upcoming" : "Completed"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((t) => (
          <div key={t.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-bold">{t.from_city} → {t.to_city}</p>
              <p className="text-sm text-gray-500">{t.cargo_type} · {t.weight} tons · {t.business_name}</p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{statusLabel[t.status] || t.status}</span>
            </div>
            {t.status !== "delivered" && t.status !== "cancelled" && (
              <Link href={`/tracking/${t.id}`} className="btn-primary text-sm">View Tracking</Link>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No trips in this category.</p>}
      </div>
    </div>
  );
}
