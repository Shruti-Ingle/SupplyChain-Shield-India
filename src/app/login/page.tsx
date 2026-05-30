"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"transporter" | "business" | "admin">(
    (searchParams.get("role") as "transporter" | "business" | "admin") || "transporter"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = {
    transporter: { email: "transporter@example.com", password: "pass" },
    business: { email: "business@example.com", password: "pass" },
    admin: { email: "admin@example.com", password: "pass" },
  };

  const fillDemo = () => {
    const demo = demoAccounts[role];
    setEmail(demo.email);
    setPassword(demo.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      const paths = {
        transporter: "/transporter/dashboard",
        business: "/business/dashboard",
        admin: "/admin/dashboard",
      };
      router.push(paths[data.user.role as keyof typeof paths]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card">
          <div className="text-center mb-6">
            <Shield className="mx-auto text-saffron-500 mb-2" size={40} />
            <h1 className="text-2xl font-bold">Login</h1>
          </div>

          <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
            {(["transporter", "business", "admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); fillDemo(); }}
                className={`flex-1 py-2 text-sm font-medium capitalize transition ${
                  role === r ? "bg-saffron-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button onClick={fillDemo} className="mt-3 text-sm text-saffron-600 hover:underline w-full text-center">
            Fill demo credentials
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-saffron-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
