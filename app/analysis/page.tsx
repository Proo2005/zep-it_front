"use client";

import { useEffect, useState } from "react";

export default function ShopAnalysisPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/shop-analysis", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Shop Monthly Analysis</h1>

      {/* TOP METRICS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Stat title="Total Revenue" value={`₹${data.totalRevenue}`} />
        <Stat title="Items Sold" value={data.totalItemsSold} />
        <Stat title="Total Orders" value={data.totalOrders} />
      </div>

      {/* PAYMENT SPLIT */}
      <Section title="Debit / Credit Breakdown">
        {data.paymentSplit.map((p: any) => (
          <div key={p._id} className="flex justify-between">
            <span>{p._id}</span>
            <span className="font-semibold">₹{p.amount}</span>
          </div>
        ))}
      </Section>

      {/* WEEKLY */}
      <Section title="Weekly Sales">
        {data.weekly.map((w: any) => (
          <Row label={`Week ${w._id}`} value={`₹${w.total}`} />
        ))}
      </Section>

      {/* MONTHLY */}
      <Section title="Monthly Sales">
        {data.monthly.map((m: any) => (
          <Row label={`Month ${m._id}`} value={`₹${m.total}`} />
        ))}
      </Section>
    </div>
  );
}

const Stat = ({ title, value }: any) => (
  <div className="bg-zinc-900 p-6 rounded-xl">
    <p className="text-gray-400">{title}</p>
    <h2 className="text-2xl font-bold mt-2">{value}</h2>
  </div>
);

const Section = ({ title, children }: any) => (
  <div className="bg-zinc-900 p-6 rounded-xl mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Row = ({ label, value }: any) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);
