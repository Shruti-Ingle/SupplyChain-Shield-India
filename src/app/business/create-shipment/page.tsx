"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityAutocomplete from "@/components/CityAutocomplete";
import { useToast } from "@/components/Toast";

export default function CreateShipmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    from_city: "", to_city: "", cargo_type: "General", weight: "",
    volume: "", pickup_date: "", deadline: "",
  });
  const { showToast, ToastComponent } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, weight: parseFloat(form.weight), volume: form.volume ? parseFloat(form.volume) : null }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || "Failed"); return; }
    showToast(`Shipment posted! ${data.matches_found} transporters matched.`);
    router.push("/business/shipments");
  };

  return (
    <div>
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-6">Create Shipment</h1>
      <form onSubmit={submit} className="card max-w-2xl space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pickup Location</label>
            <CityAutocomplete value={form.from_city} onChange={(v) => setForm({ ...form, from_city: v })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination</label>
            <CityAutocomplete value={form.to_city} onChange={(v) => setForm({ ...form, to_city: v })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cargo Type</label>
            <select className="input-field" value={form.cargo_type} onChange={(e) => setForm({ ...form, cargo_type: e.target.value })}>
              {["General", "Electronics", "Food & Beverage", "Textiles", "Machinery", "Chemicals", "Pharma"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (tons)</label>
            <input type="number" step="0.1" className="input-field" required value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Volume (m³) optional</label>
            <input type="number" className="input-field" value={form.volume}
              onChange={(e) => setForm({ ...form, volume: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pickup Date</label>
            <input type="date" className="input-field" required value={form.pickup_date}
              onChange={(e) => setForm({ ...form, pickup_date: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Delivery Deadline</label>
            <input type="date" className="input-field" required value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn-primary">Post Shipment</button>
      </form>
    </div>
  );
}
