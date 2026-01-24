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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    toast.success(`Welcome back`);
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
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pt-32">

        {/* FILTER PANEL */}
        <div className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="text-lg font-bold mb-5 text-black flex items-center gap-2">
              Filters <CiFilter />
            </h3>

            <FieldGroup className="space-y-3 mb-6 text-black">
              <p className="font-semibold text-sm mb-2">Categories</p>

              {categories.map((cat) => (
                <Field orientation="horizontal" key={cat.key}>
                  <Checkbox
                    id={cat.key}
                    checked={selectedCategories.includes(cat.key)}
                    onCheckedChange={(checked) =>
                      setSelectedCategories((prev) =>
                        checked
                          ? [...prev, cat.key]
                          : prev.filter((c) => c !== cat.key)
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

            <div>
              <FieldTitle className="mb-2">Max Price: ₹{priceRange}</FieldTitle>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#0C831F]"
              />
              <p className="text-xs text-gray-500 mt-2">
                Items priced under ₹{priceRange}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div>
          {userAddress && (
            <div className="mb-4 bg-white/70 backdrop-blur-md border rounded-xl px-5 py-3">
              <p className="font-semibold text-[#0C831F]">
                Delivering to {userAddress.city}, {userAddress.state}
              </p>
              <p className="text-sm text-orange-800 truncate">
                {userAddress.fullAddress}
              </p>
            </div>
          )}

          <Divider className="my-4" />

          <input
            placeholder="Search for groceries, snacks, essentials…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white shadow-sm border mb-6 text-black"
          />

          <div className="h-52 rounded-3xl bg-gradient-to-r from-[#0C831F] to-[#14B8A6] text-white flex flex-col justify-center px-8 mb-10">
            <h1 className="text-3xl font-extrabold">
              Daily Needs, Delivered Fast
            </h1>
            <p className="opacity-90">
              Fresh stock • Best prices • Instant delivery
            </p>
          </div>

          {/* ===== SKELETON BEFORE DATA LOADS ===== */}
          {loading && (
            <section className="mb-14">
              <div className="grid gap-4 sm:gap-6
                grid-cols-3 md:grid-cols-3 lg:grid-cols-3
                sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ItemCardSkeleton key={i} />
                ))}
              </div>
            </section>
          )}

          {/* ===== REAL DATA AFTER LOAD ===== */}
          {!loading &&
            categories.map((cat) => {
              const categoryItems = filteredItems.filter(
                (i) => i.category === cat.key
              );

              const expanded = expandedCategories[cat.key];
              const visible = expanded
                ? categoryItems
                : categoryItems.slice(0, 8);

              if (!categoryItems.length) return null;

              return (
                <section key={cat.key} className="mb-14">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-black">
                      {cat.label}
                    </h2>

                    {categoryItems.length > 8 && (
                      <button
                        onClick={() => toggleCategory(cat.key)}
                        className="text-sm font-semibold text-[#0C831F]"
                      >
                        {expanded ? "Show Less" : "View All"}
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:gap-6
                    grid-cols-3 md:grid-cols-3 lg:grid-cols-3
                    sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-3">
                    {visible.map((item, idx) => (
                      <div
                        key={item._id}
                        className="relative bg-white rounded-2xl p-4 shadow-sm flex flex-col min-h-[320px]"
                      >
                        <span className="absolute top-3 right-3 text-[10px] bg-black/80 text-white px-2 py-0.5 rounded-full">
                          Popular
                        </span>

                        <div className="h-36 bg-[#F1F5F9] rounded-full mb-3 overflow-hidden">
                          <img
                            src={`https://loremflickr.com/320/320/${encodeURIComponent(
                              item.itemName
                            )}?random=${idx}`}
                            alt={item.itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-black">
                          {item.itemName}
                        </h3>

                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-[#0C831F]">
                            ₹{item.amount}
                          </span>
                          <span className="text-xs bg-[#0C831F] text-white px-2 py-0.5 rounded-full">
                            {item.quantity} left
                          </span>
                        </div>

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
                          className="mb-3 px-2 py-1 border rounded-lg text-sm text-black"
                        />

                        <Button
                          onClick={() => {

                            addToCart(item); // your original add-to-cart logic
                            toast("Item added to cart", {
                              description: `$Item has been added to your cart.`,
                              action: {
                                label: "Undo",
                                onClick: () => console.log("Undo"),
                              },
                            });
                          }}
                          className="mt-auto w-full py-2 rounded-xl font-extrabold border text-white border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white transition"
                        >
                          ADD
                        </Button>
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
