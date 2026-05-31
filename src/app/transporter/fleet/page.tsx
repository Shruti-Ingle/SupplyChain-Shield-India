"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";

interface Truck {
  id: number;
  vehicle_number: string;
  capacity: number;
  vehicle_type: string;
  driver_name: string;
  driver_phone: string;
  status: string;
}

export default function FleetPage() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    vehicle_number: "", capacity: "", vehicle_type: "Open",
    driver_name: "", driver_phone: "", status: "available",
  });
  const { showToast, ToastComponent } = useToast();

  const load = () => fetch("/api/trucks").then((r) => r.json()).then(setTrucks);
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ vehicle_number: "", capacity: "", vehicle_type: "Open", driver_name: "", driver_phone: "", status: "available" });
    setModal(true);
  };

  const openEdit = (t: Truck) => {
    setEditId(t.id);
    setForm({ vehicle_number: t.vehicle_number, capacity: String(t.capacity), vehicle_type: t.vehicle_type, driver_name: t.driver_name, driver_phone: t.driver_phone, status: t.status });
    setModal(true);
  };

  const save = async () => {
    const body = { ...form, capacity: parseFloat(form.capacity), ...(editId ? { id: editId } : {}) };
    await fetch("/api/trucks", { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setModal(false);
    load();
    showToast(editId ? "Truck updated" : "Truck added");
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this truck?")) return;
    await fetch(`/api/trucks?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      {ToastComponent}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="section-label">Fleet</p>
          <h1 className="page-heading">Fleet Management</h1>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Truck
        </button>
      </div>

      <div className="card-hover overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-sage-500">
              <th className="pb-3 pr-4">Vehicle Number</th>
              <th className="pb-3 pr-4">Capacity</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Driver</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((t) => (
              <tr key={t.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{t.vehicle_number}</td>
                <td className="py-3 pr-4">{t.capacity} tons</td>
                <td className="py-3 pr-4">{t.vehicle_type}</td>
                <td className="py-3 pr-4">{t.driver_name}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === "available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {t.status === "available" ? "Available" : "On Trip"}
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  <button onClick={() => openEdit(t)} className="text-blue-600"><Pencil size={16} /></button>
                  <button onClick={() => remove(t.id)} className="text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trucks.length === 0 && <p className="text-center text-sage-500 py-8">No trucks yet. Add your first truck.</p>}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="font-bold text-lg">{editId ? "Edit Truck" : "Add Truck"}</h2>
            {[
              { key: "vehicle_number", label: "Vehicle Number" },
              { key: "capacity", label: "Capacity (tons)", type: "number" },
              { key: "driver_name", label: "Driver Name" },
              { key: "driver_phone", label: "Driver Contact" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <input className="input-field" type={f.type || "text"}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Type</label>
              <select className="input-field" value={form.vehicle_type} onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}>
                {["Open", "Container", "Refrigerated", "Tanker"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="btn-primary flex-1">Save</button>
              <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
