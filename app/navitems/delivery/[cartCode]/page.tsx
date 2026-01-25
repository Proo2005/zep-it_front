"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type Driver = {
  _id?: string;
  name: string;
  phoneNumber: string;
  vehicleNumber: string;
  vehicleType: string;
};

type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  addedBy?: { name: string; email: string };
};

const libraries: ("places")[] = ["places"];
const API = "https://zep-it-back.onrender.com";

export default function DeliveryPage() {
  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;

  const [driver, setDriver] = useState<Driver | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // replace with your key
    libraries,
  });

  /* ---------------- LOAD CART AND RANDOM DRIVER ---------------- */
  useEffect(() => {
    const fetchDelivery = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/navitems/login");

      let items: CartItem[] = [];
      if (!cartCode) {
        items = JSON.parse(localStorage.getItem("cart") || "[]");
      } else {
        const res = await fetch(`${API}/api/cart/${cartCode}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        items = data.items || [];
      }

      setCartItems(items);
      setTotal(items.reduce((acc, i) => acc + i.price * i.quantity, 0));

      // Fetch drivers
      const driverRes = await fetch(`${API}/api/drivers`);
      const drivers: Driver[] = await driverRes.json();
      if (drivers.length > 0) {
        const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
        setDriver(randomDriver);
      }
    };

    fetchDelivery();
  }, [cartCode]);

  /* ---------------- COUNTDOWN ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSuccess(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return <div className="text-center mt-20">Loading map...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9FC] to-[#EEF2F7] p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Delivery Details</h1>

      {/* MAP */}
      <div className="w-full h-64 rounded-xl overflow-hidden mb-6 shadow-md">
        <GoogleMap
          zoom={14}
          center={{ lat: 28.6139, lng: 77.209 }}
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <Marker position={{ lat: 28.6139, lng: 77.209 }} />
        </GoogleMap>
      </div>

      {/* DRIVER DETAILS */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md border-l-4 border-green-500">
        <h2 className="text-xl font-semibold mb-2">Driver Details</h2>
        {driver ? (
          <>
            <p><b>Name:</b> {driver.name}</p>
            <p><b>Phone:</b> {driver.phoneNumber}</p>
            <p><b>Vehicle:</b> {driver.vehicleNumber} ({driver.vehicleType})</p>
          </>
        ) : (
          <p>Loading driver...</p>
        )}
      </div>

      {/* CART ITEMS */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md border-l-4 border-purple-500">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.length === 0 && <p>Your cart is empty.</p>}
        {cartItems.map((item) => (
          <div key={item.itemId} className="flex justify-between border-b py-2">
            <div>
              <span>{item.name} x {item.quantity}</span>
              {item.addedBy && <p className="text-sm text-gray-500">Added by: {item.addedBy.name}</p>}
            </div>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* COUNTDOWN TIMER */}
      <div className="bg-green-500 text-black font-bold text-center py-3 rounded-xl text-lg shadow-md">
        Estimated Arrival in: {countdown}s
      </div>

      {/* DELIVERY SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Delivery Successful ✅</h2>
            <p className="mb-6">Your order has been delivered successfully.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-green-600 text-black rounded-xl font-bold hover:bg-green-500"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
