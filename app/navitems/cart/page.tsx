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

  /* ---------------- HELPERS ---------------- */
  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  /* ---------------- QUANTITY HANDLERS ---------------- */
  const increaseQty = async (itemId: string) => {
    if (!cartCode) {
      const updated = cart.map((i) =>
        i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      calculateTotal(updated);
      return;
    }

    await fetch(`https://zep-it-back.onrender.com/api/cart/add/${cartCode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity: 1 }),
    });

    loadCart();
  };

  const decreaseQty = async (itemId: string) => {
    if (!cartCode) {
      const updated = cart
        .map((i) =>
          i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      calculateTotal(updated);
      return;
    }

    await fetch(`https://zep-it-back.onrender.com/api/cart/remove/${cartCode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity: 1 }),
    });

    loadCart();
  };

  /* ---------------- RAZORPAY PAYMENT ---------------- */
  const handleRazorpayPayment = async () => {
    if (!cart.length) return alert("Cart is empty");

    const res = await fetch(
      "https://zep-it-back.onrender.com/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: total }),
      }
    );

    const order = await res.json();

    const options = {
      key: "rzp_test_S7hU7z0jJ1lRFZ", // 🔴 replace with real key
      amount: order.amount,
      currency: "INR",
      name: "ZepIt Store",
      description: "Order Payment",
      order_id: order.id,
      handler: function (response: any) {
        alert("Payment Successful ✅");
        console.log("Payment response:", response);

        // optional: clear cart
        localStorage.removeItem("cart");
        router.push("/");
      },
      theme: {
        color: "#0C831F",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  /* ---------------- CREATE SHARED CART ---------------- */
  const createSharedCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    const res = await fetch("https://zep-it-back.onrender.com/api/cart/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.cartCode) {
      navigator.clipboard.writeText(data.cartCode);
      alert(`Shared Cart Created! Code copied`);
      router.push(`/navitems/cart/${data.cartCode}`);
    }
  };

  /* ---------------- JOIN CART ---------------- */
  const joinCart = () => {
    const code = prompt("Enter cart code to join:");
    if (!code) return;
    router.push(`/navitems/cart/${code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 pb-16 -mt-24 text-black">
      <div className="max-w-6xl mx-auto pt-32">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>

          {!cartCode && (
            <div className="flex gap-4">
              <button
                onClick={createSharedCart}
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
              >
                Create Shared Cart
              </button>
              <button
                onClick={joinCart}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Join Shared Cart
              </button>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center text-lg mt-20">
            Your cart is empty
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
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
                    {item.addedBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        Added by {item.addedBy.name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1">
                    <button onClick={() => decreaseQty(item.itemId)}>−</button>
                    <span className="w-6 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button onClick={() => increaseQty(item.itemId)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="flex justify-between mb-2">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
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
