"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type SplitDetail = {
  user: { name: string; email: string };
  amount: number;
};

export default function SplitPage() {
  const [splits, setSplits] = useState<SplitDetail[]>([]);
  const [total, setTotal] = useState(0);
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    if (!cartCode) return;

    fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}/split`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSplits(data.splits || []);
        setTotal(data.splits?.reduce((acc: number, s: SplitDetail) => acc + s.amount, 0) || 0);
      });
  }, [cartCode]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-32 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Split Details</h1>

      {splits.length === 0 ? (
        <p className="text-center mt-10">No split data available.</p>
      ) : (
        <div className="space-y-4">
          {splits.map((s, idx) => (
            <div key={idx} className="flex justify-between bg-white p-4 rounded shadow">
              <div>
                <p className="font-semibold">{s.user.name}</p>
                <p className="text-sm">{s.user.email}</p>
              </div>
              <p className="font-bold">₹{s.amount}</p>
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
