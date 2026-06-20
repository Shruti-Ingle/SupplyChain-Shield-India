"use client";

import { useEffect, useState } from "react";

export default function TransporterMatchesPage() {
  const [shipments, setShipments] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("/api/shipments");
    const data = await res.json();
    setShipments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const acceptShipment = async (id: number) => {
    await fetch("/api/shipments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "accepted",
        costing: 15000,
      }),
    });

    alert("Shipment accepted successfully!");
    load();
  };

  return (
    <div>
      <p className="section-label">Transporter</p>
      <h1 className="page-heading mb-6">Available Business Shipments</h1>

      <div className="grid gap-5">
        {shipments.length === 0 && (
          <div className="card">No open business shipments available.</div>
        )}

        {shipments.map((s) => (
          <div key={s.id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {s.from_city} to {s.to_city}
              </h2>

              <p className="text-sm text-sage-500">
                Business: {s.business_company || "Business"}
              </p>

              <p className="text-sm mt-2">
                Cargo: <b>{s.cargo_type}</b> | Weight: <b>{(Number(s.weight) / 1000).toFixed(2)} Tons</b>
              </p>

              <p className="text-sm">
                Pickup: {s.pickup_date} | Deadline: {s.deadline}
              </p>

              <p className="text-sm capitalize">
                Status: <b>{s.status}</b>
              </p>
            </div>

            <button
              onClick={() => acceptShipment(s.id)}
              className="btn-primary"
            >
              Accept Shipment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

