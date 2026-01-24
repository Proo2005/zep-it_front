"use client";

import { useEffect, useState } from "react";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://zep-it-back.onrender.com/api/wallet",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setBalance(data?.balance || 0);
  };

  const addMoney = async () => {
    const token = localStorage.getItem("token");

    const orderRes = await fetch(
      "https://zep-it-back.onrender.com/api/wallet/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      }
    );

    const order = await orderRes.json();

    const options = {
      key:"rzp_test_S7hU7z0jJ1lRFZ" ,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,
      handler: async function (response: any) {
        await fetch(
          "https://zep-it-back.onrender.com/api/wallet/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              amount: Number(amount),
            }),
          }
        );

        fetchWallet();
        setAmount("");
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-28">
      <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">My Wallet</h1>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{balance}
          </p>
        </div>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4"
        />

        <button
          onClick={addMoney}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-500"
        >
          Add Money
        </button>
      </div>
    </div>
  );
}
