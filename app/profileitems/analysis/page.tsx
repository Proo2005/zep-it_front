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
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Shop Performance Overview</h1>
          <p className="text-gray-600 mt-1">
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
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
              >
                <p className="text-gray-500 text-sm">Month {m._id}</p>
                <p className="text-xl font-bold text-black mt-1">
                  ₹{m.total.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* FOOTER NOTE */}
        <div className="text-sm text-gray-500 pt-6 border-t border-gray-200">
          Data updated in real-time • Secure & encrypted analytics
        </div>
      </div>
    </div>
  );
}

/* ------------------ UI COMPONENTS ------------------ */

const Stat = ({ title, value, accent }: any) => {
  const accentMap: any = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${accentMap[accent]}`}>{value}</h2>
    </div>
  );
};

const Section = ({ title, children }: any) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow hover:shadow-md transition">
    <h2 className="text-xl font-semibold mb-5">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 shadow-sm">
    <span className="text-gray-700">{label}</span>
    <span className="font-semibold text-black">{value}</span>
  </div>
);
