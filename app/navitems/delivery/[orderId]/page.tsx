"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaStar, FaPhoneAlt } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

export default function DeliveryPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // 🔹 Replace later with real API
    setOrder({
      driver: {
        name: "Rahul Sharma",
        vehicle: "KA-05-MH-2345",
        rating: 4.6,
        phone: "+91 98765 43210",
      },
      user: {
        name: localStorage.getItem("name"),
        address: localStorage.getItem("fullAddress"),
      },
      items: JSON.parse(localStorage.getItem("cartBackup") || "[]"),
      paymentMethod: "Razorpay (Paid)",
      total: localStorage.getItem("lastAmount"),
    });
  }, [orderId]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* MAP */}
        <div className="w-full h-64 rounded-2xl overflow-hidden border">
          <img
            src="https://maps.googleapis.com/maps/api/staticmap?center=India&zoom=5&size=800x400"
            alt="Map"
            className="w-full h-full object-cover"
          />
        </div>

        {/* DRIVER CARD */}
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3">Delivery Partner</h2>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{order.driver.name}</p>
              <p className="text-sm text-gray-600">
                Vehicle: {order.driver.vehicle}
              </p>

              <div className="flex items-center gap-1 mt-1">
                <FaStar className="text-yellow-500" />
                <span className="font-semibold">{order.driver.rating}</span>
              </div>
            </div>

            <a
              href={`tel:${order.driver.phone}`}
              className="p-3 bg-green-600 text-white rounded-full"
            >
              <FaPhoneAlt />
            </a>
          </div>

          {/* MESSAGE BOX */}
          <div className="mt-4 flex gap-2">
            <input
              placeholder="Send message to driver"
              className="flex-1 border rounded-xl px-4 py-2"
            />
            <button className="px-4 bg-gray-800 text-white rounded-xl">
              <IoSend />
            </button>
          </div>
        </div>

        {/* ORDER DETAILS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>

          <p className="mb-1">
            <span className="font-semibold">Customer:</span> {order.user.name}
          </p>
          <p className="mb-3">
            <span className="font-semibold">Address:</span> {order.user.address}
          </p>

          <div className="divide-y">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between py-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 font-bold">
            <span>Total</span>
            <span className="text-green-600">₹{order.total}</span>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Payment Method: {order.paymentMethod}
          </p>
        </div>
      </div>
    </div>
  );
}
