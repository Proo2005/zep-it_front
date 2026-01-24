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
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;
 
  type LocalCartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

  /* ---------------- CLIENT USER LOADING ---------------- */
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setCurrentUser(JSON.parse(userStr));
    else router.push("/navitems/login"); // redirect if no user
  }, []);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- LOAD RAZORPAY SCRIPT ---------------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
    if (!cartCode) {
      const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("cart") || "[]") : [];
      setCart(stored);
      calculateTotal(stored);
    } else {
      loadCart();
    }
  }, [cartCode]);

  const loadCart = async () => {
    if (!token || !cartCode) return;
    const res = await fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCart(data.items || []);
    calculateTotal(data.items || []);
  };

  const calculateTotal = (items: CartItem[]) => {
    setTotal(items.reduce((acc, i) => acc + i.price * i.quantity, 0));
  };

  /* ---------------- CREATE CART ---------------- */
  const createCart = async () => {
    if (!cart.length) return alert("Cart is empty");
    if (!currentUser) return alert("User info missing.");

    const itemsWithUser = cart.map((i) => ({ ...i, addedBy: currentUser }));
    const res = await fetch(`https://zep-it-back.onrender.com/api/cart/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: itemsWithUser }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Cart created! Code: ${data.code}`);
      localStorage.removeItem("cart");
      router.push(`/navitems/cart/${data.code}`);
    } else alert("Failed to create cart");
  };

  /* ---------------- JOIN CART ---------------- */
  const joinCart = async () => {
    if (!cartCodeInput) return alert("Enter a cart code");
    if (!currentUser) return alert("User info missing.");

    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemsWithUser = localCart.map((i: LocalCartItem) => ({
      ...i,
      addedBy: currentUser, // now TypeScript knows currentUser exists
    }));

    const res = await fetch(`https://zep-it-back.onrender.com/api/cart/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code: cartCodeInput, items: itemsWithUser }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.removeItem("cart");
      router.push(`/navitems/cart/${cartCodeInput}`);
    } else alert("Cart not found or join failed");
  };

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQuantity = async (itemId: string, qty: number) => {
    if (qty < 1 || !cartCode) return;
    await fetch(`https://zep-it-back.onrender.com/api/cart/update-quantity`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cartCode, itemId, quantity: qty }),
    });
    loadCart();
  };

  /* ---------------- RAZORPAY PAYMENT ---------------- */
  const handleRazorpayPayment = async () => {
    if (!cart.length) return alert("Cart is empty");

    const orderRes = await fetch(`https://zep-it-back.onrender.com/api/payment/create-order`, {
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
        const verifyRes = await fetch(`https://zep-it-back.onrender.com/api/payment/verify`, {
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
        alert("Payment successful ✅");
        router.push("/");
      },
      theme: { color: "#0C831F" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>

      {!cartCode && (
        <div className="mb-6 flex gap-4">
          <button onClick={createCart} className="px-4 py-2 bg-green-600 text-white rounded">Create Cart</button>
          <input
            type="text"
            placeholder="Enter cart code"
            value={cartCodeInput}
            onChange={(e) => setCartCodeInput(e.target.value)}
            className="border px-2 rounded"
          />
          <button onClick={joinCart} className="px-4 py-2 bg-blue-600 text-white rounded">Join Cart</button>
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-center mt-10">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.itemId} className="flex justify-between items-center bg-white p-4 rounded shadow">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>₹{item.price} each</p>
                {item.addedBy && <p className="text-sm">Added by: {item.addedBy.name}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 bg-gray-200 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)} className="px-2 bg-gray-200 rounded">+</button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>

          <button onClick={handleRazorpayPayment} className="w-full py-3 mt-4 bg-green-600 text-white rounded">
            Pay ₹{total} with Razorpay
          </button>

          {cartCode && (
            <button onClick={() => router.push(`/navitems/cart/${cartCode}/split`)} className="w-full py-2 mt-2 bg-gray-800 text-white rounded">
              View Split Details
            </button>
          )}
        </div>
      )}
    </div>
  );
}
