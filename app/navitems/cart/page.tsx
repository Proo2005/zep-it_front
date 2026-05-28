"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Script from "next/script";
import { Alert } from "@heroui/alert";
import PaymentSuccessCSS from "@/app/components/animations/Payment";

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
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://zep-it-back.onrender.com/api";

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAlert(true);
      setTimeout(() => {
        router.push("/navitems/login");
      }, 600);
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
    try {
      const res = await fetch(`${apiUrl}/cart/${cartCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.items || []);
      calculateTotal(data.items || []);
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
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
    window.dispatchEvent(new Event("cartUpdated"));
    setCart([]);
    calculateTotal(0);
  };

  /* ---------------- CREATE / JOIN CART ---------------- */
  const createCart = async () => {
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/cart/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: cart }),
    });

    const data = await res.json();

    if (data.success) {
      const newCartCode = data.code;
      await navigator.clipboard.writeText(newCartCode);
      alert(`Cart created!\nCode: ${newCartCode}\n(Copied to clipboard)`);
      router.replace(`/navitems/cart/${newCartCode}`);
    } else {
      alert("Failed to create cart");
    }
  };

  const joinCart = async () => {
    if (!cartCodeInput) return alert("Enter cart code");

    const token = localStorage.getItem("token");
    const res = await fetch(`${apiUrl}/cart/join`, {
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
      const updatedCart = cart.map((i) =>
        i.itemId === item.itemId ? { ...i, quantity: newQty } : i
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      calculateTotal(updatedCart);
    } else {
      const token = localStorage.getItem("token");
      await fetch(`${apiUrl}/cart/update-quantity`, {
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
    
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Generate Pending Order via Backend
      const orderRes = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          amount: total,
          cart,
          cartCode: cartCode || null 
        }),
      });
      
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // 2. Configure Gateway securely using ENV variables
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ZepIt Store",
        description: "Secure Order Payment",
        order_id: orderData.id,
        handler: function (response: any) {
          // Frontend verification is removed. The webhook handles database updates.
          // We simply handle the UI transition here.
          
          const cartQuery = encodeURIComponent(JSON.stringify(cart));
          const url = `/navitems/delivery/${orderData.id || cartCode}?cart=${cartQuery}`;

          setRedirectUrl(url);
          setShowSuccess(true);
          
          window.dispatchEvent(new Event("cartUpdated"));
          if (!cartCode) {
            localStorage.removeItem("cart");
          }
        },
        theme: { color: "#0C831F" },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function () {
        alert("Payment failed or was cancelled.");
        setIsProcessing(false);
      });
      razorpay.open();

    } catch (error: any) {
      console.error("Payment initialization error:", error);
      alert(error.message || "Unable to start payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 pb-16 -mt-24 text-black">
        {showAlert && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              width: "90%",
              maxWidth: "420px",
            }}
          >
            <Alert
              title="Login required"
              description="Please login first to continue"
              color="warning"
              variant="flat"
            />
          </div>
        )}

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
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
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
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-bold transition flex justify-center items-center ${
                    isProcessing 
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : "bg-green-600 hover:bg-green-500 text-black shadow-md"
                  }`}
                >
                  {isProcessing ? "Initializing Gateway..." : `Pay ₹${total} with Razorpay`}
                </button>

                {cartCode && (
                  <button
                    onClick={() => router.push(`/cart/${cartCode}/split`)}
                    className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition"
                  >
                    View Split Details
                  </button>
                )}

                <button
                  onClick={emptyCart}
                  className="w-full mt-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
        
        {showSuccess && (
          <PaymentSuccessCSS
            onDone={() => {
              setShowSuccess(false);
              router.push(redirectUrl);
            }}
          />
        )}
      </div>
    </>
  );
}