"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, Building2, Leaf } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import ParticleField from "@/components/ParticleField";
import FadeIn from "@/components/FadeIn";

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
    <div className="min-h-screen bg-cream relative">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <ParticleField count={30} variant="subtle" />
      </div>
      <PublicNavbar />

      <div className="relative max-w-2xl mx-auto px-4 py-12 md:py-20">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="section-label">Join the movement</p>
            <h1 className="page-heading">Create your account</h1>
            <p className="text-sage-500 mt-2">Start reducing empty miles today</p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("transporter")}
              className={`card-hover flex flex-col items-center gap-3 cursor-pointer text-center py-8 ${
                role === "transporter" ? "ring-2 ring-moss border-sage-300 shadow-card" : ""
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                role === "transporter" ? "bg-moss text-white" : "bg-sage-100 text-moss"
              }`}>
                <Truck size={28} />
              </div>
              <span className="font-bold text-sage-900">Transporter</span>
              <span className="text-xs text-sage-500">Share empty return routes</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("business")}
              className={`card-hover flex flex-col items-center gap-3 cursor-pointer text-center py-8 ${
                role === "business" ? "ring-2 ring-sage-600 border-sage-300 shadow-card" : ""
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                role === "business" ? "bg-sage-600 text-white" : "bg-sage-100 text-sage-600"
              }`}>
                <Building2 size={28} />
              </div>
              <span className="font-bold text-sage-900">Business</span>
              <span className="text-xs text-sage-500">Post shipments & save costs</span>
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="card-hover shadow-card">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sage-100">
              <Leaf size={18} className="text-moss" />
              <span className="text-sm font-medium text-sage-600">
                Registering as <span className="text-moss capitalize font-semibold">{role}</span>
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">Company Name</label>
                <input className="input-field" required value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              </div>
              {role === "transporter" ? (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1.5">GST (optional)</label>
                  <input className="input-field" value={form.gst}
                    onChange={(e) => setForm({ ...form, gst: e.target.value })} />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1.5">Contact Person</label>
                  <input className="input-field" required value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">Phone</label>
                <input className="input-field" required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">Email</label>
                <input type="email" className="input-field" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">Password</label>
                <input type="password" className="input-field" required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">Confirm Password</label>
                <input type="password" className="input-field" required value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
              </div>
              {error && (
                <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="text-center text-sm text-sage-500 mt-6 pt-6 border-t border-sage-100">
              Already have an account?{" "}
              <Link href="/login" className="text-moss font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </FadeIn>
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
