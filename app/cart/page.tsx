"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    calculateTotal(storedCart);
  };

  const calculateTotal = (cartItems: CartItem[]) => {
    const t = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(t);
  };

  const handlePay = () => {
    if (cart.length === 0) return alert("Cart is empty");
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    localStorage.setItem("checkoutTotal", total.toString());
    router.push("/paymentpage");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 pb-10">
      <div className="max-w-6xl mx-auto pt-6">

        <h1 className="text-2xl font-bold mb-6 text-white">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-zinc-400 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="flex flex-col md:flex-row items-center justify-between 
                             bg-zinc-900/80 border border-zinc-800 
                             rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-white">
                      {item.name}
                    </h2>
                    <p className="text-green-400 font-semibold mt-1">
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-8 p-4 
                            bg-zinc-900/80 border border-zinc-800 rounded-2xl">
              <span className="text-xl font-bold text-green-400">
                Total: ₹{total}
              </span>

              <button
                onClick={handlePay}
                className="bg-green-600 hover:bg-green-500 
                           text-black py-2.5 px-7 
                           rounded-xl font-bold transition"
              >
                Pay ₹{total}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
