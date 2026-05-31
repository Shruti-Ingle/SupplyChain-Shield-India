"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Shipment {
  id: number;
  from_city: string;
  to_city: string;
  weight: number;
  cargo_type: string;
  status: string;
  pickup_date: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [tab, setTab] = useState<"active" | "completed" | "cancelled">("active");

  useEffect(() => {
    fetch("/api/shipments").then((r) => r.json()).then(setShipments);
  }, []);

  const filtered = shipments.filter((s) => {
    if (tab === "completed") return s.status === "delivered";
    if (tab === "cancelled") return s.status === "cancelled";
    return !["delivered", "cancelled"].includes(s.status);
  });

  const cancel = async (id: number) => {
    if (!confirm("Cancel this shipment?")) return;
    await fetch("/api/shipments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "cancelled" }),
    });
    fetch("/api/shipments").then((r) => r.json()).then(setShipments);
  };

  return (
    <div>
      <p className="section-label">Logistics</p>
      <h1 className="page-heading mb-8">My Shipments</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["active", "completed", "cancelled"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={tab === t ? "tab-btn-active" : "tab-btn-inactive"}>
            {t}
          </button>
        ))}
      </div>

      <div className="card-hover overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-sage-500">
              <th className="pb-3 pr-4">ID</th>
              <th className="pb-3 pr-4">Route</th>
              <th className="pb-3 pr-4">Weight</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="py-3 pr-4">#{s.id}</td>
                <td className="py-3 pr-4 font-medium">{s.from_city} → {s.to_city}</td>
                <td className="py-3 pr-4">{s.weight} tons</td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{s.status}</span>
                </td>
                <td className="py-3 flex gap-2">
                  {["matched", "in_transit"].includes(s.status) && (
                    <Link href="/business/transporters" className="text-moss text-xs font-medium">Track</Link>
                  )}
                  {s.status === "open" && (
                    <button onClick={() => cancel(s.id)} className="text-red-600 text-xs font-medium">Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-sage-500 py-8">No shipments found.</p>}
      </div>
    </div>
  );
}
