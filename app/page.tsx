"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { Divider } from "@heroui/divider";
import Footer from "./components/Footer";
import FloatingCart from "./components/FloatingCart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import ItemCardSkeleton from "./components/ItemCardSkeleton";

type Item = {
  _id: string;
  itemName: string;
  category: string;
  amount: number;
  quantity: number;
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
  const [cartQty, setCartQty] = useState<Record<string, number>>({});
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
    fetchUserAddress();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://zep-it-back.onrender.com/api/item/all");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      "https://zep-it-back.onrender.com/api/user/profile",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.user?.address) {
      setUserAddress(res.data.user.address);
    }
  };

  const handleQtyChange = (id: string, value: number, max: number) => {
    if (value < 1) value = 1;
    if (value > max) return;
    setCartQty((p) => ({ ...p, [id]: value }));
  };

  const addToCart = (item: Item) => {
    const qty = cartQty[item._id] || 1;
    if (qty > item.quantity) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c: any) => c.itemId === item._id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        itemId: item._id,
        name: item.itemName,
        price: item.amount,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const filteredItems = items.filter((i) => {
    const matchSearch = i.itemName.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(i.category);
    const matchPrice = i.amount <= priceRange;
    return matchSearch && matchCategory && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 -mt-24 text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pt-32">

        {/* FILTERS */}
        <div className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              Filters <CiFilter />
            </h3>

            <FieldGroup className="space-y-3 mb-6">
              <p className="font-semibold text-sm mb-2">Categories</p>

              {categories.map((cat) => (
                <Field orientation="horizontal" key={cat.key}>
                  <Checkbox
                    id={cat.key}
                    checked={selectedCategories.includes(cat.key)}
                    onCheckedChange={(checked) =>
                      setSelectedCategories((p) =>
                        checked ? [...p, cat.key] : p.filter((c) => c !== cat.key)
                      )
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={cat.key}>{cat.label}</FieldLabel>
                    <FieldDescription>{cat.label}</FieldDescription>
                  </FieldContent>
                </Field>
              ))}
            </FieldGroup>

            <Divider className="my-5" />

            <FieldTitle>Max Price: ₹{priceRange}</FieldTitle>
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

        {/* MAIN */}
        <div>
          {userAddress && (
            <div className="mb-4 bg-white/70 border rounded-xl px-5 py-3">
              <p className="font-semibold text-[#0C831F]">
                Delivering to {userAddress.city}, {userAddress.state}
              </p>
              <p className="text-sm truncate text-orange-800">{userAddress.fullAddress}</p>
            </div>
          )}

          <input
            placeholder="Search for groceries, snacks, essentials…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white shadow-sm border mb-8"
          />

          {categories.map((cat) => {
            const categoryItems = filteredItems.filter((i) => i.category === cat.key);
            const expanded = expandedCategories[cat.key];
            const visible = expanded ? categoryItems : categoryItems.slice(0, 8);

            if (!loading && categoryItems.length === 0) return null;

            return (
              <section key={cat.key} className="mb-14">
                <h2 className="text-2xl font-bold mb-4">{cat.label}</h2>

                <div className="grid gap-6 grid-cols-3 md:grid-cols-4 lg:grid-cols-3">
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <ItemCardSkeleton key={i} />
                      ))
                    : visible.map((item, idx) => (
                        <div
                          key={item._id}
                          className="bg-white rounded-2xl p-4 shadow-sm flex flex-col min-h-[320px]"
                        >
                          <div className="h-36 bg-[#F1F5F9] rounded-full mb-3 overflow-hidden">
                            <img
                              src={`https://loremflickr.com/320/320/${encodeURIComponent(
                                item.itemName
                              )}?random=${idx}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {item.itemName}
                          </h3>

                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-[#0C831F]">₹{item.amount}</span>
                            <span className="text-xs bg-[#0C831F] px-2 rounded-full">
                              {item.quantity} left
                            </span>
                          </div>

                          <input
                            type="number"
                            min={1}
                            max={item.quantity}
                            value={cartQty[item._id] || 1}
                            onChange={(e) =>
                              handleQtyChange(item._id, Number(e.target.value), item.quantity)
                            }
                            className="mb-3 px-2 py-1 border rounded-lg text-sm"
                          />

                          <button
                            onClick={() => addToCart(item)}
                            className="mt-auto w-full py-2 rounded-xl font-bold border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white"
                          >
                            ADD
                          </button>
                        </div>
                      ))}
                </div>

                <Divider className="my-6" />
              </section>
            );
          })}
        </div>

        <FloatingCart />
      </div>

      <Footer />
    </div>
  );
}
