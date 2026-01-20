"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiRedo } from "react-icons/ci"; // ✅ FIXED IMPORT

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

      const res = await fetch(
        "http://localhost:5000/api/paymenthistory/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      const index = newCart.findIndex(
        (c: any) => c.itemId === item.itemId
      );

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
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Payment History
          </h1>
          <p className="text-zinc-400 mt-1">
            View your past orders and quickly reorder items
          </p>
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-10 text-center">
            <p className="text-zinc-400 text-lg">
              No payment history available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((h) => (
              <div
                key={h._id}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      ₹{h.totalAmount}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      {h.paymentMethod} •{" "}
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {h.items.length} item(s)
                    </div>
                  </div>

                  <button
                    onClick={() => handleReorder(h.items)}
                    className="flex items-center gap-2
                               bg-green-600 hover:bg-green-500 
                               text-black font-bold 
                               px-6 py-2 rounded-xl 
                               transition self-start md:self-auto"
                  >
                    <CiRedo size={18} />
                    Reorder
                  </button>
                </div>

                {/* Items */}
                <div className="mt-6 divide-y divide-zinc-800">
                  {h.items.map((item) => (
                    <div
                      key={item.itemId}
                      className="flex justify-between items-center py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-zinc-200">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="font-semibold text-zinc-300">
                        ₹{item.amount * item.quantity}
                      </div>
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
