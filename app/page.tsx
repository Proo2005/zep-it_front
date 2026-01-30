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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import DeliveryBikeIntro from "./components/animations/Delivery";

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
  const [showBikeIntro, setShowBikeIntro] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const alreadyPlayed = localStorage.getItem("deliveryBikeIntroPlayed");

    if (!alreadyPlayed) {
      setShowBikeIntro(true);

      setTimeout(() => {
        setShowBikeIntro(false);
        localStorage.setItem("deliveryBikeIntroPlayed", "true");
      }, 2200); // match bike animation duration
    }
  }, []);
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
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black dark:bg-zinc-900 dark:text-white">

      {showBikeIntro && <DeliveryBikeIntro />}
      {!showBikeIntro && (
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

            {/* HERO CAROUSEL */}
            <Carousel
              className="mb-10"
              plugins={[
                Autoplay({
                  delay: 3500,
                  stopOnInteraction: false,
                }),
              ]}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {[
                  {
                    title: "Daily Needs, Delivered Fast",
                    subtitle: "Fresh stock • Best prices • Instant delivery",
                    image:
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600",
                  },
                  {
                    title: "Groceries in Minutes",
                    subtitle: "No queues • No waiting • Just tap & get",
                    image:
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600",
                  },
                  {
                    title: "Smart Shopping Starts Here",
                    subtitle: "Premium quality • Lightning fast delivery",
                    image:
                      "https://images.unsplash.com/photo-1601598851547-4302969d0614?q=80&w=1600",
                  },
                ].map((slide, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="relative h-44 sm:h-52 md:h-60 lg:h-64 
                     rounded-3xl overflow-hidden flex items-center"
                    >
                      {/* Image */}
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40" />

                      {/* Text */}
                      <div className="relative z-10 px-6 sm:px-8 text-white max-w-xl">
                        <h1 className="text-xl sm:text-3xl font-extrabold mb-1">
                          {slide.title}
                        </h1>
                        <p className="text-sm sm:text-base opacity-90">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Controls (hidden on small screens) */}

            </Carousel>
            {/* MOBILE FILTER BUTTON */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="w-full flex items-center justify-between 
      bg-white border rounded-xl px-4 py-3 shadow-sm"
              >
                <span className="font-semibold text-sm flex items-center gap-2">
                  <CiFilter size={18} /> Filters
                </span>

                {selectedCategories.length > 0 && (
                  <span className="text-xs bg-[#0C831F] text-white px-2 py-0.5 rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </button>
            </div>



            {/* ===== SKELETON BEFORE DATA LOADS ===== */}
            {loading && (
              <section className="mb-14">
                <div className="grid gap-3 sm:gap-6 grid-cols-3 sm:grid-cols-4 lg:grid-cols-3">

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
                  <section key={cat.key} className="mb-14 dark:bg-zinc-900 dark:text-white">
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

                    <div className="grid gap-3 sm:gap-6 grid-cols-3 sm:grid-cols-4 lg:grid-cols-3">
                      {visible.map((item, idx) => {
                        const outOfStock = item.quantity === 0;
                        const lowStock = item.quantity > 0 && item.quantity < 10;

                        return (
                          <div
                            key={item._id}
                            className={`relative bg-white rounded-xl sm:rounded-2xl 
        p-2 sm:p-4 shadow-sm flex flex-col
        ${outOfStock ? "blur-[1.5px] opacity-60 pointer-events-none" : ""}`}
                          >
                            {/* OUT OF STOCK OVERLAY */}
                            {outOfStock && (
                              <div className="absolute inset-0 z-10 flex items-center justify-center">
                                <span className="bg-black/80 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full">
                                  OUT OF STOCK
                                </span>
                              </div>
                            )}

                            {/* TAG */}
                            {!outOfStock && (
                              <span className="absolute top-2 right-2 text-[9px] sm:text-[10px]
          bg-black/80 text-white px-1.5 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}

                            {/* IMAGE */}
                            <div className="w-full aspect-square sm:h-36 
        bg-[#F1F5F9] rounded-xl mb-2 overflow-hidden">
                              <img
                                src={`https://loremflickr.com/320/320/${encodeURIComponent(
                                  item.itemName
                                )}?random=${idx}`}
                                alt={item.itemName}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* TITLE */}
                            <h3 className="font-semibold text-[11px] sm:text-sm mb-1 line-clamp-2 text-black">
                              {item.itemName}
                            </h3>

                            {/* PRICE */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex flex-col">
                                <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                                  ₹{Math.round(item.amount * 1.75)}
                                </span>
                                <span className="font-bold text-[#0C831F] text-sm sm:text-lg">
                                  ₹{item.amount}
                                </span>
                              </div>

                              <div className="flex flex-col items-end gap-0.5">
                                <span className="text-[9px] sm:text-xs bg-[#0C831F] text-white px-1.5 py-0.5 rounded-full font-semibold">
                                  75% OFF
                                </span>

                                {/* STOCK TEXT */}
                                <span
                                  className={`text-[9px] sm:text-xs font-semibold
              ${lowStock ? "text-red-600" : "text-gray-500"}`}
                                >
                                  {lowStock
                                    ? `Only ${item.quantity} items left`
                                    : `${item.quantity} left`}
                                </span>
                              </div>
                            </div>

                            {/* QTY INPUT */}
                            <input
                              type="number"
                              min={1}
                              max={item.quantity}
                              disabled={outOfStock}
                              value={cartQty[item._id] || 1}
                              onChange={(e) =>
                                handleQtyChange(item._id, Number(e.target.value), item.quantity)
                              }
                              className="mb-2 px-2 py-1 border rounded-lg text-[11px] sm:text-sm text-black disabled:bg-gray-100"
                            />

                            {/* ADD BUTTON */}
                            <Button
                              disabled={outOfStock}
                              onClick={() => {
                                addToCart(item);
                                toast("Item added to cart", {
                                  description: "Item has been added to your cart.",
                                });
                              }}
                              className={`mt-auto w-full py-1.5 sm:py-2 
          rounded-lg sm:rounded-xl 
          text-xs sm:text-sm font-extrabold
          border transition
          ${outOfStock
                                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                  : "border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white"
                                }`}
                            >
                              ADD
                            </Button>
                          </div>
                        );
                      })}
                    </div>




                    <Divider className="my-6" />
                  </section>
                );
              })}
          </div>

          <FloatingCart />
        </div>
      )}
      {/* MOBILE FILTER SHEET */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 
      bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="text-sm font-semibold text-red-500"
              >
                Close
              </button>
            </div>

            {/* Categories */}
            <p className="font-semibold text-sm mb-3">Categories</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.key);

                return (
                  <button
                    key={cat.key}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        active
                          ? prev.filter((c) => c !== cat.key)
                          : [...prev, cat.key]
                      )
                    }
                    className={`border rounded-xl px-3 py-2 text-sm font-semibold
                transition ${active
                        ? "bg-[#0C831F] text-white border-[#0C831F]"
                        : "bg-white text-black"
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="font-semibold text-sm mb-2">
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

            {/* Apply */}
            <Button
              onClick={() => setShowMobileFilter(false)}
              className="w-full bg-[#0C831F] text-white font-bold rounded-xl"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}
