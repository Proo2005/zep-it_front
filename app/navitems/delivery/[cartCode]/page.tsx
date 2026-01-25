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

type User = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
};

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

const libraries: ("places")[] = ["places"];
const API = "https://zep-it-back.onrender.com";

export default function DeliveryPage() {
  const router = useRouter();
  const params = useParams();
  const cartCode = params?.cartCode as string | undefined;

  const [driver, setDriver] = useState<Driver | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [countdown, setCountdown] = useState(15);

  /* Load Google Maps */
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // replace with your key
    libraries,
  });

  /* Fetch cart and user data */
  useEffect(() => {
    const fetchDelivery = async () => {
      const token = localStorage.getItem("token");
      if (!token || !cartCode) return;

      // Fetch cart data from backend
      const res = await fetch(`${API}/api/cart/${cartCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setUser(data.user || { name: "Jane Doe", phone: "9876543210", address: "123 Street", city: "Delhi", state: "Delhi" });
      setCartItems(data.items || []);
      setTotal(data.items?.reduce((acc: any, i: any) => acc + i.price * i.quantity, 0) || 0);

      // Fetch all drivers
      const driverRes = await fetch(`${API}/api/drivers`);
      const drivers: Driver[] = await driverRes.json();
      if (drivers.length > 0) {
        const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
        setDriver(randomDriver);
      }
    };

    fetchDelivery();
  }, [cartCode]);

  /* Countdown Timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Delivery Details</h1>

      {/* MAP */}
      <div className="w-full h-64 rounded-xl overflow-hidden mb-6 shadow-md">
        <GoogleMap
          zoom={14}
          center={{ lat: 28.6139, lng: 77.209 }} // example: Delhi
          mapContainerStyle={{ width: "100%", height: "100%" }}
        >
          <Marker position={{ lat: 28.6139, lng: 77.209 }} />
        </GoogleMap>
      </div>

      {/* DRIVER DETAILS */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md">
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

      {/* USER DETAILS */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Delivery To</h2>
        {user ? (
          <>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>Address:</b> {user.address}, {user.city}, {user.state}</p>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>

      {/* CART ITEMS */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{item.name} x {item.quantity}</span>
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
    </div>
  );
}
