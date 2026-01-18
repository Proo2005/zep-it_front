"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  amount: number;
  quantity: number;
  image?: string;
};

const categories = [
  { key: "grocery_and_kitchen", label: "Grocery & Kitchen" },
  { key: "snacks_and_drinks", label: "Snacks & Drinks" },
  { key: "beauty_and_personal_care", label: "Beauty & Personal Care" },
  { key: "household_essential", label: "Household Essential" },
];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [cartQty, setCartQty] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/api/item/all");
    setItems(res.data);
  };

  const handleQtyChange = (id: string, value: number, max: number) => {
    if (value > max) return;
    if (value < 1) value = 1;

    setCartQty((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addToCart = (item: Item) => {
    const selectedQty = cartQty[item._id] || 1;

    if (selectedQty > item.quantity) {
      alert("Selected quantity exceeds available stock");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      itemId: item._id,
      name: item.itemName,
      price: item.amount,
      quantity: selectedQty,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

return (
  <div className="min-h-screen bg-[#F4F6FB] text-[#1C1C1C] px-6 pb-10">
    {/* Search Bar */}
    <div className="max-w-4xl mx-auto pt-6">
      <input
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white outline-none border"
      />
    </div>

    {/* Carousel */}
    <div className="mt-6 max-w-6xl mx-auto">
      <div className="h-48 rounded-xl bg-[#F8CB46] flex items-center justify-center text-[#1C1C1C] text-2xl font-bold">
        Daily Essentials • Best Prices • Fresh Stock
      </div>
    </div>

    {/* Category Sections */}
    {categories.map((cat) => (
      <div key={cat.key} className="max-w-6xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">
          {cat.label}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {filteredItems
            .filter((item) => item.category === cat.key)
            .map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-4 space-y-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                {/* Image */}
                <div className="h-28 bg-[#F4F6FB] rounded-lg flex items-center justify-center">
                  <span className="text-[#666666] text-sm">
                    Item Image
                  </span>
                </div>

                {/* Name + Stock */}
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">
                    {item.itemName}
                  </h3>
                  <span className="w-7 h-7 rounded-full bg-[#0C831F] text-white text-xs flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>

                {/* Price */}
                <p className="text-[#0C831F] font-bold">
                  ₹{item.amount}
                </p>

                {/* Quantity Selector */}
                <input
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={cartQty[item._id] || 1}
                  onChange={(e) =>
                    handleQtyChange(
                      item._id,
                      Number(e.target.value),
                      item.quantity
                    )
                  }
                  className="w-full px-2 py-1 rounded bg-[#F4F6FB] outline-none border"
                />

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(item)}
                  className="w-full border border-[#0C831F] text-[#0C831F] py-2 rounded-lg font-extrabold hover:bg-[#0C831F] hover:text-white transition"
                >
                  ADD
                </button>
              </div>
            ))}
        </div>
      </div>
    ))}
  </div>
);

}
