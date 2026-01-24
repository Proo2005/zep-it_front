"use client";

export default function Hover3DCards() {
  const cards = [
    "https://img.daisyui.com/images/stock/card-1.webp?x",
    "https://img.daisyui.com/images/stock/card-2.webp?x",
    "https://img.daisyui.com/images/stock/card-3.webp?x",
  ];

  return (
    <div className="flex flex-wrap gap-8 justify-center p-10">
      {cards.map((src, idx) => (
        <div key={idx} className="hover-3d relative">
          {/* card content */}
          <figure className="w-60 rounded-2xl overflow-hidden">
            <img src={src} alt={`3D Card ${idx + 1}`} className="w-full h-full object-cover" />
          </figure>

          {/* 8 empty divs for the 3D hover effect */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
      ))}
    </div>
  );
}
