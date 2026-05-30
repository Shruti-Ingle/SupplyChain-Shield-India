"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, Building2 } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "business" ? "business" : "transporter";
  const [role, setRole] = useState<"transporter" | "business">(initialRole);
  const [form, setForm] = useState({
    company_name: "",
    gst: "",
    phone: "",
    contact_person: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email: form.email,
          password: form.password,
          company_name: form.company_name,
          gst: form.gst,
          phone: form.phone,
          contact_person: form.contact_person,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push("/login?role=" + role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("transporter")}
            className={`card flex flex-col items-center gap-3 cursor-pointer transition ${
              role === "transporter" ? "ring-2 ring-saffron-500 border-saffron-200" : ""
            }`}
          >
            <Truck size={40} className="text-saffron-500" />
            <span className="font-bold">Register as Transporter</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("business")}
            className={`card flex flex-col items-center gap-3 cursor-pointer transition ${
              role === "business" ? "ring-2 ring-india-green border-green-200" : ""
            }`}
          >
            <Building2 size={40} className="text-india-green" />
            <span className="font-bold">Register as Business</span>
          </button>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input className="input-field" required value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </div>
            {role === "transporter" ? (
              <div>
                <label className="block text-sm font-medium mb-1">GST (optional)</label>
                <input className="input-field" value={form.gst}
                  onChange={(e) => setForm({ ...form, gst: e.target.value })} />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Contact Person</label>
                <input className="input-field" required value={form.contact_person}
                  onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input className="input-field" required value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="input-field" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" className="input-field" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" className="input-field" required value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-saffron-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
