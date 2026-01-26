"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CiFilter } from "react-icons/ci";
import { Divider } from "@heroui/divider";
import Footer from "./components/Footer";
import FloatingCart from "./components/FloatingCart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import ItemCardSkeleton from "./components/ItemCardSkeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ================= TYPES ================= */

type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
};

type UserAddress = {
  state: string;
  city: string;
  fullAddress: string;
};

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cartQty, setCartQty] = useState<{ [key: number]: number }>({});
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchProducts();
    fetchUserAddress();
    toast.success("Welcome back");
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://api.escuelajs.co/api/v1/products");
      setProducts(res.data);
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

  /* ================= FILTER ================= */

  const categories = Array.from(
    new Set(products.map((p) => p.category.name))
  );

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category.name);
    const matchesPrice = p.price <= priceRange;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  /* ================= CART ================= */

  const addToCart = (product: Product) => {
    const qty = cartQty[product.id] || 1;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((c: any) => c.productId === product.id);
    if (existing) existing.quantity += qty;
    else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-20 px-4 -mt-24 text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pt-32">

        {/* FILTER */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow border">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              Filters <CiFilter />
            </h3>

            <FieldGroup className="space-y-2">
              {categories.map((cat) => (
                <Field orientation="horizontal" key={cat}>
                  <Checkbox
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={(checked) =>
                      setSelectedCategories((p) =>
                        checked ? [...p, cat] : p.filter((c) => c !== cat)
                      )
                    }
                  />
                  <FieldContent>
                    <FieldLabel>{cat}</FieldLabel>
                  </FieldContent>
                </Field>
              ))}
            </FieldGroup>

            <Divider className="my-4" />

            <FieldTitle>Max Price ₹{priceRange}</FieldTitle>
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
        </aside>

        {/* MAIN */}
        <main>
          {userAddress && (
            <div className="mb-4 bg-white rounded-xl px-4 py-2 border">
              <p className="font-semibold text-[#0C831F]">
                Delivering to {userAddress.city}
              </p>
              <p className="text-xs truncate">{userAddress.fullAddress}</p>
            </div>
          )}

          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border mb-8"
          />

          {/* LOADING */}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-10"
              >
                {Array.from({ length: 6 }).map((_, j) => (
                  <ItemCardSkeleton key={j} />
                ))}
              </div>
            ))}

          {/* CATEGORY SECTIONS */}
          {!loading &&
            categories.map((cat) => {
              const catItems = filteredProducts.filter(
                (p) => p.category.name === cat
              );

              if (!catItems.length) return null;

              const isExpanded = expanded[cat];
              const visibleItems = isExpanded
                ? catItems
                : catItems.slice(0, 3);

              return (
                <section key={cat} className="mb-14">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{cat}</h2>
                    {catItems.length > 3 && (
                      <button
                        onClick={() =>
                          setExpanded((p) => ({ ...p, [cat]: !p[cat] }))
                        }
                        className="text-sm font-semibold text-[#0C831F]"
                      >
                        {isExpanded ? "Show less" : "See more"}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-4">
                    {visibleItems.map((product) => (
                      <div
                        key={product.id}
                        onClick={() =>
                          router.push(`/product/${product.id}`)
                        }
                        className="bg-white rounded-2xl p-3 shadow hover:shadow-lg transition cursor-pointer flex flex-col"
                      >
                        <div className="aspect-square bg-gray-100 rounded-xl mb-2 overflow-hidden">
                          <img
                            src={product.images?.[0]}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <h3 className="text-sm font-semibold line-clamp-2">
                          {product.title}
                        </h3>

                        <div className="mt-1 mb-2">
                          <span className="text-xs line-through text-gray-400">
                            ₹{Math.round(product.price * 1.6)}
                          </span>
                          <span className="ml-2 text-lg font-bold text-[#0C831F]">
                            ₹{product.price}
                          </span>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="mt-auto w-full rounded-xl font-bold border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white"
                        >
                          ADD
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
        </main>

        <FloatingCart />
      </div>

      <Footer />
    </div>
  );
}
