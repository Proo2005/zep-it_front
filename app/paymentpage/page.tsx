"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PaymentPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [userName, setUserName] = useState("Customer");
  const [email, setEmail] = useState("customer@example.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    setCart(JSON.parse(localStorage.getItem("checkoutCart") || "[]"));
    setTotal(Number(localStorage.getItem("checkoutTotal") || "0"));
    setUserName(localStorage.getItem("name") || "Customer");
    setEmail(localStorage.getItem("email") || "customer@example.com");
  }, []);

  const handlePay = async () => {
    if (total <= 0) {
      alert("Your cart is empty or total is invalid.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Request order generation from the backend
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://zep-it-back.onrender.com/api";

      const res = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          cart,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.message || "Failed to initialize payment gateway");
      }

      // 2. Configure the Razorpay Modal securely
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Zep-It",
        description: "Secure Quick Commerce Checkout",
        order_id: orderData.id,
        handler: function (response: any) {
          // Triggered only upon successful payment authorization in the UI
          localStorage.removeItem("cart");
          localStorage.removeItem("checkoutCart");
          localStorage.removeItem("checkoutTotal");
          
          alert("Payment Successful! Redirecting to your orders...");
          router.push("/profileitems/history");
        },
        prefill: {
          name: userName,
          email: email,
        },
        theme: {
          color: "#0C831F", // Zep-It brand green
        },
      };

      // 3. Instantiate and open the isolated Razorpay iframe
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        console.error(response.error);
        alert("Payment failed or was cancelled. Please try again.");
      });
      
      rzp.open();
    } catch (err: any) {
      console.error("Checkout Error:", err);
      alert(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Required script injection for the Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
        <div className="max-w-xl mx-auto gap-8 pt-32">
          <h1 className="text-3xl font-extrabold mb-6 text-center">Secure Checkout</h1>

          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 space-y-6">
            
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-1">Order Summary</h2>
              <p className="text-sm text-gray-500">Review your total before proceeding to the gateway.</p>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <span className="text-sm font-medium text-gray-600">Total Amount Payable</span>
              <span className="text-2xl font-bold text-[#0C831F]">₹{total}</span>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <p className="text-xs text-blue-700 leading-relaxed">
                You will be securely redirected to the Razorpay gateway. Zep-It does not store or process your card details on our servers.
              </p>
            </div>

            <button
              onClick={handlePay}
              disabled={isProcessing || total <= 0}
              className={`w-full py-4 rounded-xl font-extrabold text-lg transition flex justify-center items-center ${
                isProcessing || total <= 0 
                  ? "bg-gray-400 cursor-not-allowed text-white" 
                  : "bg-[#0C831F] hover:bg-[#0A6E1A] text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isProcessing ? (
                <span className="animate-pulse">Initializing Gateway...</span>
              ) : (
                `Proceed to Pay ₹${total}`
              )}
            </button>

            <div className="flex justify-center items-center space-x-2 pt-2">
              <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay Secured" className="h-4 opacity-50 grayscale" />
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                100% Secure Processing
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}