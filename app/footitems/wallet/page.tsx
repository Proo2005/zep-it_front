"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ZepitMoneyPage() {
  const [balance, setBalance] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const res = await fetch("https://zep-it-back.onrender.com/api/wallet", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) setBalance(data.balance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          ZepitMoney Wallet
        </h1>

        <div className="bg-black rounded-2xl p-6 text-center mb-6">
          <p className="text-zinc-400 text-sm">Available Balance</p>
          <p className="text-4xl font-extrabold text-green-400 mt-2">
            ₹{balance}
          </p>
        </div>

        <button
          onClick={() => router.push("/profileitems/zepitmoneyadd")}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-black font-bold transition"
        >
          + Add Money
        </button>

      </div>
    </div>
  );
}
