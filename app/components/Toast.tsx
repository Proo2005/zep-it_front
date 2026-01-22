"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60]">
      <div className="bg-black text-white px-5 py-3 rounded-xl 
                      shadow-xl text-sm font-semibold
                      animate-[toastSlide_0.3s_ease-out]">
        {message}
      </div>

      <style jsx>{`
        @keyframes toastSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
