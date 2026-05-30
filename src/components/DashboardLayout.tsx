"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Route,
  PackageSearch,
  MapPin,
  Leaf,
  Wallet,
  User,
  Menu,
  X,
  LogOut,
  Shield,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "transporter" | "business" | "admin";
  companyName: string;
}

const transporterNav: NavItem[] = [
  { href: "/transporter/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/transporter/fleet", label: "Fleet", icon: <Truck size={20} /> },
  { href: "/transporter/routes", label: "Available Routes", icon: <Route size={20} /> },
  { href: "/transporter/matches", label: "Shipment Matches", icon: <PackageSearch size={20} /> },
  { href: "/transporter/trips", label: "My Trips", icon: <MapPin size={20} /> },
  { href: "/transporter/sustainability", label: "Sustainability", icon: <Leaf size={20} /> },
  { href: "/transporter/payments", label: "Payments", icon: <Wallet size={20} /> },
  { href: "/transporter/profile", label: "Profile", icon: <User size={20} /> },
];

const businessNav: NavItem[] = [
  { href: "/business/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/business/create-shipment", label: "Create Shipment", icon: <PackageSearch size={20} /> },
  { href: "/business/transporters", label: "Available Transporters", icon: <Truck size={20} /> },
  { href: "/business/shipments", label: "My Shipments", icon: <Route size={20} /> },
  { href: "/business/sustainability", label: "Sustainability", icon: <Leaf size={20} /> },
  { href: "/business/payments", label: "Payments", icon: <Wallet size={20} /> },
  { href: "/business/profile", label: "Profile", icon: <User size={20} /> },
];

const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/verification", label: "User Verification", icon: <Shield size={20} /> },
  { href: "/admin/shipments", label: "Shipment Monitoring", icon: <MapPin size={20} /> },
  { href: "/admin/sustainability", label: "Sustainability Analytics", icon: <Leaf size={20} /> },
];

export default function DashboardLayout({
  children,
  role,
  companyName,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const nav =
    role === "transporter"
      ? transporterNav
      : role === "business"
        ? businessNav
        : adminNav;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-india-green flex items-center justify-center">
              <Shield className="text-white" size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">SupplyChain</p>
              <p className="text-xs text-india-green font-semibold">Shield India</p>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-saffron-50 text-saffron-700 border border-saffron-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Signed in as</p>
          <p className="text-sm font-semibold truncate">{companyName}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu size={24} />
          </button>
          <p className="font-semibold text-sm">SupplyChain Shield India</p>
          <button onClick={() => setSidebarOpen(false)} className="p-1 opacity-0">
            <X size={24} />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
