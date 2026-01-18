"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HistoryItem = {
  itemId: string;
  name: string;
  quantity: number;
  amount: number;
};

type PaymentHistory = {
  _id: string;
  userName: string;
  email: string;
  items: HistoryItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
};

export default function PaymentHistoryPage() {
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch("http://localhost:5000/api/paymenthistory/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHistory(data.history);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch payment history");
    }
  };

  const handleReorder = (items: HistoryItem[]) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newCart = [...existingCart];

    items.forEach((item) => {
      const index = newCart.findIndex((c: any) => c.itemId === item.itemId);
      if (index !== -1) {
        newCart[index].quantity += item.quantity;
      } else {
        newCart.push({
          itemId: item.itemId,
          name: item.name,
          price: item.amount,
          quantity: item.quantity,
        });
      }
    });

    localStorage.setItem("cart", JSON.stringify(newCart));
    alert("Items added to cart!");
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-white">
          Payment History
        </h1>

        {history.length === 0 ? (
          <p className="text-zinc-400 text-lg">
            No payment history found.
          </p>
        ) : (
          <div className="space-y-6">
            {history.map((h) => (
              <div
                key={h._id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg text-white">
                      ₹{h.totalAmount}
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {h.paymentMethod} ·{" "}
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleReorder(h.items)}
                    className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-1.5 rounded-lg transition"
                  >
                    Reorder
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  {h.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex justify-between text-sm text-zinc-200 py-2 border-b border-zinc-800 last:border-b-0"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-zinc-300">
                        ₹{item.amount * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
