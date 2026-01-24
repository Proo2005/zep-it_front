"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SharedCartPage() {
  const { code } = useParams();
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/shared-cart/${code}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(setCart);
  }, [code]);

  if (!cart) return <p>Loading...</p>;

  return (
    <div>
      <h1>Shared Cart: {cart.cartCode}</h1>

      {cart.items.map((item: any) => (
        <div key={item.itemId}>
          <b>{item.name}</b> × {item.quantity}
          <p>Added by: {item.addedBy?.name}</p>
        </div>
      ))}

      <h2>Split Bill</h2>
      {cart.payments.map((p: any, i: number) => (
        <p key={i}>
          {p.userId.name} paid ₹{p.amount}
        </p>
      ))}
    </div>
  );
}
