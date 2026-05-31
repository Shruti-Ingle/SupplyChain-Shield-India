"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import { useToast } from "@/components/Toast";
import { Leaf, Fuel, IndianRupee } from "lucide-react";

interface Match {
  id: number;
  match_score: number;
  from_city: string;
  to_city: string;
  route_from: string;
  route_to: string;
  weight: number;
  cargo_type: string;
  estimated_revenue: number;
  fuel_saved: number;
  co2_saved: number;
  business_name: string;
}

function MatchesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = searchParams.get("route");
  const [matches, setMatches] = useState<Match[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { showToast, ToastComponent } = useToast();

  const load = () => {
    const url = routeId ? `/api/matches?route_id=${routeId}` : "/api/matches";
    fetch(url).then((r) => r.json()).then(setMatches);
  };

  useEffect(() => { load(); }, [routeId]);

  const accept = async (matchId: number) => {
    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ match_id: matchId, action: "accept" }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed"); return; }
    setConfirmId(null);
    showToast("Match accepted! Trip created.");
    router.push(`/tracking/${data.trip_id}`);
  };

  return (
    <div>
      {ToastComponent}
      <p className="section-label">AI matching</p>
      <h1 className="page-heading mb-2">AI-Generated Matches</h1>
      <p className="text-sage-500 mb-6">Best-fit loads for your empty return trips</p>

      {matches.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-sage-500">No matches found. Post an available route to get AI suggestions.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {matches.map((m) => (
            <div key={m.id} className="card-hover">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{m.from_city} → {m.to_city}</h3>
                    <MatchScoreBadge score={m.match_score} />
                  </div>
                  <p className="text-sm text-sage-500 mb-2">
                    Route: {m.route_from} → {m.route_to} · {m.weight} tons · {m.cargo_type}
                  </p>
                  <p className="text-sm text-sage-500">Customer: {m.business_name}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-green-700"><IndianRupee size={14} /> ₹{m.estimated_revenue.toLocaleString("en-IN")} revenue</span>
                    <span className="flex items-center gap-1 text-blue-700"><Fuel size={14} /> {m.fuel_saved}L saved</span>
                    <span className="flex items-center gap-1 text-moss"><Leaf size={14} /> {m.co2_saved} kg CO₂</span>
                  </div>
                </div>
                <button onClick={() => setConfirmId(m.id)} className="btn-primary shrink-0">Accept</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 bg-sage-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-card border border-sage-100">
            <h3 className="font-bold text-lg mb-2">Confirm Match</h3>
            <p className="text-sage-600 text-sm mb-4">Accept this shipment? It will become an active trip and be removed from other transporters.</p>
            <div className="flex gap-3">
              <button onClick={() => accept(confirmId)} className="btn-primary flex-1">Confirm</button>
              <button onClick={() => setConfirmId(null)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesContent />
    </Suspense>
  );
}
