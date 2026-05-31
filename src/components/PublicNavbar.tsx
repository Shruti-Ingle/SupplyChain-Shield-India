"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const onHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#sustainability", label: "Impact" },
    { href: "/#features", label: "Features" },
    { href: "/#about", label: "About" },
  ];

  const linkClass = onHero
    ? "text-sm text-sage-100/90 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
    : "text-sm text-sage-600 hover:text-moss px-3 py-2 rounded-full hover:bg-sage-100/80 transition-all duration-200";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "glass-nav shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-glow ${
              onHero ? "bg-white/20 backdrop-blur-sm" : "bg-moss"
            }`}>
              <Leaf className="text-sage-100" size={18} />
            </div>
            <span className={`font-bold hidden sm:block tracking-tight transition-colors ${
              onHero ? "text-white" : "text-sage-900"
            }`}>
              SupplyChain Shield
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className={`text-sm ml-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                onHero
                  ? "text-white hover:bg-white/10"
                  : "text-sage-700 hover:bg-sage-100"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`text-sm py-2 px-5 ml-1 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                onHero
                  ? "bg-white text-moss hover:bg-sage-50 shadow-lg"
                  : "btn-primary"
              }`}
            >
              Get Started
            </Link>
          </div>

          <button
            className={`md:hidden p-2 rounded-full transition-colors ${
              onHero ? "hover:bg-white/10" : "hover:bg-sage-100"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X size={22} className={onHero ? "text-white" : "text-sage-700"} />
            ) : (
              <Menu size={22} className={onHero ? "text-white" : "text-sage-700"} />
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-nav px-4 py-4 space-y-1 border-t border-sage-100">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sage-600 py-2.5 px-3 rounded-xl hover:bg-sage-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/login" className="btn-ghost text-center" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="btn-primary text-center text-sm" onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
