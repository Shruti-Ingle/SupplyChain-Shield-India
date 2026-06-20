"use client";

import { useEffect, useState } from "react";

export default function SelectJourneyPage() {
  const [journeys, setJourneys] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch("/api/routes");
    const data = await res.json();
    setJourneys(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const bookJourney = async (id: number) => {
    await fetch("/api/routes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "booked" }),
    });

    alert("Journey selected successfully!");
    load();
  };

  return (
    <div>
      <p className="section-label">Business</p>
      <h1 className="page-heading mb-6">Select Transporter Journey</h1>

      <div className="grid gap-5">
        {journeys.length === 0 && (
          <div className="card">No transporter journeys available.</div>
        )}

        {journeys.map((j) => (
          <div key={j.id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {j.from_city} to {j.to_city}
              </h2>

              <p className="text-sm text-sage-500">
                {j.transporter_company} - {j.vehicle_type} - {j.vehicle_number}
              </p>

              <p className="text-sm mt-2">
                Capacity: <b>{j.capacity_available} kg</b> | Cost: <b>Rs. {j.costing}</b>
              </p>

              <p className="text-sm">
                Departure: {new Date(j.departure_time).toLocaleString()}
              </p>

              <p className="text-sm capitalize">
                Status: <b>{j.status}</b>
              </p>
            </div>

            <button
              onClick={() => bookJourney(j.id)}
              disabled={j.status !== "open"}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {j.status === "open" ? "Select Journey" : "Booked"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
