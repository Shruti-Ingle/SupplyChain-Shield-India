"use client";

import { useEffect, useState } from "react";
import { SustainabilityBarChart, getMonthlyLabels } from "@/components/Charts";
import { useToast } from "@/components/Toast";
import { Leaf, Fuel, Route, IndianRupee } from "lucide-react";

export default function BusinessSustainabilityPage() {
  const [stats, setStats] = useState({
    co2_saved: 0, fuel_saved: 0, trips: 0, costSavings: 0, monthlySavings: [] as number[],
  });
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  return (
    <div>
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-6">Sustainability Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Leaf, label: "CO₂ Saved (kg)", value: stats.co2_saved },
          { icon: Fuel, label: "Fuel Saved (L)", value: stats.fuel_saved },
          { icon: Route, label: "Shared Logistics Trips", value: stats.trips },
          { icon: IndianRupee, label: "Cost Reduction (₹)", value: stats.costSavings?.toLocaleString("en-IN") },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <c.icon className="text-india-green" size={24} />
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="card mb-6">
        <h2 className="font-bold mb-4">Monthly Cost Savings (₹)</h2>
        <SustainabilityBarChart labels={getMonthlyLabels()} data={stats.monthlySavings || []} label="Savings" />
      </div>
      <button
        onClick={() => showToast("Demo mode – PDF report generated")}
        className="btn-secondary"
      >
        Download Sustainability Report
      </button>
    </div>
  );
}
