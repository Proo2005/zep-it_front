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
    if (!token) return router.push("/navitems/login");

    setLoading(true);

    try {
      const res = await fetch("https://zep-it-back.onrender.com/api/wallet/add", {
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
        router.push("/navitems/profile");
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
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
      <div className="max-w-7xl mx-auto  gap-8 pt-32">

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
