"use client";

import { useState } from "react";
import axios from "axios";

type Payment = {
  _id: string;
  userName: string;
  email: string;
  paymentMethod: "UPI" | "Card";
  upiNumber?: string;
  upiId?: string;
  cardNumber?: string;
  expiry?: string;
  amount: number;
  createdAt: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

  if (!token || !userEmail) return <p className="p-10 text-center">Please login first.</p>;

  const verifyPasswordAndFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return alert("Please enter your password");

    setLoading(true);

    try {
      // Re-auth endpoint: backend should verify password for this user
      const authRes = await axios.post(
        "http://localhost:5000/api/auth/verify-password",
        { email: userEmail, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (authRes.data.success) {
        setAuthenticated(true);

        // Fetch payments
        const res = await axios.get("http://localhost:5000/api/payment", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } else {
        alert("Incorrect password");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={verifyPasswordAndFetch}
          className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900 text-center">Verify Password</h2>
          <p className="text-sm text-gray-500 text-center">
            Please enter your password to access payment details
          </p>

          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-500 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & View Payments"}
          </button>
        </form>
      </div>
    );
  }

  // Payments display (same as before)
  return (
    <div className="min-h-screen bg-[#F4F6FB] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Saved Payment Methods</h1>
          <p className="text-gray-500 mt-1">Manage your saved UPI & card details securely</p>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">
            <p className="text-gray-500">No payment methods found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      p.paymentMethod === "UPI"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {p.paymentMethod}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-500">Account Holder</p>
                  <p className="font-semibold text-gray-900">{p.userName}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  {p.paymentMethod === "UPI" && (
                    <>
                      <p>
                        <span className="font-medium">UPI ID:</span> {p.upiId}
                      </p>
                      <p>
                        <span className="font-medium">Mobile:</span> {p.upiNumber}
                      </p>
                    </>
                  )}
                  {p.paymentMethod === "Card" && (
                    <>
                      <p>
                        <span className="font-medium">Card:</span> **** **** ****{" "}
                        {p.cardNumber?.slice(-4)}
                      </p>
                      <p>
                        <span className="font-medium">Expiry:</span> {p.expiry}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">Limit / Amount</span>
                  <span className="font-bold text-green-600">
                    ₹{p.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
