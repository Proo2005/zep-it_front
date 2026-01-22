"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

type SplitDetails = {
  [userEmail: string]: { name: string; total: number; items: CartItem[] };
};

export default function SplitPage() {
  const params = useParams();
  const router = useRouter();
  const cartCode = params?.cartCode as string;

  const [split, setSplit] = useState<SplitDetails>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/navitems/login");
      return;
    }

    fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}/split`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSplit(data || {}));
  }, [cartCode, router]);

  return (
    <div className="min-h-screen pt-32 px-4 bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7]">
      <h1 className="text-3xl font-bold mb-6">Payment Split for Cart #{cartCode}</h1>

      {Object.keys(split).length === 0 ? (
        <p className="text-center mt-20 text-lg">No items yet</p>
      ) : (
        Object.values(split).map((user) => (
          <div key={user.name} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <h2 className="font-semibold text-lg mb-2">{user.name}</h2>
            <ul className="mb-2">
              {user.items.map((item) => (
                <li key={item.itemId}>
                  {item.name} - ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="font-bold">Total: ₹{user.total}</p>
          </div>
        ))
      )}
    </div>
  );
}
