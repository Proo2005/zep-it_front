"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { Divider } from "@heroui/divider";
import { IoClose } from "react-icons/io5";
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchUserAddress();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("https://zep-it-back.onrender.com/api/item/all");
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
    if (selectedQty > item.quantity) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c: any) => c.itemId === item._id);
    if (existing) {
      existing.quantity += selectedQty;
    } else {
      cart.push({
        itemId: item._id,
        name: item.itemName,
        price: item.amount,
        quantity: selectedQty,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const toggleCategory = (key: string) =>
    setExpandedCategories((p) => ({ ...p, [key]: !p[key] }));

  const filteredItems = items.filter((i) => {
    const matchesSearch = i.itemName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(i.category);
    const matchesPrice = i.amount <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[260px_1fr] gap-8">

        {/* FILTER PANEL (Desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow-md border">
            <h3 className="text-lg font-bold mb-4 text-black flex items-center gap-2">
              Filters <CiFilter />
            </h3>
            <div className="mb-6">
              <p className="font-semibold mb-3 text-sm text-gray-700">Categories</p>
              {categories.map((cat) => (
                <label key={cat.key} className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.key)}
                    onChange={(e) =>
                      setSelectedCategories((p) =>
                        e.target.checked ? [...p, cat.key] : p.filter((c) => c !== cat.key)
                      )
                    }
                    className="accent-[#0C831F]"
                  />
                  {cat.label}
                </label>
              ))}
            </div>
            <Divider className="my-4" />
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
        </div>

        {/* MAIN CONTENT */}
        <div>
          {/* Mobile Filter Button */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            {userAddress && (
              <div className="bg-white/70 backdrop-blur-md border rounded-xl px-5 py-3 flex-1 mr-2">
                <p className="font-semibold text-[#0C831F]">
                  Delivering to {userAddress.city}, {userAddress.state}
                </p>
                <p className="text-sm text-gray-600 truncate">{userAddress.fullAddress}</p>
              </div>
            )}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="px-4 py-2 rounded-xl bg-green-50 text-green-700 flex items-center gap-2 font-semibold shadow-md"
            >
              <CiFilter size={20} /> Filter
            </button>
          </div>

          {/* Search Bar */}
          <input
            placeholder="Search for groceries, snacks, essentials…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white shadow-sm border mb-6"
          />

          {/* Banner */}
          <div className="h-52 rounded-3xl bg-gradient-to-r from-[#0C831F] to-[#14B8A6] text-white flex flex-col justify-center px-8 mb-10">
            <h1 className="text-3xl font-extrabold">Daily Needs, Delivered Fast</h1>
            <p className="opacity-90">Fresh stock • Best prices • Instant delivery</p>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="relative bg-white rounded-2xl p-4 shadow-md flex flex-col min-h-[320px] lg:min-h-[340px]"
              >
                <span className="absolute top-3 right-3 text-[10px] bg-black/80 text-white px-2 py-0.5 rounded-full">
                  Popular
                </span>

                {/* Image */}
                <div className="h-36 sm:h-32 bg-[#F1F5F9] rounded-full mb-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://loremflickr.com/120/120/${item.itemName}`}
                    alt={item.itemName}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                </div>

                {/* Name & Price */}
                <h3 className="font-semibold text-[13px] sm:text-sm mb-1 line-clamp-2">
                  {item.itemName}
                </h3>
                <span className="font-bold text-[#0C831F] mb-2 block">₹{item.amount}</span>

                {/* Quantity */}
                <input
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={cartQty[item._id] || 1}
                  onChange={(e) =>
                    handleQtyChange(item._id, Number(e.target.value), item.quantity)
                  }
                  className="mb-3 px-2 py-1 border rounded-lg text-sm w-full"
                />

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="mt-auto w-full py-2 rounded-xl font-extrabold border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white transition"
                >
                  ADD
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
            <div className="w-72 bg-white p-6 overflow-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-black flex items-center gap-2">Filters <CiFilter /></h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <IoClose size={24} />
                </button>
              </div>
              <div className="mb-6">
                <p className="font-semibold mb-3 text-sm text-gray-700">Categories</p>
                {categories.map((cat) => (
                  <label key={cat.key} className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.key)}
                      onChange={(e) =>
                        setSelectedCategories((p) =>
                          e.target.checked ? [...p, cat.key] : p.filter((c) => c !== cat.key)
                        )
                      }
                      className="accent-[#0C831F]"
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
              <Divider className="my-4" />
              <p className="font-semibold mb-3 text-sm text-gray-700">Max Price: ₹{priceRange}</p>
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
          </div>
        )}

        <FloatingCart />
      </div>
      <Footer />
    </div>
  );
}
