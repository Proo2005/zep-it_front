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

type UserSplit = {
  user: string;
  items: CartItem[];
  total: number;
};

export default function CartSplitPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userSplits, setUserSplits] = useState<UserSplit[]>([]);
  const [total, setTotal] = useState(0);

  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;

  useEffect(() => {
    if (!cartCode) {
      alert("No cart code provided");
      router.push("/navitems/cart");
      return;
    }
    loadCart();
  }, [cartCode]);

  const loadCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      router.push("/navitems/login");
      return;
    }

    const res = await fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const items: CartItem[] = data.items || [];
    setCart(items);
    calculateTotal(items);
    calculateSplit(items);
  };

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const calculateSplit = (items: CartItem[]) => {
    const splitMap: Record<string, CartItem[]> = {};

    items.forEach((item) => {
      const user = item.addedBy?.name || "Unknown";
      if (!splitMap[user]) splitMap[user] = [];
      splitMap[user].push(item);
    });

    const splits: UserSplit[] = Object.entries(splitMap).map(([user, items]) => ({
      user,
      items,
      total: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }));

    setUserSplits(splits);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 pt-32 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Split Details</h1>

        {userSplits.map((split) => (
          <div key={split.user} className="bg-white rounded-2xl shadow p-5 mb-6">
            <h2 className="text-xl font-semibold mb-3">{split.user}</h2>
            <ul className="space-y-2">
              {split.items.map((item) => (
                <li key={item.itemId} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold mt-3 border-t pt-2">
              <span>Total</span>
              <span>₹{split.total}</span>
            </div>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg mt-6 p-4 bg-gray-100 rounded-xl shadow">
          <span>Cart Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={() => router.push(`/cart/${cartCode}`)}
          className="mt-6 w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
}
