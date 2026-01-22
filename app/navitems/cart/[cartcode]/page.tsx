"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy?: {
    name: string;
    email: string;
  };
};

export default function SharedCartPage() {
  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/navitems/login");
      return;
    }
    if (!cartCode) return;

    loadCart();
  }, [cartCode, router]);

  const loadCart = async () => {
    const token = localStorage.getItem("token");
    if (!token || !cartCode) return;

    const res = await fetch(
      `https://zep-it-back.onrender.com/api/cart/${cartCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    setCart(data.items || []);
    setTotal(
      (data.items || []).reduce(
        (acc: number, item: CartItem) => acc + item.price * item.quantity,
        0
      )
    );
  };

  const createSharedCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("https://zep-it-back.onrender.com/api/cart/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.cartCode) {
      navigator.clipboard.writeText(data.cartCode);
      alert(`Shared Cart Created! Code copied to clipboard: ${data.cartCode}`);
      router.push(`/navitems/cart/${data.cartCode}`);
    }
  };

  const joinCart = () => {
    const code = prompt("Enter cart code to join:");
    if (!code) return;
    router.push(`/navitems/cart/${code}`);
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {cartCode ? `Shared Cart #${cartCode}` : "Shopping Cart"}
          </h1>

          {!cartCode && (
            <div className="flex gap-4">
              <button
                onClick={createSharedCart}
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold"
              >
                Create Shared Cart
              </button>
              <button
                onClick={joinCart}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Join Shared Cart
              </button>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-center text-lg mt-20">No items yet</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.itemId}
                className="border rounded-xl p-4 mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p>
                    ₹{item.price} × {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>
                  {item.addedBy && (
                    <p className="text-xs text-gray-500">
                      Added by {item.addedBy.name} ({item.addedBy.email})
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 font-bold text-lg">Total: ₹{total}</div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2">Split Details:</h2>
              {Object.entries(
                cart.reduce((acc: any, item) => {
                  if (!item.addedBy) return acc;
                  acc[item.addedBy.name] =
                    (acc[item.addedBy.name] || 0) +
                    item.price * item.quantity;
                  return acc;
                }, {})
              ).map(([name, amount]) => (
                <p key={name}>
                  {name}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
