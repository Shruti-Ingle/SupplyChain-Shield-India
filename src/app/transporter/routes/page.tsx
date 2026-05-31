"use client";

import { useEffect, useState } from "react";
import CityAutocomplete from "@/components/CityAutocomplete";
import { useToast } from "@/components/Toast";
import Link from "next/link";

interface Route {
  id: number;
  from_city: string;
  to_city: string;
  capacity_available: number;
  departure_time: string;
  status: string;
  distance_km: number;
}

interface Truck {
  id: number;
  vehicle_number: string;
  capacity: number;
  status: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    from_city: "", to_city: "", capacity_available: "", departure_time: "", truck_id: "",
  });
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    fetch("/api/routes").then((r) => r.json()).then(setRoutes);
    fetch("/api/trucks").then((r) => r.json()).then(setTrucks);
  }, []);

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, truck_id: parseInt(form.truck_id), capacity_available: parseFloat(form.capacity_available) }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed"); return; }
    showToast(`Route published! ${data.matches_found} matches found.`);
    setShowForm(false);
    fetch("/api/routes").then((r) => r.json()).then(setRoutes);
  };

  const onTruckSelect = (truckId: string) => {
    const truck = trucks.find((t) => t.id === parseInt(truckId));
    setForm({ ...form, truck_id: truckId, capacity_available: truck ? String(truck.capacity) : "" });
  };

  return (
    <div>
      {ToastComponent}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="section-label">Routes</p>
          <h1 className="page-heading">Available Routes</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Post Available Route"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={publish} className="card-hover mb-6 space-y-4">
          <h2 className="font-bold">Post Empty Return Route</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Location</label>
              <CityAutocomplete value={form.from_city} onChange={(v) => setForm({ ...form, from_city: v })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destination</label>
              <CityAutocomplete value={form.to_city} onChange={(v) => setForm({ ...form, to_city: v })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Truck</label>
              <select className="input-field" required value={form.truck_id} onChange={(e) => onTruckSelect(e.target.value)}>
                <option value="">Choose truck</option>
                {trucks.filter((t) => t.status === "available").map((t) => (
                  <option key={t.id} value={t.id}>{t.vehicle_number} ({t.capacity} tons)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity Available (tons)</label>
              <input type="number" className="input-field" required value={form.capacity_available}
                onChange={(e) => setForm({ ...form, capacity_available: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Departure Time</label>
              <input type="datetime-local" className="input-field" required value={form.departure_time}
                onChange={(e) => setForm({ ...form, departure_time: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary">Publish Route</button>
        </form>
      )}

      <div className="space-y-4">
        {routes.map((r) => (
          <div key={r.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-lg">{r.from_city} → {r.to_city}</p>
              <p className="text-sm text-sage-500">{r.distance_km} km · {r.capacity_available} tons · {new Date(r.departure_time).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-sage-600"}`}>
                {r.status}
              </span>
              {r.status === "open" && (
                <Link href={`/transporter/matches?route=${r.id}`} className="btn-primary text-sm py-1.5">
                  View Matches
                </Link>
              )}
            </div>
          </div>
        ))}
        {routes.length === 0 && <p className="text-sage-500 text-center py-8">No routes posted yet.</p>}
      </div>
    </div>
  );
}
