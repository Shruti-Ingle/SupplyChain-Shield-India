"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#sustainability", label: "Sustainability Impact" },
    { href: "/#features", label: "Features" },
    { href: "/#about", label: "About" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-500 to-india-green flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">
              SupplyChain Shield India
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-600 hover:text-saffron-600 transition"
              >
                {l.label}
              </a>
            ))}
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-saffron-600">
              Login
            </Link>
            <Link href="/register" className="btn-primary text-sm py-1.5 px-4">
              Register
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-gray-600 py-2"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link href="/login" className="block py-2 text-gray-700 font-medium">
            Login
          </Link>
          <Link href="/register" className="btn-primary inline-block text-sm">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
