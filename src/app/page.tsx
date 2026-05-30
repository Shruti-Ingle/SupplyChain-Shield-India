"use client";

import PublicNavbar from "@/components/PublicNavbar";
import LiveCounter from "@/components/LiveCounter";
import Link from "next/link";
import {
  Brain,
  MapPin,
  Leaf,
  FileText,
  Bell,
  Truck,
  Package,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [stats, setStats] = useState({
    trips_matched: 1247,
    empty_trips_avoided: 892,
    fuel_saved: 45600,
    co2_reduced: 122208,
  });

  useEffect(() => {
    fetch("/api/stats/public")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const features = [
    { icon: Brain, title: "AI Route Matching", desc: "Smart algorithms match empty return trucks with cargo on the same route." },
    { icon: MapPin, title: "Live Tracking", desc: "Real-time map tracking with ETA and delivery status updates." },
    { icon: Leaf, title: "Sustainability Dashboard", desc: "Track fuel saved, CO₂ reduced, and your green score." },
    { icon: FileText, title: "Carbon Reports", desc: "Download sustainability reports for your business." },
    { icon: Bell, title: "Smart Notifications", desc: "Get alerts when new matches appear for your routes." },
  ];

  const steps = [
    { icon: Package, title: "Business posts shipment", desc: "Cargo owners list pickup, delivery, and cargo details." },
    { icon: Truck, title: "Transporter posts route", desc: "Truck owners share empty return routes and capacity." },
    { icon: Sparkles, title: "AI matches instantly", desc: "Our engine finds the best route-capacity-time fit." },
    { icon: CheckCircle, title: "Goods transported", desc: "Both parties book and track the shipment live." },
    { icon: Leaf, title: "Fuel & CO₂ saved", desc: "Every backhaul trip reduces waste and emissions." },
  ];

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-saffron-500 via-saffron-400 to-india-green text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)"
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Reduce Empty Truck Movement.<br />
            Reduce Emissions. Increase Profits.
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            India&apos;s AI-powered logistics platform matching empty return trucks with cargo shipments — saving fuel, cutting costs, and protecting our planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=transporter" className="bg-white text-saffron-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition shadow-lg">
              Register as Transporter
            </Link>
            <Link href="/register?role=business" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition">
              Register as Business
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">The Problem</h2>
          <div className="flex flex-wrap justify-center gap-1 mb-8 max-w-lg mx-auto">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm ${i < 30 ? "bg-red-500" : "bg-gray-200"}`}
              />
            ))}
          </div>
          <p className="text-xl text-gray-600">
            Nearly <span className="font-bold text-red-600">one-third</span> of truck journeys in India return empty — wasting fuel, increasing costs, and emitting unnecessary CO₂.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-saffron-500 text-white flex items-center justify-center shrink-0">
                    <step.icon size={22} />
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-saffron-200 my-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="py-16 bg-india-green text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Sustainability Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Trips Matched", value: stats.trips_matched },
              { label: "Empty Trips Avoided", value: stats.empty_trips_avoided },
              { label: "Fuel Saved (L)", value: stats.fuel_saved },
              { label: "CO₂ Reduced (kg)", value: stats.co2_reduced },
            ].map((s) => (
              <div key={s.label} className="text-center bg-white/10 rounded-xl p-6 backdrop-blur">
                <p className="text-3xl md:text-4xl font-bold">
                  <LiveCounter target={s.value} />
                </p>
                <p className="text-sm text-white/80 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card text-center hover:shadow-lg transition">
                <f.icon className="mx-auto text-saffron-500 mb-4" size={36} />
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About SupplyChain Shield India</h2>
          <p className="text-gray-600 leading-relaxed">
            Built for India&apos;s logistics ecosystem, SupplyChain Shield connects transporters and businesses through intelligent route matching. Our mission is to eliminate empty truck miles, reduce the carbon footprint of freight transport, and make logistics more profitable for everyone.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">SupplyChain Shield India</p>
            <p className="text-sm">Smart logistics for a greener India.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Connect</p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">Facebook</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          © 2026 SupplyChain Shield India. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
