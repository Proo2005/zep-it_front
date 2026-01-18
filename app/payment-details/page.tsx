"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentPage() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    paymentMethod: "UPI",
    upiNumber: "",
    upiId: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
    amount: "",
  });

  // Pre-fill logged-in user's name and email
  useEffect(() => {
    const storedName = localStorage.getItem("name") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setForm((prev) => ({ ...prev, userName: storedName, email: storedEmail }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/payment/save", form);
      alert(res.data.message);
      setForm((prev) => ({
        ...prev,
        upiNumber: "",
        upiId: "",
        cardNumber: "",
        cvv: "",
        expiry: "",
        amount: "",
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save payment details");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

        {/* Pre-filled user info */}
        <input
          type="text"
          name="userName"
          placeholder="Full Name"
          value={form.userName}
          readOnly
          className="w-full px-3 py-2 rounded bg-zinc-800 outline-none cursor-not-allowed"
        />

        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={form.email}
          readOnly
          className="w-full px-3 py-2 rounded bg-zinc-800 outline-none cursor-not-allowed"
        />

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
        >
          <option value="UPI">UPI</option>
          <option value="Card">Debit/Credit Card</option>
        </select>

        {form.paymentMethod === "UPI" && (
          <>
            <input
              type="text"
              name="upiNumber"
              placeholder="UPI Number"
              value={form.upiNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
              required
            />
            <input
              type="text"
              name="upiId"
              placeholder="UPI ID"
              value={form.upiId}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
              required
            />
          </>
        )}

        {form.paymentMethod === "Card" && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="14-digit Card Number"
              value={form.cardNumber}
              onChange={handleChange}
              maxLength={14}
              className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV (3 digits)"
              value={form.cvv}
              onChange={handleChange}
              maxLength={3}
              className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
              required
            />
            <input
              type="text"
              name="expiry"
              placeholder="Expiry (MM/YY)"
              value={form.expiry}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
              required
            />
          </>
        )}

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded bg-zinc-800 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-black py-2 rounded-lg font-bold"
        >
          Add Details
        </button>
      </form>
    </div>
  );
}
