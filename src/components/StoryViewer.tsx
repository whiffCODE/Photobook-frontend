"use client";

import { useState } from "react";

const stories = Array.from(
  { length: 10 },
  (_, i) => `/images/${i + 1}.jpeg`
);

export default function StoryViewer() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <div className="p-6">
      <div className="flex gap-4 overflow-x-auto">
        {stories.map((s, i) => (
          <img
            key={i}
            src={s}
            onClick={() => setIndex(i)}
            className="w-20 h-20 rounded-full border-2 border-pink-500 cursor-pointer"
          />
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          onClick={() => setIndex(null)}
        >
          <img src={stories[index]} className="max-h-full" />
        </div>
      )}
    </div>
  );
}