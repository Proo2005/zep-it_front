"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type SplitItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

type UserSplit = {
  userId: string;
  name: string;
  email: string;
  items: SplitItem[];
  subtotal: number;
};

export default function SplitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cartCode = params.cartCode as string;

  const [splits, setSplits] = useState<UserSplit[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    fetchSplit();
  }, []);

  const fetchSplit = async () => {
    const res = await fetch(
      `https://zep-it-back.onrender.com/api/split/${cartCode}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    setSplits(data.splitDetails || []);
    setGrandTotal(data.grandTotal || 0);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] px-4 pt-28 pb-20 text-black">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Split Payment Details
        </h1>

        {splits.map(user => (
          <div
            key={user.userId}
            className="bg-white rounded-2xl shadow-sm mb-6 p-6"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="space-y-3">
              {user.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.total}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Subtotal</span>
              <span className="text-green-600">
                ₹{user.subtotal}
              </span>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/paymentpage?amount=${user.subtotal}&cart=${cartCode}&user=${user.userId}`
                )
              }
              className="mt-4 w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold"
            >
              Pay ₹{user.subtotal}
            </button>
          </div>
        ))}

        <div className="bg-black text-white rounded-2xl p-6 mt-10 flex justify-between text-xl font-bold">
          <span>Grand Total</span>
          <span>₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
