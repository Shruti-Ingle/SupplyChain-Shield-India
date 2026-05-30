"use client";

import { useEffect, useState } from "react";

export default function TransporterProfilePage() {
  const [user, setUser] = useState<{ email: string; company_name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="card max-w-lg space-y-4">
        <div>
          <label className="text-sm text-gray-500">Company Name</label>
          <p className="font-medium">{user?.company_name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Role</label>
          <p className="font-medium capitalize">Transporter</p>
        </div>
      </div>
    </div>
  );
}
