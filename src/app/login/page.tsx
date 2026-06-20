"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";
import ParticleField from "@/components/ParticleField";
import FadeIn from "@/components/FadeIn";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole =
    (searchParams.get("role") as "transporter" | "business" | "admin") ||
    "business";

  const [role, setRole] = useState<"transporter" | "business" | "admin">(
    initialRole
  );

  const demoAccounts = {
    transporter: { email: "transporter@test.com", password: "123" },
    business: { email: "business@test.com", password: "123" },
    admin: { email: "vedant.admin@test.com", password: "123" },
  };

  const [email, setEmail] = useState(demoAccounts[initialRole].email);
  const [password, setPassword] = useState(demoAccounts[initialRole].password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const changeRole = (nextRole: "transporter" | "business" | "admin") => {
    setRole(nextRole);
    setEmail(demoAccounts[nextRole].email);
    setPassword(demoAccounts[nextRole].password);
    setError("");
  };

  const fillDemo = () => {
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

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
    <div className="min-h-screen bg-cream relative">
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <ParticleField count={30} variant="subtle" />
      </div>

      <PublicNavbar />

      <div className="relative max-w-md mx-auto px-4 py-16 md:py-24">
        <FadeIn>
          <div className="card-hover shadow-card border-sage-100">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-moss flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Leaf className="text-sage-100" size={28} />
              </div>

              <h1 className="text-2xl font-bold text-sage-900 tracking-tight">
                Welcome back
              </h1>

              <p className="text-sm text-sage-500 mt-1">
                Sign in to your account
              </p>
            </div>

            <div className="flex rounded-xl overflow-hidden border border-sage-200 mb-6 p-1 bg-sage-50/50">
              {(["transporter", "business", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => changeRole(r)}
                  className={`flex-1 py-2 text-sm font-medium capitalize rounded-lg transition-all duration-200 ${
                    role === r
                      ? "bg-white text-moss shadow-soft"
                      : "text-sage-500 hover:text-sage-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Logging in..." : `Login as ${role}`}
              </button>
            </form>

            <button
              onClick={fillDemo}
              className="mt-4 text-sm text-sage-500 hover:text-moss transition-colors w-full text-center"
            >
              Fill demo credentials
            </button>

            <p className="text-center text-sm text-sage-500 mt-6 pt-6 border-t border-sage-100">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-moss font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </FadeIn>
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
