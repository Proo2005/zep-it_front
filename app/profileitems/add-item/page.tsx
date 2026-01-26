"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type Category = {
  id: number;
  name: string;
};

/* ================= PAGE ================= */

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    image: "",
  });

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://api.escuelajs.co/api/v1/categories"
      );
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.categoryId || !form.image) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/products/create", {
        title: form.title,
        price: Number(form.price),
        description: form.description,
        categoryId: Number(form.categoryId),
        images: [form.image],
      });

      toast.success("Product created successfully");

      setForm({
        title: "",
        price: "",
        description: "",
        categoryId: "",
        image: "",
      });
    } catch (err) {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 py-20 text-black -mt-24">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black pt-32">
            Create Product
          </h1>
          <p className="text-gray-600">
            Add a new product to the catalog
          </p>
        </div>

        {/* CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* TITLE */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Product Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Handmade Fresh Table"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Price (₹)
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="699"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE URL */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://placehold.co/600x400"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
              required
            />
          </div>

          {/* IMAGE PREVIEW */}
          {form.image && (
            <div className="sm:col-span-2">
              <p className="text-sm font-semibold mb-2">Preview</p>
              <div className="w-40 h-40 rounded-xl border overflow-hidden bg-gray-100">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A high quality handmade product…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
            />
          </div>

          {/* ACTION */}
          <div className="sm:col-span-2 flex justify-end">
            <Button
              disabled={loading}
              className="px-8 py-3 rounded-xl font-bold
              border border-[#0C831F] text-[#0C831F]
              hover:bg-[#0C831F] hover:text-white transition"
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
