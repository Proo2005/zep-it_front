"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { Divider } from "@heroui/divider";
import Footer from "./components/Footer";
import FloatingCart from "./components/FloatingCart";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  amount: number;
  quantity: number;
  image?: string;
};

type UserAddress = {
  state: string;
  city: string;
  fullAddress: string;
};

const categories = [
  { key: "grocery_and_kitchen", label: "Grocery & Kitchen" },
  { key: "snacks_and_drinks", label: "Snacks & Drinks" },
  { key: "beauty_and_personal_care", label: "Beauty & Personal Care" },
  { key: "household_essential", label: "Household Essentials" },
];

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [cartQty, setCartQty] = useState<{ [key: string]: number }>({});
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(2000);

  useEffect(() => {
    fetchItems();
    fetchUserAddress();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("https://zep-it-back.onrender.com/api/item/all");
      console.log("Fetched items:", res.data);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };


  const fetchUserAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get("https://zep-it-back.onrender.com/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.user?.address) setUserAddress(res.data.user.address);
  };

  const handleQtyChange = (id: string, value: number, max: number) => {
    if (value < 1) value = 1;
    if (value > max) return;
    setCartQty((prev) => ({ ...prev, [id]: value }));
  };

  const addToCart = (item: Item) => {
    const selectedQty = cartQty[item._id] || 1;
    if (selectedQty > item.quantity) return alert("Quantity exceeds stock");

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

  const toggleCategory = (key: string) =>
    setExpandedCategories((p) => ({ ...p, [key]: !p[key] }));

  // FILTERED ITEMS
  const filteredItems = items.filter((i) => {
    const matchesSearch = i.itemName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(i.category);
    const matchesPrice = i.amount <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* FILTER PANEL */}
        <div className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="text-lg font-bold mb-4 text-black flex items-center gap-2">
              Filters
              <CiFilter className="text-gray-600" />
            </h3>

            {/* Category Filter */}
            <div className="mb-6">
              <p className="font-semibold mb-3 text-sm text-gray-700">Categories</p>
              {categories.map((cat) => (
                <label
                  key={cat.key}
                  className="flex items-center gap-2 mb-2 cursor-pointer text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories((p) => [...p, cat.key]);
                      } else {
                        setSelectedCategories((p) =>
                          p.filter((c) => c !== cat.key)
                        );
                      }
                    }}
                    className="accent-[#0C831F]"
                  />
                  {cat.label}
                </label>

              ))}
            </div>
            <Divider className="my-4" />

            {/* Price Filter */}
            <div>
              <p className="font-semibold mb-3 text-sm text-gray-700">
                Max Price: ₹{priceRange}
              </p>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#0C831F]"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange(2000);
              }}
              className="mt-6 w-full text-sm font-semibold py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-black"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div>
          {/* Address Bar */}
          {userAddress && (
            <div className="mb-4">
              <div className="bg-white/70 backdrop-blur-md border rounded-xl px-5 py-3 shadow-sm">
                <p className="font-semibold text-[#0C831F]">
                  Delivering to {userAddress.city}, {userAddress.state}
                </p>
                <p className="text-sm text-gray-600 truncate">{userAddress.fullAddress}</p>
              </div>
            </div>
          )}
          <Divider className="my-4" />

          {/* Search */}
          <div className="mb-6 text-black">
            <input
              placeholder="Search for groceries, snacks, essentials…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white shadow-sm border focus:ring-2 focus:ring-[#0C831F] outline-none"
            />
          </div>

          {/* Hero Banner */}
          <div className="max-w-6xl mx-auto mb-10">
            <div className="h-52 rounded-3xl bg-gradient-to-r from-[#0C831F] to-[#14B8A6] text-white flex flex-col justify-center px-8 shadow-lg">
              <h1 className="text-3xl font-extrabold mb-2">Daily Needs, Delivered Fast</h1>
              <p className="opacity-90">Fresh stock • Best prices • Instant delivery</p>
            </div>
          </div>


          {/* Product Categories */}
          {categories.map((cat) => {
            const categoryItems = filteredItems.filter((i) => i.category === cat.key);
            const expanded = expandedCategories[cat.key];
            const visible = expanded ? categoryItems : categoryItems.slice(0, 8);

            if (categoryItems.length === 0) return null;

            return (
              <section key={cat.key} className="max-w-6xl mx-auto mb-14">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold text-black">{cat.label}</h2>
                  {categoryItems.length > 8 && (
                    <button
                      onClick={() => toggleCategory(cat.key)}
                      className="text-sm font-semibold text-[#0C831F] hover:underline"
                    >
                      {expanded ? "Show Less" : "View All"}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2  sm:grid-cols-3  md:grid-cols-4 gap-4  sm:gap-6">
                  {visible.map((item) => (
                    <div
                      key={item._id}
                      className=" bg-white rounded-2xl  p-4  sm:p-4 shadow-sm  hover:shadow-lg  transition  flex  flex-col min-h-[320px]"
                    >
                      {/* Image */}
                      <div className="h-36 sm:h-32  rounded-xl  bg-[#F1F5F9]  mb-3  overflow-hidden">
                        <img
                          src={`https://loremflickr.com/320/240/${item.itemName}`}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Name */}
                      <h3 className="font-semibold  text-[13px]  sm:text-sm  mb-1 line-clamp-2  text-black">
                        {item.itemName}
                      </h3>

                      {/* Price + Stock */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-[#0C831F]">₹{item.amount}</span>
                        <span className="text-xs bg-[#0C831F] text-white px-2 py-0.5 rounded-full">
                          {item.quantity} left
                        </span>
                      </div>

                      {/* Quantity */}
                      <input
                        type="number"
                        min={1}
                        max={item.quantity}
                        value={cartQty[item._id] || 1}
                        onChange={(e) =>
                          handleQtyChange(item._id, Number(e.target.value), item.quantity)
                        }
                        className="mb-3 px-2 py-1 border rounded-lg text-sm outline-none text-black"
                      />

                      {/* Add Button */}
                      <button
                        onClick={() => addToCart(item)}
                        className="mt-auto w-full py-2 rounded-xl font-extrabold border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white transition"
                      >
                        ADD
                      </button>
                    </div>
                  ))}
                </div>
                <Divider className="my-4" />
              </section>

            );
          })}
        </div>
        <FloatingCart/>
      </div>
      <Footer />
    </div>
  );
}
