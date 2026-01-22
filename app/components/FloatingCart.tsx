"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCartOutline } from "react-icons/io5";
import { Tooltip } from "@heroui/tooltip";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function FloatingCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [pulse, setPulse] = useState(false);
  const router = useRouter();

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
      setTimeout(() => setPulse(false), 250);
      setIsVisible(stored.length > 0);
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  if (cart.length === 0) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const lastItem = cart[cart.length - 1];

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50
      transition-all duration-300
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      
      w-[90%] sm:w-[70%] md:w-[40%] lg:w-[25%]`}
    >
      <div
        className={`bg-white border border-zinc-200
        rounded-2xl px-5 py-4
        flex items-center justify-between
        shadow-xl
        transition-transform
        ${pulse ? "scale-[1.02]" : "scale-100"}`}
      >
        {/* LEFT */}
        <div className="min-w-0">
          <p className="text-xs text-zinc-500">
            {totalItems} item{totalItems > 1 && "s"} in cart
          </p>
          <p className="font-medium text-zinc-900 truncate max-w-[160px]">
            {lastItem.name}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold text-zinc-900">
            ₹{total}
          </p>

          <button
            onClick={() => router.push("/navitems/cart")}
            className="bg-green-600 hover:bg-green-500
                       text-black px-4 py-2
                       rounded-lg font-bold
                       text-sm transition"
          >
           <Tooltip content="Proceed to Cart" className="text-gray-600">
              <IoCartOutline size={20} />
            </Tooltip>
          </button>
        </div>
      </div>
    </div>
  );
}
