"use client";

import { useToast } from "@/components/Toast";

const transactions = [
  { id: 1, date: "2026-05-28", desc: "Shipment - Mumbai→Ahmedabad", amount: -15725, type: "debit" },
  { id: 2, date: "2026-05-25", desc: "Shipment - Pune→Nagpur", amount: -10370, type: "debit" },
  { id: 3, date: "2026-05-20", desc: "Wallet top-up", amount: 50000, type: "credit" },
];

export default function BusinessPaymentsPage() {
  const { showToast, ToastComponent } = useToast();

  return (
    <div>
      {ToastComponent}
      <h1 className="text-2xl font-bold mb-6">Payments</h1>
      <div className="card mb-6 max-w-sm">
        <p className="text-sm text-gray-500">Wallet Balance</p>
        <p className="text-3xl font-bold text-india-green">₹23,905</p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => showToast("Demo mode – payment not integrated")} className="btn-primary text-sm">Add Money</button>
          <button onClick={() => showToast("Demo mode – payment not integrated")} className="btn-outline text-sm">Withdraw</button>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <h2 className="font-bold mb-4">Recent Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3">Date</th>
              <th className="pb-3">Description</th>
              <th className="pb-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-50">
                <td className="py-3">{t.date}</td>
                <td className="py-3">{t.desc}</td>
                <td className={`py-3 text-right font-medium ${t.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "credit" ? "+" : ""}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
