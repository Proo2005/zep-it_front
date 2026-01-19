"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PaymentPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Card">("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const userName = localStorage.getItem("name") || "Customer";
  const email = localStorage.getItem("email") || "customer@example.com";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
    const storedTotal = Number(localStorage.getItem("checkoutTotal") || "0");
    setCart(storedCart);
    setTotal(storedTotal);
  }, []);

  const handlePay = async () => {
    if (paymentMethod === "UPI" && !upiId) return alert("Enter UPI ID");
    if (
      paymentMethod === "Card" &&
      (!cardNumber || !cvv || !expiry || cardNumber.length !== 14 || cvv.length !== 3)
    )
      return alert("Enter valid card details");

    try {
      const res = await fetch("http://localhost:5000/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          email,
          paymentMethod,
          upiId,
          cardNumber,
          cvv,
          expiry,
          cart,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Payment successful!");
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutCart");
        localStorage.removeItem("checkoutTotal");
        router.push("/");
      } else {
        alert("Payment failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl space-y-4">
        <div className="text-lg font-semibold">Total Amount: ₹{total}</div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "UPI" | "Card")}
            className="p-2 rounded bg-zinc-800 text-white outline-none"
          >
            <option value="UPI">UPI</option>
            <option value="Card">Debit/Credit Card</option>
          </select>
        </div>

        {paymentMethod === "UPI" && (
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
          />
        )}

        {paymentMethod === "Card" && (
          <>
            <input
              type="text"
              placeholder="Card Number (14 digits)"
              maxLength={14}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
            />
            <input
              type="text"
              placeholder="CVV (3 digits)"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-white outline-none"
            />
          </>
        )}

        <button
          onClick={handlePay}
          className="w-full bg-green-600 hover:bg-green-500 text-black py-2 rounded font-bold mt-4"
        >
          Pay ₹{total}
        </button>
      </div>
    </div>
  );
}
