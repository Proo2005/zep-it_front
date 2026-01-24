"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy?: {
    name: string;
    email: string;
  };
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;

  /* ---------------- LOAD RAZORPAY SCRIPT ---------------- */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      router.push("/navitems/login");
      return;
    }
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!cartCode) {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(stored);
      calculateTotal(stored);
      return;
    }

    const res = await fetch(
      `https://zep-it-back.onrender.com/api/cart/${cartCode}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setCart(data.items || []);
    calculateTotal(data.items || []);
  };

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  /* ---------------- RAZORPAY PAYMENT (FIXED) ---------------- */
  const handleRazorpayPayment = async () => {
    if (!cart.length) return alert("Cart is empty");

    const token = localStorage.getItem("token");

    // 1️⃣ CREATE ORDER
    const orderRes = await fetch(
      "https://zep-it-back.onrender.com/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: total }),
      }
    );

    const order = await orderRes.json();

    // 2️⃣ RAZORPAY OPTIONS
    const options = {
      key: "rzp_test_S7hU7z0jJ1lRFZ", // move to env later
      amount: order.amount,
      currency: "INR",
      name: "ZepIt Store",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response: any) {
        try {
          // 3️⃣ VERIFY PAYMENT + SAVE TO DB
          const verifyRes = await fetch(
            "https://zep-it-back.onrender.com/api/payment/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart,
                amount: total,
                cartCode: cartCode || null,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (!verifyData.success) {
            alert("Payment verification failed");
            return;
          }

          // 4️⃣ CLEAR CART
          localStorage.removeItem("cart");

          alert("Payment successful ✅");
          router.push("/");

        } catch (err) {
          console.error(err);
          alert("Payment failed");
        }
      },

      theme: { color: "#0C831F" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 pb-16 -mt-24 text-black">
      <div className="max-w-6xl mx-auto pt-32">

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center text-lg mt-20">
            Your cart is empty
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div
                  key={item.itemId}
                  className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-green-600 font-medium">
                      ₹{item.price} each
                    </p>
                  </div>

                  <span className="font-bold">x{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">₹{total}</span>
              </div>

              <button
                onClick={handleRazorpayPayment}
                className="w-full bg-green-600 hover:bg-green-500 text-black py-3 rounded-xl font-bold"
              >
                Pay ₹{total} with Razorpay
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
