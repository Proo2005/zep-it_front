"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  /* ------------------ Admin Password ------------------ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123456789") {
      setAccessGranted(true);
      setError("");
      fetchAnalysis(); // load shop analysis after login
    } else {
      setError("Incorrect password. Try again!");
    }
  };

  /* ------------------ Fetch Shop Analysis ------------------ */
  const fetchAnalysis = () => {
    fetch("https://zep-it-back.onrender.com/api/shop-analysis", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then(setData);
  };

  /* ------------------ Loading Screen ------------------ */
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

  /* ------------------ Admin Dashboard ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
      <div className="max-w-7xl mx-auto gap-8 pt-32">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
          {/* Sidebar */}
          <div className="col-span-1 bg-white rounded-2xl shadow-md p-6 space-y-4 sticky top-32 h-[calc(100vh-128px)]">
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
          <div className="col-span-4 bg-white rounded-2xl shadow-md p-6 overflow-y-auto max-h-[calc(100vh-128px)]">
            {!data ? (
              <p className="text-gray-600 text-center mt-10">Loading analytics…</p>
            ) : (
              <ShopAnalysisContent data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Shop Analysis Component ------------------ */
const ShopAnalysisContent = ({ data }: any) => (
  <div className="space-y-10">
    {/* HEADER */}
    <div>
      <h1 className="text-2xl font-bold mb-1">Shop Performance Overview</h1>
      <p className="text-gray-600 text-sm">
        Monthly sales, revenue & payment insights
      </p>
    </div>

    {/* TOP METRICS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Stat title="Total Revenue" value={`₹${data.totalRevenue.toLocaleString()}`} accent="green" />
      <Stat title="Items Sold" value={data.totalItemsSold} accent="blue" />
      <Stat title="Total Orders" value={data.totalOrders} accent="purple" />
    </div>

    {/* PAYMENT SPLIT & WEEKLY */}
    <div className="grid lg:grid-cols-2 gap-8">
      <Section title="Payment Method Breakdown">
        {data.paymentSplit.map((p: any) => (
          <Row key={p._id} label={p._id} value={`₹${p.amount.toLocaleString()}`} />
        ))}
      </Section>
      <Section title="Weekly Sales Trend">
        {data.weekly.map((w: any) => (
          <Row key={w._id} label={`Week ${w._id}`} value={`₹${w.total.toLocaleString()}`} />
        ))}
      </Section>
    </div>

    {/* MONTHLY */}
    <Section title="Monthly Revenue Summary">
      <div className="grid md:grid-cols-3 gap-4">
        {data.monthly.map((m: any) => (
          <div key={m._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm">Month {m._id}</p>
            <p className="text-lg font-bold text-black mt-1">
              ₹{m.total.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Section>
  </div>
);

/* ------------------ UI Components ------------------ */
const Stat = ({ title, value, accent }: any) => {
  const accentMap: any = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${accentMap[accent]}`}>{value}</h2>
    </div>
  );
};

const Section = ({ title, children }: any) => (
  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
    <h2 className="text-xl font-semibold mb-5">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm">
    <span className="text-gray-700">{label}</span>
    <span className="font-semibold text-black">{value}</span>
  </div>
);
