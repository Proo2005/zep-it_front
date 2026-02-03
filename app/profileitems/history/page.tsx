"use client";

import { useEffect, useState } from "react";

type Payment = {
  _id: string;
  amount: number;
  currency: string;
  status: "success" | "failed";
  razorpay_order_id: string;
  razorpay_payment_id: string;
  createdAt: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://zep-it-back.onrender.com/api/payment/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setPayments(data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 pb-16 -mt-24 text-black">
      <div className="max-w-5xl mx-auto pt-32">

        <h1 className="text-3xl font-bold mb-8">Payment History</h1>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && payments.length === 0 && (
          <div className="text-center text-lg mt-20 text-gray-600">
            No payments found
          </div>
        )}

        {/* HISTORY LIST */}
        <div className="space-y-5">
          {payments.map((pay) => (
            <div
              key={pay._id}
              className="bg-white rounded-2xl p-5 shadow-sm border"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">
                    Order #{pay.razorpay_order_id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(pay.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pay.status === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {pay.status.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-600">
                  Items: {pay.items.length}
                </p>
                <p className="text-lg font-bold text-green-600">
                  ₹{pay.amount}
                </p>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-green-600 font-semibold">
                  View items
                </summary>

                <div className="mt-3 space-y-2">
                  {pay.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-gray-700"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
