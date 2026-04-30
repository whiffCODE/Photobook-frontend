"use client";

import { useEffect, useState } from "react";

const allImages = Array.from(
  { length: 52 },
  (_, i) => `/images/${i + 1}.jpeg`
);

// 🎯 Categories
const categories: Record<string, string[]> = {
  ALL: allImages,
  "BABA-MAA-ME": allImages.slice(0, 13),
  "DIDA-DADU": allImages.slice(13, 26),
  FRIENDS: allImages.slice(26, 39),
  HIM: allImages.slice(39, 52),
};

export default function ImageGrid({ category }: { category: string }) {
  const [selected, setSelected] = useState<string | null>(null);

  const images = categories[category] || [];

  // 🔐 Close modal with ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🛑 Prevent background scroll when modal open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selected]);

  return (
    <div className="p-6">

      {/* 🖼️ Grid */}
      {images.length === 0 ? (
        <p className="text-center opacity-60">
          No memories found here... yet ✨
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`memory-${i}`}
              loading="lazy"
              onClick={() => setSelected(img)}
              className="rounded-xl cursor-pointer hover:scale-105 hover:brightness-110 transition duration-300"
            />
          ))}
        </div>
      )}

      {/* 🔍 Fullscreen Preview */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl animate-fadeIn"
          />
        </div>
      )}
    </div>
  );
}