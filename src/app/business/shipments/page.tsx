"use client";

import { useEffect, useState } from "react";

export default function BusinessShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/shipments")
      .then((r) => r.json())
      .then((d) => setShipments(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div>
      <p className="section-label">Business</p>
      <h1 className="page-heading mb-6">My Shipments</h1>

      <div className="grid gap-5">
        {shipments.length === 0 && (
          <div className="card">No shipments posted yet.</div>
        )}

        {shipments.map((s) => (
          <div key={s.id} className="card">
            <h2 className="text-xl font-bold">
              {s.from_city} to {s.to_city}
            </h2>

            <p className="text-sm">
              Cargo: {s.cargo_type}
            </p>

            <p className="text-sm">
              Weight: {s.weight} kg
            </p>

            <p className="text-sm capitalize">
              Status: <b>{s.status}</b>
            </p>

            {s.status === "accepted" && (
              <div className="mt-3 rounded-xl bg-green-50 border border-green-100 p-3 text-green-700">
                Accepted by transporter: <b>{s.transporter_company}</b>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

