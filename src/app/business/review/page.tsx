"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReviewPage() {
  const [data, setData] = useState<any>({
    journeys: [],
    shipments: [],
    bookings: [],
    stats: {},
  });

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ journeys: [], shipments: [], bookings: [], stats: {} }));
  }, []);

  return (
    <div>
      <p className="section-label">Business</p>
      <h1 className="page-heading mb-6">Review Selected Journeys</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="stat-label">Trips Matched</p>
          <p className="stat-value">{data.stats?.trips_matched || 0}</p>
        </div>
        <div className="card">
          <p className="stat-label">Empty Trips Avoided</p>
          <p className="stat-value">{data.stats?.empty_trips_avoided || 0}</p>
        </div>
        <div className="card">
          <p className="stat-label">Fuel Saved</p>
          <p className="stat-value">{data.stats?.fuel_saved || 0} L</p>
        </div>
        <div className="card">
          <p className="stat-label">CO2 Reduced</p>
          <p className="stat-value">{data.stats?.co2_reduced || 0} kg</p>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="font-bold mb-4">Booked Journeys</h2>

        {(!data.bookings || data.bookings.length === 0) && (
          <p className="text-sm text-sage-500">No booked journeys yet.</p>
        )}

        <div className="grid gap-4">
          {(data.bookings || []).map((b: any) => (
            <div key={b.id} className="border border-sage-100 rounded-xl p-4">
              <h3 className="font-bold">{b.from_city} to {b.to_city}</h3>
              <p className="text-sm">Business: {b.business_company}</p>
              <p className="text-sm">Transporter: {b.transporter_company}</p>
              <p className="text-sm">Cost: Rs. {b.costing}</p>
              <p className="text-sm capitalize">Status: {b.status}</p>
            </div>
          ))}
        </div>
      </div>

      <Link href="/business/select-journey" className="btn-primary">
        Back to Select Journey
      </Link>
    </div>
  );
}
