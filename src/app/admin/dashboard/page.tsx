"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Users, Truck, Package, Route, Leaf, Fuel } from "lucide-react";

const TrackingMap = dynamic(() => import("@/components/TrackingMap"), { ssr: false });

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0, totalTrucks: 0, totalShipments: 0, activeRoutes: 0,
    fuel_saved: 0, co2_reduced: 0, activities: [] as { action: string; details: string; company_name: string; created_at: string }[],
  });

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers },
    { icon: Truck, label: "Total Trucks", value: stats.totalTrucks },
    { icon: Package, label: "Total Shipments", value: stats.totalShipments },
    { icon: Route, label: "Active Routes", value: stats.activeRoutes },
    { icon: Fuel, label: "Fuel Saved (L)", value: Math.round(stats.fuel_saved || 0) },
    { icon: Leaf, label: "CO₂ Reduced (kg)", value: Math.round(stats.co2_reduced || 0) },
  ];

  return (
    <div>
      <p className="section-label">Overview</p>
      <h1 className="page-heading mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <c.icon className="text-moss" size={24} />
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-2">
        <TrackingMap
          fromLat={28.7041} fromLng={77.1025}
          toLat={22.5726} toLng={88.3639}
          markers={[
            { lat: 19.076, lng: 72.8777 },
            { lat: 23.0225, lng: 72.5714 },
            { lat: 12.9716, lng: 77.5946 },
            { lat: 17.385, lng: 78.4867 },
          ]}
          height="300px"
        />
        </div>
        <div className="card-hover">
          <h2 className="font-bold mb-4 text-sage-900">Recent Activity</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {(stats.activities || []).map((a, i) => (
              <div key={i} className="text-sm border-b border-sage-50 pb-2 last:border-0">
                <p className="font-medium text-sage-800">{a.details}</p>
                <p className="text-xs text-sage-400">{a.company_name} · {new Date(a.created_at).toLocaleString()}</p>
              </div>
            ))}
            {(!stats.activities || stats.activities.length === 0) && (
              <p className="text-sage-500 text-sm">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
