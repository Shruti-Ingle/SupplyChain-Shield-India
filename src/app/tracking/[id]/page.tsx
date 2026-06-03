"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function TrackingPage() {
  const params = useParams();
  const id = String(params?.id || "1");

  const trip = {
    id,
    status: "in_transit",
    from_city: "Mumbai",
    to_city: "Pune",
    cargo_type: "FMCG Goods",
    vehicle_number: "MH12AB1234",
    driver_name: "Rahul Sharma",
    driver_phone: "9876543210",
    current_lat: 19.076,
    current_lng: 72.8777,
    eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    distance_remaining: 142,
    fuel_saved: 18.5,
    co2_saved: 49.6,
  };

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="link-accent">
          ? Back to Home
        </Link>

        <div className="card mt-6">
          <p className="section-label">Live Tracking</p>
          <h1 className="page-heading mb-6">Trip #{trip.id}</h1>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <p className="stat-label">Route</p>
              <p className="stat-value">{trip.from_city} ? {trip.to_city}</p>
            </div>

            <div className="card">
              <p className="stat-label">Status</p>
              <p className="stat-value capitalize">
                {String(trip.status || "in_transit").replace("_", " ")}
              </p>
            </div>

            <div className="card">
              <p className="stat-label">Cargo</p>
              <p className="stat-value">{trip.cargo_type}</p>
            </div>

            <div className="card">
              <p className="stat-label">Vehicle</p>
              <p className="stat-value">{trip.vehicle_number}</p>
            </div>

            <div className="card">
              <p className="stat-label">Driver</p>
              <p className="stat-value">{trip.driver_name}</p>
              <p className="text-sm text-sage-500">{trip.driver_phone}</p>
            </div>

            <div className="card">
              <p className="stat-label">ETA</p>
              <p className="stat-value">{new Date(trip.eta).toLocaleString()}</p>
            </div>
          </div>

          <div className="card mt-6">
            <p className="section-label">Sustainability Impact</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="stat-label">Distance Remaining</p>
                <p className="stat-value">{trip.distance_remaining} km</p>
              </div>
              <div>
                <p className="stat-label">Fuel Saved</p>
                <p className="stat-value">{trip.fuel_saved} L</p>
              </div>
              <div>
                <p className="stat-label">CO2 Saved</p>
                <p className="stat-value">{trip.co2_saved} kg</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-sage-100 bg-sage-50 p-8 text-center text-sage-700">
            Map placeholder: current location {trip.current_lat}, {trip.current_lng}
          </div>
        </div>
      </div>
    </div>
  );
}
