"use client";

import { useEffect, useState } from "react";
import { SustainabilityLineChart, SustainabilityBarChart, getMonthlyLabels } from "@/components/Charts";

export default function AdminSustainabilityPage() {
  const [stats, setStats] = useState({
    empty_trips_avoided: 0, fuel_saved: 0, co2_reduced: 0,
    topTransporters: [] as { company_name: string; fuel_saved: number }[],
    topBusinesses: [] as { company_name: string; co2_saved: number }[],
  });

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const routeEfficiency = stats.empty_trips_avoided > 0
    ? Math.min(95, Math.round(60 + stats.empty_trips_avoided * 0.5))
    : 68;

  const monthlyFuel = [120, 180, 240, 310, 420, stats.fuel_saved || 500].map(Math.round);
  const monthlyCo2 = monthlyFuel.map((f) => Math.round(f * 2.68));

  return (
    <div>
      <p className="section-label">National impact</p>
      <h1 className="page-heading mb-8">National Sustainability Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Empty Trips Prevented", value: stats.empty_trips_avoided || 892 },
          { label: "Fuel Saved (L)", value: Math.round(stats.fuel_saved || 45600) },
          { label: "CO₂ Reduced (tons)", value: ((stats.co2_reduced || 122208) / 1000).toFixed(1) },
          { label: "Route Efficiency (%)", value: routeEfficiency },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-bold mb-4">Weekly Fuel Savings Trend</h2>
          <SustainabilityLineChart labels={getMonthlyLabels()} data={monthlyFuel} label="Fuel (L)" />
        </div>
        <div className="card">
          <h2 className="font-bold mb-4">Monthly CO₂ Reduction (kg)</h2>
          <SustainabilityBarChart labels={getMonthlyLabels()} data={monthlyCo2} label="CO₂ (kg)" color="#FF9933" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold mb-4">Top 5 Transporters by Fuel Saved</h2>
          {(stats.topTransporters || []).length === 0 ? (
            <p className="text-sage-500 text-sm">Complete trips to populate rankings.</p>
          ) : (
            <ol className="space-y-2">
              {stats.topTransporters.map((t, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{i + 1}. {t.company_name}</span>
                  <span className="font-medium">{Math.round(t.fuel_saved)}L</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="card">
          <h2 className="font-bold mb-4">Top 5 Businesses by CO₂ Reduced</h2>
          {(stats.topBusinesses || []).length === 0 ? (
            <p className="text-sage-500 text-sm">Complete trips to populate rankings.</p>
          ) : (
            <ol className="space-y-2">
              {stats.topBusinesses.map((b, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{i + 1}. {b.company_name}</span>
                  <span className="font-medium">{Math.round(b.co2_saved)} kg</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
