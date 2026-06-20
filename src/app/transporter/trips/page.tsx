"use client";

import { useEffect, useState } from "react";

export default function TransporterTripsPage() {
  const [shipments, setShipments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/shipments?mine=1")
      .then((r) => r.json())
      .then((d) => setShipments(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div>
      <p className="section-label">Transporter</p>
      <h1 className="page-heading mb-6">Accepted Shipments</h1>

      <div className="grid gap-5">
        {shipments.length === 0 && <div className="card">No accepted shipments yet.</div>}

        {shipments.map((s) => (
          <div key={s.id} className="card">
            <h2 className="text-xl font-bold">{s.from_city} to {s.to_city}</h2>
            <p className="text-sm">Business: {s.business_company}</p>
            <p className="text-sm">Cargo: {s.cargo_type}</p>
            <p className="text-sm">Weight: {s.weight} kg</p>
            <p className="text-sm capitalize">Status: <b>{s.status}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}
