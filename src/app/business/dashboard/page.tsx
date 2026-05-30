"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, Leaf, IndianRupee } from "lucide-react";

export default function BusinessDashboard() {
  const [stats, setStats] = useState({
    activeShipments: 0, completedDeliveries: 0, costSavings: 0, co2_saved: 0,
  });

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { icon: Package, label: "Active Shipments", value: stats.activeShipments },
    { icon: Truck, label: "Completed Deliveries", value: stats.completedDeliveries },
    { icon: IndianRupee, label: "Money Saved", value: `₹${(stats.costSavings || 0).toLocaleString("en-IN")}` },
    { icon: Leaf, label: "Carbon Reduction (kg)", value: stats.co2_saved },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <c.icon className="text-india-green" size={24} />
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <Link href="/business/create-shipment" className="btn-primary">Create Shipment</Link>
        <Link href="/business/transporters" className="btn-secondary">Browse Transporters</Link>
      </div>
    </div>
  );
}
