"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function FloatingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(false);


  useEffect(() => {
    const loadCart = () => {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(stored);

      const sum = stored.reduce(
        (acc: number, item: CartItem) => acc + item.price * item.quantity,
        0
      );
      setTotal(sum);
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
      setIsVisible(stored.length > 0);
    };


    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () =>
      window.removeEventListener("storage", loadCart);
  }, []);

  if (cart.length === 0) return null;

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const lastItem = cart[cart.length - 1];

  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 
              w-[55%] max-w-4xl z-50
              transition-all duration-300 ease-out
              ${isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-6 pointer-events-none"
      }`}>
      <div className={`bg-zinc-900 border border-zinc-800 
              rounded-2xl px-6 py-4 
              flex items-center justify-between 
              shadow-2xl backdrop-blur
              transition-transform
              ${pulse ? "scale-[1.03]" : "scale-100"}`}>

        {/* LEFT INFO */}
        <div>
          <p className="text-sm text-zinc-400">
            {totalItems} item{totalItems > 1 && "s"} in cart
          </p>

          <p className="font-semibold text-zinc-100 truncate max-w-[240px]">
            {lastItem.name}
          </p>
        </div>

        {/* RIGHT ACTION */}
        <div className="flex items-center gap-5">
          <p className="text-lg font-bold text-green-400">
            ₹{total}
          </p>

          <button
            onClick={() => router.push("/navitems/cart")}
            className="bg-green-600 hover:bg-green-500 
                       text-black px-6 py-2.5 
                       rounded-xl font-bold transition"
          >
            View Cart →
          </button>
        </div>
      </div>
    </div>
  );
}
