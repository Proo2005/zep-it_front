"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";

type PaymentItem = {
  name: string;
  quantity: number;
  price: number;
  addedBy?: {
    name: string;
    email: string;
  };
};

type Payment = {
  _id: string;
  amount: number;
  items: PaymentItem[];
  createdAt: string;
  user: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/payments/all");
        setPayments(res.data);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-6 py-10 text-black -mt-24">
      <div className="max-w-7xl mx-auto pt-32 space-y-8">
        <h1 className="text-3xl font-bold">Payment History</h1>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b last:border-none">
                  <td className="px-4 py-3 font-medium">
                    {payment._id.slice(-6)}
                  </td>

                  <td className="px-4 py-3">
                    <ul className="space-y-1">
                      {payment.items.map((item, i) => (
                        <li key={i} className="text-gray-700">
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ₹{payment.amount}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payments.length === 0 && (
            <p className="text-center py-6 text-gray-500">
              No payments found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
