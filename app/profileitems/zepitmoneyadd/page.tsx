"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddMoney = async () => {
    if (!amount || !upiId) return alert("Fill all fields");

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/wallet/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, upiId }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Money added successfully");
        router.push("/profile");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 w-full max-w-md">

        <h2 className="text-xl font-bold mb-6 text-center">
          Add Money via UPI
        </h2>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black border border-zinc-700 focus:outline-none"
        />

        <input
          type="text"
          placeholder="UPI ID (example@bank)"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-black border border-zinc-700 focus:outline-none"
        />

        <button
          onClick={handleAddMoney}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-black font-bold transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Add Money"}
        </button>

      </div>
    </div>
  );
}
