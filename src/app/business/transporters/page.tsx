"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import { useToast } from "@/components/Toast";

interface Match {
  id: number;
  match_score: number;
  from_city: string;
  to_city: string;
  ship_from?: string;
  ship_to?: string;
  capacity_available: number;
  departure_time: string;
  estimated_cost: number;
  transporter_name: string;
  vehicle_number: string;
  vehicle_type: string;
}

export default function TransportersPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const { showToast, ToastComponent } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/matches").then((r) => r.json()).then(setMatches);
  }, []);

  const book = async (matchId: number) => {
    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match_id: matchId, action: "book" }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed"); return; }
    showToast("Booked! Redirecting to tracking...");
    router.push(`/tracking/${data.trip_id}`);
  };

  return (
    <div>
      {ToastComponent}
      <p className="section-label">Matching</p>
      <h1 className="page-heading mb-2">Available Transporters</h1>
      <p className="text-sage-500 mb-6">Return-route trucks matching your shipments</p>

      {matches.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sage-500">No matching transporters yet. Create a shipment first.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map((m) => (
            <div key={m.id} className="card-hover flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold">{m.from_city} → {m.to_city}</h3>
                  <MatchScoreBadge score={m.match_score} size="sm" />
                </div>
                <p className="text-sm text-sage-500">
                  {m.transporter_name} · {m.vehicle_number} ({m.vehicle_type}) · {m.capacity_available} tons
                </p>
                <p className="text-sm text-sage-500">Departure: {new Date(m.departure_time).toLocaleString()}</p>
                <p className="text-sm font-medium text-moss mt-1">Est. Cost: ₹{m.estimated_cost.toLocaleString("en-IN")}</p>
              </div>
              <button onClick={() => book(m.id)} className="btn-secondary shrink-0">Book</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
