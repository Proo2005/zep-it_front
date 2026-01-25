"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123456789") {
      setAccessGranted(true);
      setError("");
    } else {
      setError("Incorrect password. Try again!");
    }
  };

  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] px-4 text-black -mt-24">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-black py-2 rounded-xl font-bold hover:bg-green-500 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Content
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
      <div className="max-w-7xl mx-auto gap-8 pt-32">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Tabs</h2>
            <ul className="space-y-2">
              <li className="px-3 py-2 rounded-xl hover:bg-green-50 cursor-pointer"><a href="/essential/contact-messages">Contact</a></li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50 cursor-pointer"><a href="/essential/driver">Driver</a></li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50 cursor-pointer"><a href="/essential/joincart">Join Cart</a></li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50 cursor-pointer"><a href="/essential/shop-items">Shop-Items</a></li>
              <li className="px-3 py-2 rounded-xl hover:bg-green-50 cursor-pointer"><a href="/essential/uploadblinkitlocation">Blinkit Locations</a></li>
            </ul>
          </div>

          {/* Content Area */}
          <div className="col-span-4 bg-white rounded-2xl shadow-md p-6 min-h-[400px]">
            <p className="text-gray-600">
              Select a tab to view or manage content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
