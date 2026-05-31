"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/Toast";

interface Trip {
  id: number;
  from_city: string;
  to_city: string;
  transporter_name: string;
  business_name: string;
  status: string;
}

export default function AdminShipmentsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filter, setFilter] = useState("");
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetch("/api/trips").then((r) => r.json()).then(setTrips);
  }, []);

  const filtered = trips.filter((t) =>
    !filter || `${t.from_city} ${t.to_city} ${t.transporter_name} ${t.business_name}`.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {ToastComponent}
      <p className="section-label">Monitoring</p>
      <h1 className="page-heading mb-8">Shipment Monitoring</h1>
      <input
        className="input-field max-w-md mb-4"
        placeholder="Search by route or company..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-sage-500">
              <th className="pb-3 pr-4">Route</th>
              <th className="pb-3 pr-4">Transporter</th>
              <th className="pb-3 pr-4">Business</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{t.from_city} → {t.to_city}</td>
                <td className="py-3 pr-4">{t.transporter_name}</td>
                <td className="py-3 pr-4">{t.business_name}</td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{t.status}</span>
                </td>
                <td className="py-3 flex gap-2">
                  <Link href={`/tracking/${t.id}`} className="text-moss text-xs font-medium">View Tracking</Link>
                  <button onClick={() => showToast("Demo mode – reassignment not available")} className="text-sage-500 text-xs">Reassign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-sage-500 py-8">No active shipments.</p>}
      </div>
    </div>
  );
}
