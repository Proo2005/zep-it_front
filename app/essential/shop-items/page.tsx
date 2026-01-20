"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  amount: number;
  quantity: number;
  shopName: string;
  shopkeeperEmail: string;
};

export default function ShopItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [shopName, setShopName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setToken(t);
    setUserEmail(email);

    if (t && email) fetchShopItems(t, email);
  }, []);

  const fetchShopItems = async (authToken: string, email: string) => {
    try {
      const res = await axios.get<Item[]>("https://zep-it-back.onrender.com/api/item/all", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Filter items for this shop
      const shopItems = res.data.filter((i) => i.shopkeeperEmail === email);

      setItems(shopItems);
      if (shopItems.length > 0) setShopName(shopItems[0].shopName);

      // Initialize quantity map
      const initialMap: Record<string, number> = {};
      shopItems.forEach((i) => {
        initialMap[i._id] = 1;
      });
      setQuantityMap(initialMap);
    } catch (err) {
      console.error("Failed to fetch shop items:", err);
    }
  };

  const handleQtyChange = (itemId: string, value: number) => {
    setQuantityMap((prev) => ({
      ...prev,
      [itemId]: Math.max(value, 1),
    }));
  };

  const incrementQty = (itemId: string) => {
    setQuantityMap((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const decrementQty = (itemId: string) => {
    setQuantityMap((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1),
    }));
  };

  const addQuantity = async (item: Item) => {
    if (!token) return alert("Login required");

    const addedQty = quantityMap[item._id] || 1;

    try {
      const res = await axios.post(
        "https://zep-it-back.onrender.com/api/item/update-quantity",
        { itemId: item._id, quantityToAdd: addedQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedItem = res.data.item as Item;

      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, quantity: updatedItem.quantity } : i))
      );

      setQuantityMap((prev) => ({ ...prev, [item._id]: 1 }));
      alert(`Quantity updated! New quantity: ${updatedItem.quantity}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  // Summary info
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 text-black">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{shopName || "Your Shop"}</h1>

      {/* Summary Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white shadow-md rounded-xl px-6 py-3 flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-xl font-bold text-gray-900">{totalItems}</p>
        </div>
        <div className="bg-white shadow-md rounded-xl px-6 py-3 flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">Total Stock Value</p>
          <p className="text-xl font-bold text-gray-900">₹{totalValue}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full text-left rounded-xl border-collapse">
          <thead className="bg-green-100 text-gray-900">
            <tr>
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price (₹)</th>
              <th className="px-4 py-3">Available Qty</th>
              <th className="px-4 py-3">Add Qty</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-t">{item.itemName}</td>
                <td className="px-4 py-3 border-t">{item.category}</td>
                <td className="px-4 py-3 border-t font-semibold">₹{item.amount}</td>
                <td className="px-4 py-3 border-t">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.quantity > 5
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {item.quantity} {item.quantity > 0 ? "in stock" : "out of stock"}
                  </span>
                </td>
                <td className="px-4 py-3 border-t">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decrementQty(item._id)}
                      className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={quantityMap[item._id] || 1}
                      onChange={(e) =>
                        handleQtyChange(item._id, Number(e.target.value))
                      }
                      className="w-16 px-2 py-1 rounded bg-gray-100 outline-none text-center text-gray-900"
                    />
                    <button
                      onClick={() => incrementQty(item._id)}
                      className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 border-t">
                  <button
                    onClick={() => addQuantity(item)}
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded font-semibold"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-gray-500 p-6 text-center">No items found for your shop.</p>
        )}
      </div>
    </div>
  );
}
