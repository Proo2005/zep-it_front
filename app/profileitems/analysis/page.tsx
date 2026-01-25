"use client";

import { useEffect, useState } from "react";


export default function ShopAnalysisPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://zep-it-back.onrender.com/api/shop-analysis", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] pb-16 px-4 relative -mt-24 text-black">
      <div className="max-w-7xl mx-auto gap-8 pt-32">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Shop Performance Overview</h1>
          <p className="text-gray-800 mt-1">
            Monthly sales, revenue & payment insights
          </p>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat
            title="Total Revenue"
            value={`₹${data.totalRevenue.toLocaleString()}`}
            accent="green"
          />
          <Stat
            title="Items Sold"
            value={data.totalItemsSold}
            accent="blue"
          />
          <Stat
            title="Total Orders"
            value={data.totalOrders}
            accent="purple"
          />
        </div>

        {/* GRID SECTIONS */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* PAYMENT SPLIT */}
          <Section title="Payment Method Breakdown">
            {data.paymentSplit.map((p: any) => (
              <Row
                key={p._id}
                label={p._id}
                value={`₹${p.amount.toLocaleString()}`}
              />
            ))}
          </Section>

          {/* WEEKLY SALES */}
          <Section title="Weekly Sales Trend">
            {data.weekly.map((w: any) => (
              <Row
                key={w._id}
                label={`Week ${w._id}`}
                value={`₹${w.total.toLocaleString()}`}
              />
            ))}
          </Section>
        </div>

        {/* MONTHLY SALES */}
        <Section title="Monthly Revenue Summary">
          <div className="grid md:grid-cols-3 gap-4">
            {data.monthly.map((m: any) => (
              <div
                key={m._id}
                className=" rounded-xl p-4 border border-zinc-700"
              >
                <p className="text-gray-800 text-sm">Month {m._id}</p>
                <p className="text-xl font-bold text-green-400 mt-1">
                  ₹{m.total.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* FOOTER NOTE */}
        <div className="text-sm text-gray-500 pt-6 border-t border-zinc-800">
          Data updated in real-time • Secure & encrypted analytics
        </div>
      </div>
    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

const Stat = ({ title, value, accent }: any) => {
  const accentMap: any = {
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition">
      <p className="text-black text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${accentMap[accent]}`}>
        {value}
      </h2>
    </div>
  );
};

const Section = ({ title, children }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-zinc-800">
    <h2 className="text-xl font-semibold mb-5">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex justify-between items-center bg-white px-4 py-3 rounded-lg">
    <span className="text-gray-800">{label}</span>
    <span className="font-semibold text-black">{value}</span>
  </div>
);
