"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Item = { name: string; price: number; quantity: number; addedBy: { name: string } };

export default function SplitPage() {
  const params = useParams();
  const cartCode = params?.cartCode;
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!cartCode) return;

    fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setItems(data.items || []));
  }, [cartCode]);

  const totals: { [name: string]: number } = {};
  items.forEach(item => {
    const name = item.addedBy.name;
    totals[name] = (totals[name] || 0) + item.price * item.quantity;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Split Details</h1>
      {Object.keys(totals).map(name => (
        <div key={name} className="mb-2">
          {name}: ₹{totals[name]}
        </div>
      ))}
    </div>
  );
}
