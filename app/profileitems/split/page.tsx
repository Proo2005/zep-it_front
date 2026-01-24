"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy?: { name: string; email: string };
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [cartCodeInput, setCartCodeInput] = useState("");
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
  }, [cartCode]);

  const loadCart = async () => {
    if (!cartCode) {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(stored);
      calculateTotal(stored);
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCart(data.items || []);
    calculateTotal(data.items || []);
  };

  const calculateTotal = (items: CartItem[] | number) => {
    if (typeof items === "number") {
      setTotal(items);
    } else {
      setTotal(items.reduce((acc, item) => acc + item.price * item.quantity, 0));
    }
  };

  const emptyCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    calculateTotal(0);
  };

  /* ---------------- CREATE / JOIN CART ---------------- */
  const createCart = async () => {
    if (!cart.length) return alert("Cart is empty");

    const token = localStorage.getItem("token");
    const res = await fetch("https://zep-it-back.onrender.com/api/cart/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: cart }),
    });
    const data = await res.json();

    if (data.success) {
      alert(`Cart created! Code: ${data.code}`);
      router.replace(`/navitems/cart/${data.code}`);
    } else {
      alert("Failed to create cart");
    }
  };

  const joinCart = async () => {
    if (!cartCodeInput) return alert("Enter cart code");

    const token = localStorage.getItem("token");
    const res = await fetch("https://zep-it-back.onrender.com/api/cart/join", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code: cartCodeInput }),
    });
    const data = await res.json();

    if (data.success) {
      setCartCodeInput("");
      router.replace(`/navitems/cart/${cartCodeInput}`);
    } else {
      alert("Cart not found");
    }
  };

  /* ---------------- UPDATE ITEM QUANTITY ---------------- */
  const updateQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    if (!cartCode) {
      // Update local cart
      const updatedCart = cart.map((i) =>
        i.itemId === item.itemId ? { ...i, quantity: newQty } : i
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      calculateTotal(updatedCart);
    } else {
      // Update server cart
      const token = localStorage.getItem("token");
      await fetch("https://zep-it-back.onrender.com/api/cart/update-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cartCode, itemId: item.itemId, quantity: newQty }),
      });
      loadCart();
    }
  };

  /* ---------------- RAZORPAY PAYMENT ---------------- */
  const handleRazorpayPayment = async () => {
    if (!cart.length) return alert("Cart is empty");

    const token = localStorage.getItem("token");

    const orderRes = await fetch("https://zep-it-back.onrender.com/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: total }),
    });
    const order = await orderRes.json();

    const options = {
      key: "rzp_test_S7hU7z0jJ1lRFZ",
      amount: order.amount,
      currency: "INR",
      name: "ZepIt Store",
      description: "Order Payment",
      order_id: order.id,
      handler: async (response: any) => {
        const verifyRes = await fetch("https://zep-it-back.onrender.com/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cart,
            amount: total,
            cartCode: cartCode || null,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) return alert("Payment verification failed");
        localStorage.removeItem("cart");
        alert("Payment successful ✅");
        router.push("/");
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

        {!cartCode && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={createCart}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 font-bold"
            >
              Create Cart
            </button>
            <input
              type="text"
              placeholder="Enter Cart Code"
              value={cartCodeInput}
              onChange={(e) => setCartCodeInput(e.target.value)}
              className="border px-3 py-2 rounded-xl"
            />
            <button
              onClick={joinCart}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold"
            >
              Join Cart
            </button>
            <button
              onClick={emptyCart}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 font-bold"
            >
              Clear Cart
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center text-lg mt-20">Your cart is empty</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-green-600 font-medium">₹{item.price} each</p>
                    {item.addedBy && <p className="text-sm">Added by: {item.addedBy.name}</p>}
                  </div>

                  {/* QUANTITY ADJUST */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item, -1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item, 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit space-y-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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

              {cartCode && (
                <button
                  onClick={() => router.push(`/cart/${cartCode}/split`)}
                  className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold"
                >
                  View Split Details
                </button>
              )}

              {/* CLEAR CART BUTTON IN SUMMARY */}
              <button
                onClick={emptyCart}
                className="w-full mt-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
