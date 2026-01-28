"use client";

import { useEffect, useState } from "react";

export default function DeliveryBikeIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => setShow(false), 2000);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      <div className="absolute bottom-24 text-6xl animate-bike">
        🛵💨
      </div>

      <style jsx>{`
        .animate-bike {
          animation: bikeMove 2s linear forwards;
        }

        @keyframes bikeMove {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(120vw);
          }
        }
      `}</style>
    </div>
  );
}
