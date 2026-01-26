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
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
};

type UserAddress = {
  state: string;
  city: string;
  fullAddress: string;
};

export default function HomePage() {
  const router = useRouter();
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cartQty, setCartQty] = useState<{ [key: number]: number }>({});

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchProducts();
    fetchUserAddress();
    toast.success("Welcome back");
  }, []);

  const fetchUserAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      "https://zep-it-back.onrender.com/api/user/profile",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.user?.address) setUserAddress(res.data.user.address);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://api.escuelajs.co/api/v1/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERS ================= */

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

  const handleQtyChange = (id: number, value: number) => {
    if (value < 1) value = 1;
    setCartQty((prev) => ({ ...prev, [id]: value }));
  };

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
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-20 px-3 sm:px-4 -mt-24 text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pt-32">

        {/* FILTER PANEL */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow border">
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              Filters <CiFilter />
            </h3>

            <FieldGroup className="space-y-3 mb-6">
              <p className="font-semibold text-sm">Categories</p>
              {categories.map((cat) => (
                <Field orientation="horizontal" key={cat}>
                  <Checkbox
                    id={cat}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={(checked) =>
                      setSelectedCategories((prev) =>
                        checked
                          ? [...prev, cat]
                          : prev.filter((c) => c !== cat)
                      )
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={cat}>{cat}</FieldLabel>
                  </FieldContent>
                </Field>
              ))}
            </FieldGroup>

            <Divider className="my-5" />

            <div>
              <FieldTitle className="mb-2">
                Max Price: ₹{priceRange}
              </FieldTitle>
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
        </aside>

        {/* MAIN */}
        <main>
          {userAddress && (
            <div className="mb-4 bg-white/80 border rounded-xl px-4 py-2">
              <p className="font-semibold text-[#0C831F]">
                Delivering to {userAddress.city}, {userAddress.state}
              </p>
              <p className="text-xs truncate">{userAddress.fullAddress}</p>
            </div>
          )}

          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border mb-6"
          />

          {/* HERO */}
          <div className="h-44 sm:h-52 rounded-3xl bg-gradient-to-r from-[#0C831F] to-[#14B8A6] text-white flex flex-col justify-center px-6 sm:px-8 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Shop Smart. Live Better.
            </h1>
            <p className="opacity-90 text-sm sm:text-base">
              Premium products • Clean UI • Fast checkout
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* PRODUCTS */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const fakeMRP = Math.round(product.price * 1.6);
                return (
                  <div
                    key={product.id}
                    onClick={() => router.push(`/product/${product.id}`)}
                    className="group cursor-pointer bg-white rounded-2xl p-3 sm:p-4 shadow hover:shadow-xl transition flex flex-col"
                  >
                    <div className="relative aspect-square bg-[#F1F5F9] rounded-xl mb-3 overflow-hidden">
                      <span className="absolute top-2 left-2 text-[10px] bg-[#0C831F] text-white px-2 py-0.5 rounded-full">
                        60% OFF
                      </span>
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    <h3 className="text-sm font-semibold line-clamp-2 mb-1">
                      {product.title}
                    </h3>

                    <p className="text-xs text-gray-500 mb-2">
                      {product.category.name}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs line-through text-gray-400">
                        ₹{fakeMRP}
                      </span>
                      <span className="text-lg font-bold text-[#0C831F]">
                        ₹{product.price}
                      </span>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-auto"
                    >
                      <input
                        type="number"
                        min={1}
                        value={cartQty[product.id] || 1}
                        onChange={(e) =>
                          handleQtyChange(product.id, Number(e.target.value))
                        }
                        className="w-full mb-2 px-3 py-1.5 border rounded-lg text-sm"
                      />

                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 rounded-xl font-bold border border-[#0C831F] text-[#0C831F] hover:bg-[#0C831F] hover:text-white"
                      >
                        ADD
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <FloatingCart />
      </div>

      <Footer />
    </div>
  );
}
