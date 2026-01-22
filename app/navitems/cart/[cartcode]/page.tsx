"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy?: { name: string; email: string };
};

export default function SharedCartPage() {
  const params = useParams();
  const router = useRouter();
  const cartCode = params?.cartCode as string;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/navitems/login");
      return;
    }

    fetch(`https://zep-it-back.onrender.com/api/cart/${cartCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.items || []);
        setTotal(
          (data.items || []).reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          )
        );
      });
  }, [cartCode, router]);

  const handleSplit = () => {
    router.push(`/navitems/cart/${cartCode}/split`);
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7]">
      <h1 className="text-3xl font-bold mb-6">Shared Cart #{cartCode}</h1>

      {cart.length === 0 ? (
        <p className="text-center mt-20 text-lg">No items yet</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.itemId}
              className="border rounded-xl p-4 mb-3 flex justify-between"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>₹{item.price} × {item.quantity}</p>
                {item.addedBy && (
                  <p className="text-xs text-gray-500">
                    Added by {item.addedBy.name}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="mt-6 font-bold text-lg flex justify-between items-center">
            <span>Total:</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleSplit}
            className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-xl font-bold transition"
          >
            View Split Details
          </button>
        </>
      )}
    </div>
  );
}
