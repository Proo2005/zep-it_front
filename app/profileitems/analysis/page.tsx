"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import PageTransition from "@/app/components/animations/PageTransition";

type MonthlyStat = {
  month: string;
  revenue: number;
  orders: number;
  itemsSold: number;
};

export default function MonthlyAnalysisPage() {
  const [data, setData] = useState<MonthlyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await API.get("/analysis/monthly");
        setData(res.data);
      } catch (err) {
        console.error("Monthly analysis failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthly();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading monthly analysis...
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F6FB] px-6 py-10 text-black -mt-24">
        <div className="max-w-7xl mx-auto pt-32 space-y-8">
          <h1 className="text-3xl font-bold">Monthly Sales Analysis</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Revenue"
              value={`₹${data.reduce((a, b) => a + b.revenue, 0)}`}
            />
            <StatCard
              title="Total Orders"
              value={data.reduce((a, b) => a + b.orders, 0)}
            />
            <StatCard
              title="Items Sold"
              value={data.reduce((a, b) => a + b.itemsSold, 0)}
            />
          </div>

          {/* Monthly Table */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Month-wise Breakdown
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Month</th>
                    <th>Revenue</th>
                    <th>Orders</th>
                    <th>Items Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((m) => (
                    <tr key={m.month} className="border-b last:border-none">
                      <td className="py-2 font-medium">
                        {new Date(`${m.month}-01`).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td>₹{m.revenue}</td>
                      <td>{m.orders}</td>
                      <td>{m.itemsSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data.length === 0 && (
                <p className="text-center text-gray-500 py-6">
                  No data available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

/* ---------- UI ---------- */

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
