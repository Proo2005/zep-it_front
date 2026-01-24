"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type User = { name: string; email: string };
type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy?: User;
};

type SplitInfo = {
  user: User;
  total: number;
  items: CartItem[];
};

export default function CartSplitPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [split, setSplit] = useState<SplitInfo[]>([]);
  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) router.push("/navitems/login");
    if (cartCode) loadCart();
  }, [cartCode, token]);

  const loadCart = async () => {
    const res = await fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const items: CartItem[] = data.items || [];
    setCart(items);

    // Calculate split
    const splitMap: Record<string, SplitInfo> = {};
    items.forEach((item) => {
      if (!item.addedBy) return;
      const key = item.addedBy.email;
      if (!splitMap[key]) splitMap[key] = { user: item.addedBy, total: 0, items: [] };
      splitMap[key].items.push(item);
      splitMap[key].total += item.price * item.quantity;
    });

    setSplit(Object.values(splitMap));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 pb-16 -mt-24 text-black">
      <div className="max-w-4xl mx-auto pt-32">
        <h1 className="text-3xl font-bold mb-8">Split Details</h1>

        {split.length === 0 ? (
          <p className="text-center text-lg mt-10">No items in the cart.</p>
        ) : (
          split.map((s) => (
            <div key={s.user.email} className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">{s.user.name}'s Items</h2>

              <ul className="mb-4 space-y-2">
                {s.items.map((item) => (
                  <li key={item.itemId} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{s.total}</span>
              </div>
            </div>
          ))
        )}

        <button
          onClick={() => router.back()}
          className="mt-4 py-2 px-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
