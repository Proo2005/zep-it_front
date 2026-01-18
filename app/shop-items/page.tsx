"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  amount: number;
  quantity: number;
};

export default function ShopItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [quantityMap, setQuantityMap] = useState<{ [key: string]: number }>({});
  const [shopName, setShopName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ Only access localStorage inside useEffect
  useEffect(() => {
    const t = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setToken(t);
    setUserEmail(email);

    if (t && email) fetchShopItems(t, email);
  }, []);

  const fetchShopItems = async (authToken: string, email: string) => {
    try {
      const res = await axios.get("http://localhost:5000/api/item/all", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Filter items by logged-in shopkeeper email
      const shopItems = res.data.filter(
        (i: Item & { shopkeeperEmail: string; shopName: string }) =>
          i.shopkeeperEmail === email
      );

      setItems(shopItems);
      if (shopItems.length > 0) setShopName(shopItems[0].shopName);

      // Initialize quantityMap with 1 for each item
      const initialMap: { [key: string]: number } = {};
      shopItems.forEach((i) => (initialMap[i._id] = 1));
      setQuantityMap(initialMap);
    } catch (err) {
      console.error("Failed to fetch shop items:", err);
    }
  };

  const handleQtyChange = (itemId: string, value: number) => {
    if (value < 1) value = 1;
    setQuantityMap((prev) => ({ ...prev, [itemId]: value }));
  };

  const incrementQty = (itemId: string) => {
    setQuantityMap((prev) => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }));
  };

  const decrementQty = (itemId: string) => {
    setQuantityMap((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 1) }));
  };

  const addQuantity = async (item: Item) => {
    if (!token) return;

    const addedQty = quantityMap[item._id] || 1;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/item/update-quantity", // dedicated endpoint
        {
          itemId: item._id,
          quantityToAdd: addedQty,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItem = res.data.item as Item;

      // Update UI with new quantity
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, quantity: updatedItem.quantity } : i))
      );

      // Reset input quantity to 1
      setQuantityMap((prev) => ({ ...prev, [item._id]: 1 }));

      alert(`Quantity updated! New quantity: ${updatedItem.quantity}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">{shopName || "Your Shop"}</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-zinc-700 rounded-xl">
          <thead className="bg-zinc-900">
            <tr>
              <th className="px-4 py-3 border-b border-zinc-700">Item Name</th>
              <th className="px-4 py-3 border-b border-zinc-700">Category</th>
              <th className="px-4 py-3 border-b border-zinc-700">Price (₹)</th>
              <th className="px-4 py-3 border-b border-zinc-700">Available Qty</th>
              <th className="px-4 py-3 border-b border-zinc-700">Add Qty</th>
              <th className="px-4 py-3 border-b border-zinc-700">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-zinc-800">
                <td className="px-4 py-3 border-b border-zinc-700">{item.itemName}</td>
                <td className="px-4 py-3 border-b border-zinc-700">{item.category}</td>
                <td className="px-4 py-3 border-b border-zinc-700">{item.amount}</td>
                <td className="px-4 py-3 border-b border-zinc-700">{item.quantity}</td>
                <td className="px-4 py-3 border-b border-zinc-700">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decrementQty(item._id)}
                      className="bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantityMap[item._id] || 1}
                      onChange={(e) => handleQtyChange(item._id, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded bg-zinc-900 outline-none text-black text-center"
                    />
                    <button
                      onClick={() => incrementQty(item._id)}
                      className="bg-zinc-700 px-2 py-1 rounded hover:bg-zinc-600"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-zinc-700">
                  <button
                    onClick={() => addQuantity(item)}
                    className="bg-green-600 hover:bg-green-500 text-black py-1 px-3 rounded font-semibold"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-gray-400 mt-6">No items found for your shop.</p>
        )}
      </div>
    </div>
  );
}
