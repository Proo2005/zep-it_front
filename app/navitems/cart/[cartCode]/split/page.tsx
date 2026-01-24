"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  addedBy: { name: string; email: string };
};

type SplitUser = {
  user: { name: string; email: string };
  items: CartItem[];
  amount: number;
};

export default function SplitPage() {
  const [splits, setSplits] = useState<SplitUser[]>([]);
  const [total, setTotal] = useState(0);

  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token || !cartCode) return;

    fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}/split`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const users: { [email: string]: SplitUser } = {};
        (data.items || []).forEach((item: CartItem) => {
          const email = item.addedBy.email;
          if (!users[email]) users[email] = { user: item.addedBy, items: [], amount: 0 };
          users[email].items.push(item);
          users[email].amount += item.price * item.quantity;
        });
        const result = Object.values(users);
        setSplits(result);
        setTotal(result.reduce((acc, u) => acc + u.amount, 0));
      });
  }, [cartCode]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Split Details</h1>

      {splits.length === 0 ? (
        <p className="text-center mt-10">No split data available.</p>
      ) : (
        <div className="space-y-6">
          {splits.map((s, idx) => (
            <div key={idx} className="bg-white rounded shadow p-4">
              <h2 className="font-semibold">{s.user.name} ({s.user.email})</h2>
              <ul className="mt-2 space-y-1">
                {s.items.map((item, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">Subtotal: ₹{s.amount}</p>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg mt-4 p-4 bg-white rounded shadow">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
