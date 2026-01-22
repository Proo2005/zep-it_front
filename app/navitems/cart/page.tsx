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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first");
      router.push("/navitems/login"); // redirect to login page
      return;
    }
    loadCart();
  }, []);

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    calculateTotal(storedCart);
  };

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const increaseQty = (id: string) => {
    const updated = cart.map(item =>
      item.itemId === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cart
      .map(item =>
        item.itemId === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter(item => item.quantity > 0);
    updateCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.itemId !== id);
    updateCart(updated);
  };

  const handlePay = () => {
    if (cart.length === 0) return alert("Cart is empty");
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    localStorage.setItem("checkoutTotal", total.toString());
    router.push("/paymentpage");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24">
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center text-zinc-400 text-lg mt-20">
            Your cart is empty
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map(item => (
                <div
                  key={item.itemId}
                  className="bg-zinc-900 border border-zinc-800 
                             rounded-2xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-green-400 mt-1 font-medium">
                      ₹{item.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-3 py-1">
                      <button
                        onClick={() => decreaseQty(item.itemId)}
                        className="text-xl px-2 hover:text-red-400"
                      >
                        −
                      </button>

                      <span className="font-semibold w-6 text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.itemId)}
                        className="text-xl px-2 hover:text-green-400"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.itemId)}
                      className="text-sm text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-zinc-900 border border-zinc-800 
                            rounded-2xl p-6 h-fit">
              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3 text-zinc-400">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between mb-3 text-zinc-400">
                <span>Delivery</span>
                <span className="text-green-400">Free</span>
              </div>

              <div className="border-t border-zinc-700 my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span className="text-green-400">₹{total}</span>
              </div>

              <button
                onClick={handlePay}
                className="w-full bg-green-600 hover:bg-green-500 
                           text-black py-3 rounded-xl font-bold transition"
              >
                Proceed to Pay ₹{total}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
