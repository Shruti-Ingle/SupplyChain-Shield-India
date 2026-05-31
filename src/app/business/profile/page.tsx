"use client";

import { useEffect, useState } from "react";

export default function BusinessProfilePage() {
  const [user, setUser] = useState<{ email: string; company_name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  return (
    <div>
      <p className="section-label">Account</p>
      <h1 className="page-heading mb-8">Profile</h1>
      <div className="card-hover max-w-lg space-y-4">
        <div>
          <label className="text-sm text-sage-500">Company Name</label>
          <p className="font-medium">{user?.company_name}</p>
        </div>
        <div>
          <label className="text-sm text-sage-500">Email</label>
          <p className="font-medium">{user?.email}</p>
        </div>
        <div>
          <label className="text-sm text-sage-500">Role</label>
          <p className="font-medium capitalize">Business</p>
        </div>
      </div>
    </div>
  );
}
