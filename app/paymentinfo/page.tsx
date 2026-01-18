"use client";

import { useEffect, useState } from "react";

type Payment = {
  _id: string;
  userName: string;
  paymentMethod: "UPI" | "Card";
  upiId?: string;
  cardNumber?: string;
  amount: number;
};

export default function PaymentDetailsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/payment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPayments(data.payments);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Payment Methods</h1>

      {payments.length === 0 ? (
        <p className="text-zinc-400">No payment details found.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center p-4 bg-zinc-900 rounded-xl"
            >
              <div>
                <p className="font-semibold">{p.userName}</p>
                <p className="text-zinc-400">Method: {p.paymentMethod}</p>
                {p.paymentMethod === "Card" && p.cardNumber && (
                  <p className="text-zinc-400">
                    Card: **** **** **** {p.cardNumber.slice(-4)}
                  </p>
                )}
                {p.paymentMethod === "UPI" && p.upiId && (
                  <p className="text-zinc-400">UPI ID: {p.upiId}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-green-400">₹{p.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
