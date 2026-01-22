"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AddItem() {
  const [form, setForm] = useState({
    shopName: "",
    shopGstId: "",
    shopkeeperEmail: "",
    category: "grocery_and_kitchen",
    itemName: "",
    quantity: 1,
    amount: "",
  });

  // Autofill email for shop accounts
  useEffect(() => {
    const email = localStorage.getItem("email");
    const type = localStorage.getItem("type");

    if (type !== "shop") {
      alert("Only shop accounts can add items");
      return;
    }

    if (email) {
      setForm((prev) => ({
        ...prev,
        shopkeeperEmail: email,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("https://zep-it-back.onrender.com/api/item/add", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Item added successfully");

      setForm((prev) => ({
        ...prev,
        itemName: "",
        quantity: 1,
        amount: "",
      }));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] flex items-center justify-center text-black -mt-24">


      <form
        onSubmit={handleSubmit}
        className=" p-6 rounded-xl w-[420px] space-y-4 outline-black"
      >
        <h2 className=" text-xl font-bold">Add Item</h2>

        {/* Shop Name */}
        <div>
          <label className="text-sm text-gray-600">Shop Name</label>
          <input
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded  outline-black"
            placeholder="Shop Name"
            required
          />
        </div>

        {/* GST ID */}
        <div>
          <label className="text-sm text-gray-600">Shop GST ID</label>
          <input
            name="shopGstId"
            value={form.shopGstId}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded outline-black"
            placeholder="GST ID"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Shopkeeper Email</label>
          <input
            value={form.shopkeeperEmail}
            disabled
            className="w-full px-3 py-2 rounded  cursor-not-allowed"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm text-gray-600">Item Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded outline-black"
          >
            <option value="grocery_and_kitchen">Grocery & Kitchen</option>
            <option value="snacks_and_drinks">Snacks & Drinks</option>
            <option value="beauty_and_personal_care">
              Beauty & Personal Care
            </option>
            <option value="household_essential">
              Household Essential
            </option>
          </select>
        </div>

        {/* Item Name + Quantity */}
        <div>
          <label className="text-sm text-gray-800">Item Name & Quantity</label>
          <div className="flex gap-2">
            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="Item name"
              className="flex-1 px-3 py-2 rounded outline-black"
              required
            />

            <input
              name="quantity"
              type="number"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              className="w-24 px-3 py-2 rounded outline-black"
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm text-gray-600">Amount (₹)</label>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded outline-black"
            placeholder="Amount"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!form.itemName}
          className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black py-2 rounded-lg font-semibold"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
