"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Divider } from "@heroui/divider";
import Footer from "./components/Footer";
import FloatingCart from "./components/FloatingCart";
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

/* ================= PAGE ================= */

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= GROUP BY CATEGORY ================= */

  const grouped = products.reduce((acc: any, p) => {
    acc[p.category.name] = acc[p.category.name] || [];
    acc[p.category.name].push(p);
    return acc;
  }, {});

  /* ================= CART ================= */

  const addToCart = (product: Product) => {
    const qty = cartQty[product.id] || 1;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((c: any) => c.productId === product.id);
    if (existing) existing.quantity += qty;
    else
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        quantity: qty,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast("Added to cart");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-24 px-4 -mt-24">
      <div className="max-w-7xl mx-auto pt-32">

        {/* ================= LOCATION BAR ================= */}
        <div className="mb-5 bg-white rounded-2xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Delivering to</p>
          <p className="font-semibold text-[#0C831F]">
            Your Location, India
          </p>
          <p className="text-xs text-gray-600 truncate">
            Auto-detected delivery address
          </p>
        </div>

        {/* ================= SEARCH ================= */}
        <input
          placeholder="Search for products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-white shadow-sm border mb-8"
        />

        {/* ================= HERO ================= */}
        <div className="h-48 rounded-3xl bg-gradient-to-r from-[#0C831F] to-[#14B8A6] text-white flex flex-col justify-center px-8 mb-12">
          <h1 className="text-3xl font-extrabold">
            Daily Essentials, Delivered Fast
          </h1>
          <p className="opacity-90">
            Curated products • Best pricing • Clean experience
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading &&
          Object.entries(grouped).map(([category, items]: any) => {
            const filtered = items.filter((p: Product) =>
              p.title.toLowerCase().includes(search.toLowerCase())
            );

            if (!filtered.length) return null;

            const showAll = expanded[category];
            const visible = showAll ? filtered : filtered.slice(0, 3);

            return (
              <section key={category} className="mb-16">
                {/* CATEGORY HEADER */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{category}</h2>

                  {filtered.length > 3 && (
                    <button
                      onClick={() =>
                        setExpanded((p) => ({
                          ...p,
                          [category]: !p[category],
                        }))
                      }
                      className="text-sm font-semibold text-[#0C831F]"
                    >
                      {showAll ? "Show less" : "See more"}
                    </button>
                  )}
                </div>

                {/* PRODUCTS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {visible.map((product: Product) => (
                    <div
                      key={product.id}
                      onClick={() =>
                        router.push(`/product/${product.id}`)
                      }
                      className="group cursor-pointer bg-white rounded-2xl p-4 
                      shadow-sm hover:shadow-xl transition-all flex flex-col"
                    >
                      <div className="aspect-square bg-[#F1F5F9] rounded-xl mb-3 overflow-hidden">
                        <img
                          src={product.images?.[0]}
                          alt={product.title}
                          className="w-full h-full object-cover 
                          group-hover:scale-105 transition"
                        />
                      </div>

                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {product.title}
                      </h3>

                      <p className="text-lg font-bold text-[#0C831F] mb-3">
                        ₹{product.price}
                      </p>

                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-auto"
                      >
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

                <Divider className="my-8" />
              </section>
            );
          })}

        <FloatingCart />
      </div>

      <Footer />
    </div>
  );
}
