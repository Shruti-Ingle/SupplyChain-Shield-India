"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import MatchScoreBadge from "@/components/MatchScoreBadge";
import { Truck, Route, PackageSearch, IndianRupee } from "lucide-react";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), { ssr: false });

interface Match {
  id: number;
  match_score: number;
  from_city: string;
  to_city: string;
  weight: number;
  estimated_revenue: number;
  business_name: string;
}

export default function TransporterDashboard() {
  const [stats, setStats] = useState({
    activeTrucks: 0,
    activeTrips: 0,
    availableMatches: 0,
    revenue: 0,
  });
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
    fetch("/api/matches").then((r) => r.json()).then((d) => setMatches(d.slice(0, 4)));
  }, []);

  const cards = [
    { icon: Truck, label: "Active Trucks", value: stats.activeTrucks },
    { icon: Route, label: "Active Trips", value: stats.activeTrips },
    { icon: PackageSearch, label: "Available Matches", value: stats.availableMatches },
    { icon: IndianRupee, label: "Monthly Earnings", value: `₹${(stats.revenue || 0).toLocaleString("en-IN")}` },
  ];

  return (
    <div>
      <p className="section-label">Overview</p>
      <h1 className="page-heading mb-8">Transporter Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <c.icon className="text-moss" size={24} />
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-2">
          <TrackingMap
            fromLat={19.076} fromLng={72.8777}
            toLat={23.0225} toLng={72.5714}
            markers={[
              { lat: 19.076, lng: 72.8777 },
              { lat: 18.5204, lng: 73.8567 },
              { lat: 21.1458, lng: 79.0882 },
            ]}
            height="300px"
          />
        </div>
        <div className="card-hover">
          <h2 className="font-bold mb-4 text-sage-900">Recent Match Requests</h2>
          {matches.length === 0 ? (
            <p className="text-sage-500 text-sm">No matches yet. Post a route to get started.</p>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => (
                <div key={m.id} className="border border-sage-100 rounded-xl p-3 hover:border-sage-200 hover:bg-sage-50/50 transition-all duration-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm text-sage-800">{m.from_city} → {m.to_city}</p>
                    <MatchScoreBadge score={m.match_score} size="sm" />
                  </div>
                  <p className="text-xs text-sage-500">{m.weight} tons · ₹{m.estimated_revenue.toLocaleString("en-IN")}</p>
                  <Link href="/transporter/matches" className="text-xs text-moss font-medium mt-2 inline-block hover:underline">
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
