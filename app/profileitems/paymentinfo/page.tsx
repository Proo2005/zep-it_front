"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/app/components/Footer";

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

  // Client-only state
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load token & email on client
  useEffect(() => {
    if (typeof window === "undefined") return; // safety check
    setToken(localStorage.getItem("token"));
    setUserEmail(localStorage.getItem("email"));
  }, []);

  // If token/email not loaded yet, show nothing
  if (token === null || userEmail === null)
    return <p className="p-10 text-center">Loading...</p>;

  // If user not logged in
  if (!token || !userEmail)
    return <p className="p-10 text-center">Please login first.</p>;

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 px-4">
        <form
          onSubmit={verifyPasswordAndFetch}
          className="w-full max-w-sm bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5"
        >
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
              🔒
            </div>
            <h2 className="text-xl font-bold text-white">Security Verification</h2>
            <p className="text-sm text-zinc-400">Re-enter your password to continue</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Account Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-black transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Unlock Payments"}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            This extra step keeps your payment details secure
          </p>
        </form>
      </div>
    );
  }

  // Payments display
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F6FB] to-[#E9EDF5] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Saved Payment Methods</h1>
          <p className="text-gray-500 mt-1">Your encrypted UPI & card information</p>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
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
                      p.paymentMethod === "UPI" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {p.paymentMethod}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500">Account Holder</p>
                  <p className="font-semibold text-gray-900">{p.userName}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  {p.paymentMethod === "UPI" && (
                    <>
                      <p><span className="font-medium">UPI ID:</span> {p.upiId}</p>
                      <p><span className="font-medium">Mobile:</span> {p.upiNumber}</p>
                    </>
                  )}
                  {p.paymentMethod === "Card" && (
                    <>
                      <p><span className="font-medium">Card:</span> **** **** **** {p.cardNumber?.slice(-4)}</p>
                      <p><span className="font-medium">Expiry:</span> {p.expiry}</p>
                    </>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">Limit / Balance</span>
                  <span className="font-bold text-green-600">₹{p.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
