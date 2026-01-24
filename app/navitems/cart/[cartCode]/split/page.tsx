"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type SplitItem = { name: string; email: string; owes: number };

export default function SplitPage() {
  const [split, setSplit] = useState<SplitItem[]>([]);
  const params = useParams();
  const cartCode = params?.cartCode;

  useEffect(() => {
    if (!cartCode) return;
    fetch(`https://zep-it-back.onrender.com/api/split/${cartCode}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setSplit(data.split || []));
  }, [cartCode]);

  return (
    <div className="min-h-screen px-4 pt-32 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Split Details</h1>
      <div className="space-y-2">
        {split.map(user => (
          <div key={user.email} className="flex justify-between bg-white p-4 rounded shadow">
            <span>{user.name}</span>
            <span>₹{user.owes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
