"use client";

import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import LiveCounter from "@/components/LiveCounter";
import ParticleField from "@/components/ParticleField";
import FadeIn from "@/components/FadeIn";
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
  ArrowRight,
  Wind,
  TreePine,
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
    {
      icon: Brain,
      title: "AI Route Matching",
      desc: "Smart algorithms match empty return trucks with cargo on the same route.",
      tall: false,
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      desc: "Real-time map tracking with ETA and delivery status updates.",
      tall: true,
    },
    {
      icon: Leaf,
      title: "Sustainability Dashboard",
      desc: "Track fuel saved, CO₂ reduced, and your green score.",
      tall: false,
    },
    {
      icon: FileText,
      title: "Carbon Reports",
      desc: "Download sustainability reports for your business.",
      tall: true,
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      desc: "Get alerts when new matches appear for your routes.",
      tall: false,
    },
  ];

  const steps = [
    { icon: Package, title: "Business posts shipment", desc: "Cargo owners list pickup, delivery, and cargo details." },
    { icon: Truck, title: "Transporter posts route", desc: "Truck owners share empty return routes and capacity." },
    { icon: Sparkles, title: "AI matches instantly", desc: "Our engine finds the best route-capacity-time fit." },
    { icon: CheckCircle, title: "Goods transported", desc: "Both parties book and track the shipment live." },
    { icon: Leaf, title: "Fuel & CO₂ saved", desc: "Every backhaul trip reduces waste and emissions." },
  ];

  const benefits = [
    { num: "01", title: "Lower emissions", icon: Wind },
    { num: "02", title: "Environmental stewardship", icon: TreePine },
    { num: "03", title: "Increased profitability", icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative hero-gradient text-white overflow-hidden min-h-[85vh] flex items-center">
        <ParticleField count={50} variant="hero" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,168,136,0.25),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 w-full">
          <FadeIn>
            <p className="section-label text-sage-300 mb-4">Greener logistics for India</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight max-w-3xl">
              Embrace smarter routes.<br />
              <span className="text-sage-300">Embrace your impact.</span>
            </h1>
            <p className="text-lg md:text-xl text-sage-200/90 max-w-xl mb-10 leading-relaxed">
              AI-powered matching for empty return trucks — cutting fuel waste, reducing CO₂, and making freight more profitable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register?role=transporter" className="group inline-flex items-center justify-center gap-2 bg-white text-moss font-semibold py-3.5 px-8 rounded-full hover:bg-sage-50 transition-all duration-300 shadow-lg hover:shadow-glow hover:-translate-y-0.5">
                Register as Transporter
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/register?role=business" className="inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold py-3.5 px-8 rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300">
                Register as Business
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <p className="section-label">The challenge</p>
            <h2 className="section-title mb-10">One-third of trucks return empty</h2>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="flex flex-wrap justify-center gap-1.5 mb-10 max-w-md mx-auto">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
                    i < 30 ? "bg-earth" : "bg-sage-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-lg text-sage-600 leading-relaxed max-w-2xl mx-auto">
              Nearly <span className="font-semibold text-moss">one-third</span> of truck journeys in India return empty — wasting fuel, increasing costs, and emitting unnecessary CO₂ into our atmosphere.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-cream-dark">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <p className="section-label text-center">Our approach</p>
            <h2 className="section-title text-center mb-14">How it works</h2>
          </FadeIn>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-moss text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow">
                      <step.icon size={22} />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-sage-200 my-2 min-h-[2rem]" />
                    )}
                  </div>
                  <div className="pb-10 pt-1">
                    <h3 className="font-bold text-lg text-sage-900 mb-1 group-hover:text-moss transition-colors">{step.title}</h3>
                    <p className="text-sage-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Stats */}
      <section id="sustainability" className="relative py-20 md:py-28 hero-gradient text-white overflow-hidden">
        <ParticleField count={25} variant="subtle" />
        <div className="relative max-w-6xl mx-auto px-4">
          <FadeIn>
            <p className="section-label text-sage-300 text-center">Our impact</p>
            <h2 className="section-title text-center text-white mb-14">Sustainability at scale</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Trips Matched", value: stats.trips_matched, suffix: "+" },
              { label: "Empty Trips Avoided", value: stats.empty_trips_avoided, suffix: "+" },
              { label: "Fuel Saved (L)", value: stats.fuel_saved, suffix: "" },
              { label: "CO₂ Reduced (kg)", value: stats.co2_reduced, suffix: "" },
            ].map((s, i) => (
              <FadeIn key={s.label} delay={i * 80}>
                <div className="text-center bg-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-3xl md:text-4xl font-bold tracking-tight">
                    <LiveCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm text-sage-200/80 mt-2">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <p className="section-label">Our benefits</p>
              <h2 className="section-title mb-6">
                Why choose <span className="gradient-text">SupplyChain Shield</span>
              </h2>
              <p className="text-sage-600 leading-relaxed mb-8">
                Our commitment to sustainability and cutting-edge technology ensures logistics that&apos;s reliable, profitable, and planet-friendly.
              </p>
              <div className="space-y-4">
                {benefits.map((b) => (
                  <div
                    key={b.num}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-sage-100 bg-white hover:border-sage-200 hover:shadow-soft transition-all duration-300 group cursor-default"
                  >
                    <span className="text-xs font-bold text-sage-400 w-8">{b.num}</span>
                    <b.icon size={22} className="text-sage-500 group-hover:text-moss transition-colors" />
                    <span className="font-semibold text-sage-800 group-hover:text-moss transition-colors">{b.title}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={200}>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-sage-200 via-sage-100 to-cream-dark overflow-hidden border border-sage-100 shadow-card">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf size={120} className="text-sage-300/40 animate-float" strokeWidth={0.8} />
                  </div>
                  <ParticleField count={20} variant="subtle" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-5 shadow-card border border-sage-100 animate-float-slow">
                  <p className="text-2xl font-bold text-moss">70%</p>
                  <p className="text-xs text-sage-500 mt-1">Potential fuel savings</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features - Pinterest grid */}
      <section id="features" className="py-20 md:py-28 bg-cream-dark">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <p className="section-label text-center">What we offer</p>
            <h2 className="section-title text-center mb-14">Platform features</h2>
          </FadeIn>
          <div className="pinterest-grid">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80} className="pinterest-item">
                <div
                  className={`card-hover text-left ${f.tall ? "md:pb-10" : ""}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center mb-4 group-hover:bg-sage-200 transition-colors">
                    <f.icon className="text-moss" size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-sage-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-sage-600 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <p className="section-label">About us</p>
            <h2 className="section-title mb-6">Built for India&apos;s green future</h2>
            <p className="text-sage-600 leading-relaxed text-lg">
              SupplyChain Shield connects transporters and businesses through intelligent route matching. Our mission is to eliminate empty truck miles, reduce the carbon footprint of freight transport, and make logistics more profitable for everyone.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 hero-gradient text-white overflow-hidden">
        <ParticleField count={30} variant="hero" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Join the sustainable logistics movement
            </h2>
            <p className="text-sage-200/90 mb-8 text-lg">
              Discover solutions that reduce costs and environmental impact. Take the first step today.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-white text-moss font-semibold py-3.5 px-8 rounded-full hover:bg-sage-50 transition-all duration-300 shadow-lg hover:-translate-y-0.5"
            >
              Get a free consultation
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
