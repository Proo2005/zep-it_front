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
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-6 "
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Add Payment Method
        </h2>

        {/* Payment Method Tabs */}
        <div className="flex justify-center gap-4 mb-2 ">
          {(["UPI", "Card"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                paymentMethod === method
                  ? "bg-green-500 text-black shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* UPI Fields */}
        {paymentMethod === "UPI" && (
          <div className="space-y-4  text-black">
            <input
              placeholder="UPI Number"
              value={upiNumber}
              onChange={(e) => setUpiNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <input
              placeholder="UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>
        )}

        {/* Card Fields */}
        {paymentMethod === "Card" && (
          <div className="space-y-4  text-black">
            <input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <div className="flex gap-3  text-black">
              <input
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
              <input
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none  text-black"
          required
        />

        

        <button
          type="submit"
          className="w-full bg-green-500 text-black py-2 rounded-xl font-bold hover:bg-green-400 transition"
        >
          Save Payment
        </button>
      </form>
    </div>
  );
}
