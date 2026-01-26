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

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cartQty, setCartQty] = useState<{ [key: number]: number }>({});

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchProducts();
    toast.success("Welcome back");
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.escuelajs.co/api/v1/products"
      );
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
    const matchesSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase());
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

    if (existing) {
      existing.quantity += qty;
    } else {
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

    toast("Item added to cart");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-20 px-4 -mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 pt-32">

        {/* ============ FILTER PANEL ============ */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 bg-white rounded-2xl p-5 shadow-sm border">
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

        {/* ============ MAIN CONTENT ============ */}
        <main>
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white shadow-sm border mb-8"
          />

          {/* HERO */}
          <div className="h-52 rounded-3xl bg-gradient-to-r from-[#0C831F] to-[#14B8A6] text-white flex flex-col justify-center px-8 mb-10">
            <h1 className="text-3xl font-extrabold">
              Shop Smart. Live Better.
            </h1>
            <p className="opacity-90">
              Premium products • Clean UI • Fast checkout
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* PRODUCTS */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="group cursor-pointer bg-white rounded-2xl p-4 
                  shadow-sm hover:shadow-xl transition-all flex flex-col"
                >
                  {/* IMAGE */}
                  <div className="aspect-square bg-[#F1F5F9] rounded-xl mb-3 overflow-hidden">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-full h-full object-cover 
                      group-hover:scale-105 transition"
                    />
                  </div>

                  {/* TITLE */}
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {product.title}
                  </h3>

                  {/* CATEGORY */}
                  <p className="text-xs text-gray-500 mb-2">
                    {product.category.name}
                  </p>

                  {/* PRICE */}
                  <p className="text-lg font-bold text-[#0C831F] mb-3">
                    ₹{product.price}
                  </p>

                  {/* ACTIONS */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-auto"
                  >
                    <input
                      type="number"
                      min={1}
                      value={cartQty[product.id] || 1}
                      onChange={(e) =>
                        handleQtyChange(
                          product.id,
                          Number(e.target.value)
                        )
                      }
                      className="w-full mb-2 px-3 py-1.5 border rounded-lg text-sm"
                    />

                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 rounded-xl 
                      font-bold border border-[#0C831F] 
                      text-[#0C831F] hover:bg-[#0C831F] hover:text-white"
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <FloatingCart />
      </div>

      <Footer />
    </div>
  );
}
