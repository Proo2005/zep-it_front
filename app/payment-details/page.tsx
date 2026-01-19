"use client";

import { useState } from "react";
import axios from "axios";

export default function AddPaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card">("UPI");
  const [upiNumber, setUpiNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      await axios.post(
        "http://localhost:5000/api/payment/add",
        {
          paymentMethod,
          upiNumber,
          upiId,
          cardNumber,
          cvv,
          expiry,
          amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Payment method saved");
      setUpiNumber("");
      setUpiId("");
      setCardNumber("");
      setCvv("");
      setExpiry("");
      setAmount("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save payment");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Add Payment Method</h2>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as any)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>

        {paymentMethod === "UPI" && (
          <>
            <input
              placeholder="UPI Number"
              value={upiNumber}
              onChange={(e) => setUpiNumber(e.target.value)}
              className="input"
              required
            />
            <input
              placeholder="UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="input"
              required
            />
          </>
        )}

        {paymentMethod === "Card" && (
          <>
            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="input"
              required
            />
            <div className="flex gap-3">
              <input
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="input w-1/2"
                required
              />
              <input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="input w-1/2"
                required
              />
            </div>
          </>
        )}

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
          required
        />

        <button className="w-full bg-green-600 text-black py-2 rounded font-bold">
          Save Payment
        </button>
      </form>
    </div>
  );
}
