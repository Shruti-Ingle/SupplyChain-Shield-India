"use client";

import { useEffect, useState } from "react";
import { SustainabilityLineChart, GreenScoreGauge, getMonthlyLabels } from "@/components/Charts";
import { Leaf, Fuel, Route, IndianRupee } from "lucide-react";

export default function TransporterSustainabilityPage() {
  const [stats, setStats] = useState({
    empty_trips_avoided: 0, fuel_saved: 0, co2_saved: 0, revenue: 0,
    green_score: 50, monthlyFuel: [] as number[], monthlyCo2: [] as number[],
  });

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { icon: Route, label: "Empty Trips Avoided", value: stats.empty_trips_avoided },
    { icon: Fuel, label: "Fuel Saved (L)", value: stats.fuel_saved },
    { icon: Leaf, label: "CO₂ Reduced (kg)", value: stats.co2_saved },
    { icon: IndianRupee, label: "Backhaul Revenue (₹)", value: stats.revenue?.toLocaleString("en-IN") },
  ];

  return (
    <div>
      <p className="section-label">Environmental impact</p>
      <h1 className="page-heading mb-8">Sustainability Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <c.icon className="text-moss" size={24} />
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="card-hover lg:col-span-2">
          <h2 className="font-bold mb-4 text-sage-900">Monthly Fuel Savings (L)</h2>
          <SustainabilityLineChart labels={getMonthlyLabels()} data={stats.monthlyFuel || []} label="Fuel Saved" />
        </div>
        <div className="card-hover flex flex-col items-center justify-center">
          <GreenScoreGauge score={stats.green_score} />
          <p className="text-sm text-sage-500 text-center mt-4 max-w-xs">
            Based on backhaul trip rate, fuel efficiency, and match quality.
          </p>
        </div>
      </div>

      <div className="card-hover">
        <h2 className="font-bold mb-4 text-sage-900">Monthly Carbon Reduction (kg)</h2>
        <SustainabilityLineChart labels={getMonthlyLabels()} data={stats.monthlyCo2 || []} label="CO₂ Saved" color="#2d5a3d" />
      </div>
    </div>
  );
}
