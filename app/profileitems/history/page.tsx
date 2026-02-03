"use client";

import { useEffect, useState } from "react";
import PageTransition from "@/app/components/animations/PageTransition";

type PaymentItem = {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPayments = async () => {
      try {
        const res = await fetch(
          "https://zep-it-back.onrender.com/api/payment/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch payments");

        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">Loading payments...</div>
    );
  }

  if (!payments.length) {
    return <div className="p-8 text-center text-gray-600">No payments found.</div>;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Payment History</h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-4 py-2 text-left">Payment ID</th>
                <th className="border px-4 py-2 text-left">Amount</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Items</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="border px-4 py-2">{payment._id.slice(-6)}</td>
                  <td className="border px-4 py-2">₹{payment.amount}</td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      payment.status === "success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {payment.status}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    <ul className="space-y-1">
                      {payment.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} x {item.quantity} (₹{item.price * item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
