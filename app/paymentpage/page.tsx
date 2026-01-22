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

  const [userName, setUserName] = useState("Customer");
  const [email, setEmail] = useState("customer@example.com");

  useEffect(() => {
    if (typeof window === "undefined") return;

    setCart(JSON.parse(localStorage.getItem("checkoutCart") || "[]"));
    setTotal(Number(localStorage.getItem("checkoutTotal") || "0"));
    setUserName(localStorage.getItem("name") || "Customer");
    setEmail(localStorage.getItem("email") || "customer@example.com");
  }, []);

  const handlePay = async () => {
    if (paymentMethod === "UPI" && !upiId) {
      alert("Enter UPI ID");
      return;
    }

    if (
      paymentMethod === "Card" &&
      (!cardNumber || !cvv || !expiry || cardNumber.length !== 14 || cvv.length !== 3)
    ) {
      alert("Enter valid card details");
      return;
    }

    try {
      const res = await fetch("https://zep-it-back.onrender.com/api/payment/process", {
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
        alert(data.message || "Payment failed");
      }
    } catch (err) {
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pt-32 ">
        <h1 className="text-3xl font-extrabold mb-6 text-center">
          Secure Payment
        </h1>

        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 space-y-5">
          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-[#0C831F]">₹{total}</span>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-semibold block mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as "UPI" | "Card")}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="UPI">UPI</option>
              <option value="Card">Debit / Credit Card</option>
            </select>
          </div>

          {/* UPI */}
          {paymentMethod === "UPI" && (
            <div>
              <label className="text-sm font-semibold block mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          )}

          {/* Card */}
          {paymentMethod === "Card" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number (14 digits)"
                maxLength={14}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePay}
            className="w-full bg-[#0C831F] hover:bg-[#0A6E1A] text-white py-3 rounded-xl font-extrabold text-lg transition"
          >
            Pay ₹{total}
          </button>

          <p className="text-xs text-center text-gray-500">
            100% secure payments • Encrypted & protected
          </p>
        </div>
      </div>
    </div>
  );
}
