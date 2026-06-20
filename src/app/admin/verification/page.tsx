"use client";

import { useEffect, useState } from "react";

interface UserRow {
  id: number;
  email: string;
  company_name: string;
  phone?: string;
  contact_person?: string;
  verification_status: string;
  role: string;
}

export default function VerificationPage() {
  const [transporters, setTransporters] = useState<UserRow[]>([]);
  const [businesses, setBusinesses] = useState<UserRow[]>([]);
  const [admins, setAdmins] = useState<UserRow[]>([]);

  const load = async () => {
    const res = await fetch("/api/admin/users");
    const d = await res.json();

    setTransporters(Array.isArray(d.transporters) ? d.transporters : []);
    setBusinesses(Array.isArray(d.businesses) ? d.businesses : []);
    setAdmins(Array.isArray(d.admins) ? d.admins : []);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (userId: number, status: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, status }),
    });

    load();
  };

  const UserTable = ({ title, users }: { title: string; users: UserRow[] }) => (
    <div className="card mb-6 overflow-x-auto">
      <h2 className="font-bold mb-4">{title}</h2>

      {users.length === 0 ? (
        <p className="text-sm text-sage-500">No users found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-sage-500">
              <th className="pb-3 pr-4">Company / Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Role</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{u.company_name}</td>
                <td className="py-3 pr-4">{u.email}</td>
                <td className="py-3 pr-4 capitalize">{u.role}</td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {u.verification_status || "approved"}
                  </span>
                </td>

                <td className="py-3 flex gap-2">
                  {u.role !== "admin" && (
                    <>
                      <button
                        onClick={() => updateStatus(u.id, "approved")}
                        className="text-xs text-green-600 font-medium"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(u.id, "rejected")}
                        className="text-xs text-red-600 font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      <p className="section-label">Administration</p>
      <h1 className="page-heading mb-8">User Verification</h1>

      <UserTable title="Admins" users={admins} />
      <UserTable title="Transporters" users={transporters} />
      <UserTable title="Businesses" users={businesses} />
    </div>
  );
}
