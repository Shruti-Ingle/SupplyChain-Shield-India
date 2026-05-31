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
  { href: "/admin/verification", label: "User Verification", icon: <User size={20} /> },
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
    <div className="min-h-screen flex bg-cream">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-sage-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-sage-100 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-sage-100">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-moss flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Leaf className="text-sage-100" size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-sage-900">SupplyChain</p>
              <p className="text-xs text-sage-500 font-medium">Shield India</p>
            </div>
          </Link>
        </div>

        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${
                  active ? "sidebar-link-active" : "sidebar-link-inactive"
                }`}
              >
                <span className={active ? "text-moss" : "text-sage-400"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sage-100 bg-sage-50/50">
          <p className="text-xs text-sage-400 mb-0.5">Signed in as</p>
          <p className="text-sm font-semibold truncate text-sage-800">{companyName}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-sm text-sage-500 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden glass-nav px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-sage-100 transition-colors">
            <Menu size={22} className="text-sage-700" />
          </button>
          <p className="font-semibold text-sm text-sage-800">SupplyChain Shield</p>
          <button onClick={() => setSidebarOpen(false)} className="p-2 opacity-0">
            <X size={22} />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
