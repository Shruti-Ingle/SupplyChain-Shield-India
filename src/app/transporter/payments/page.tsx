"use client";

import { useToast } from "@/components/Toast";

const transactions = [
  { id: 1, date: "2026-05-28", desc: "Trip payment - Mumbai→Ahmedabad", amount: 18500, type: "credit" },
  { id: 2, date: "2026-05-25", desc: "Trip payment - Pune→Nagpur", amount: 12200, type: "credit" },
  { id: 3, date: "2026-05-20", desc: "Withdrawal", amount: -10000, type: "debit" },
  { id: 4, date: "2026-05-15", desc: "Trip payment - Delhi→Jaipur", amount: 8900, type: "credit" },
];

export default function TransporterPaymentsPage() {
  const { showToast, ToastComponent } = useToast();

  return (
    <div>
      {ToastComponent}
      <p className="section-label">Billing</p>
      <h1 className="page-heading mb-8">Payments</h1>
      <div className="card-hover mb-6 max-w-sm">
        <p className="text-sm text-sage-500">Wallet Balance</p>
        <p className="text-3xl font-bold text-moss">₹29,600</p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => showToast("Demo mode – payment not integrated")} className="btn-primary text-sm">Add Money</button>
          <button onClick={() => showToast("Demo mode – payment not integrated")} className="btn-outline text-sm">Withdraw</button>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <h2 className="font-bold mb-4">Recent Transactions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-sage-500">
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
