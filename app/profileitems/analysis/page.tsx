"use client";

import { useEffect, useState } from "react";
import { FiTrendingUp, FiShoppingCart, FiDollarSign, FiBox } from "react-icons/fi";

type Summary = {
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  avgOrderValue: number;
};

type Order = {
  _id: string;
  amount: number;
  itemsCount: number;
  status: string;
  createdAt: string;
};

type TopItem = {
  name: string;
  quantity: number;
};

export default function ShopAnalysisPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          "https://zep-it-back.onrender.com/api/analysis/shop",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setSummary(data.summary);
        setOrders(data.orders);
        setTopItems(data.topItems);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] px-6 py-10 text-black">
      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Shop Analysis</h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${summary?.totalRevenue}`}
            icon={<FiDollarSign />}
          />
          <StatCard
            title="Total Orders"
            value={summary?.totalOrders}
            icon={<FiShoppingCart />}
          />
          <StatCard
            title="Items Sold"
            value={summary?.totalItemsSold}
            icon={<FiBox />}
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${summary?.avgOrderValue}`}
            icon={<FiTrendingUp />}
          />
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Order ID</th>
                  <th>Amount</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b last:border-none">
                    <td className="py-2">{order._id.slice(-6)}</td>
                    <td>₹{order.amount}</td>
                    <td>{order.itemsCount}</td>
                    <td
                      className={
                        order.status === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {order.status}
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP ITEMS */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Selling Items</h2>

          <ul className="space-y-3">
            {topItems.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b pb-2 last:border-none"
              >
                <span>{item.name}</span>
                <span className="font-semibold">{item.quantity} sold</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
      <div className="text-[#0C831F] text-2xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
