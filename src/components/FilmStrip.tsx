"use client";

import { motion } from "framer-motion";

// Update this with your actual image count
const images = Array.from({ length: 52 }, (_, i) => `/images/${i + 1}.jpeg`);

type FilmStripProps = {
  onImageClick?: (src: string) => void;
};

export default function FilmStrip({ onImageClick }: FilmStripProps) {
  const row1 = images.slice(0, 26);
  const row2 = images.slice(26, 52);

  return (
    // 🔧 allow clicks on frames
    <div className="absolute inset-0 overflow-hidden z-0 bg-[#050101] pointer-events-auto select-none">
      {/* 1. Global Cinematic Filter Section */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Deep Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(5,1,1,1)_100%)]" />
        
        {/* Top/Bottom Cinematic Bars Blur */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#050101] to-transparent z-30" />
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#050101] to-transparent z-30" />
      </div>

      {/* 2. Moving Film Strips Container */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 rotate-[-8deg] scale-125 opacity-50">
        
        {/* --- ROW 1: RIGHT TO LEFT --- */}
        <div className="relative">
          <motion.div
            className="flex gap-10"
            animate={{ x: [0, -3500] }}
            transition={{
              repeat: Infinity,
              duration: 70,
              ease: "linear",
            }}
          >
            {[...row1, ...row1, ...row1].map((img, i) => (
              <Frame
                key={`row1-${i}`}
                img={img}
                delay={i * 0.2}
                direction="up"
                onImageClick={onImageClick} // 👈 pass down
              />
            ))}
          </motion.div>
        </div>

        {/* --- ROW 2: LEFT TO RIGHT --- */}
        <div className="relative">
          <motion.div
            className="flex gap-10"
            animate={{ x: [-3500, 0] }}
            transition={{
              repeat: Infinity,
              duration: 90,
              ease: "linear",
            }}
          >
            {[...row2, ...row2, ...row2].map((img, i) => (
              <Frame
                key={`row2-${i}`}
                img={img}
                delay={i * 0.3}
                direction="down"
                onImageClick={onImageClick} // 👈 pass down
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. Aesthetic Light Bleeds & Atmosphere */}
      <AmbientAtmosphere />
    </div>
  );
}

// --- Component: Individual Film Frame with Internal Animations ---
function Frame({
  img,
  delay,
  direction,
  onImageClick,
}: {
  img: string;
  delay: number;
  direction: "up" | "down";
  onImageClick?: (src: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: direction === "up" ? [0, -15, 0] : [0, 15, 0]
      }}
      transition={{ 
        opacity: { duration: 2, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }
      }}
      className="relative shrink-0 group cursor-pointer"
      onClick={() => onImageClick?.(img)} // 👈 click handler
    >
      <div className="relative w-[300px] h-[420px] overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* The Image with "Ken Burns" Effect */}
        <motion.img
          src={img}
          alt="Memory"
          animate={{ 
            scale: [1.1, 1.25, 1.1],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full object-cover"
          style={{
            filter: "contrast(1.05) brightness(0.7) saturate(0.9)",
          }}
        />
        
        {/* Frame Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-rose-500/10" />
        
        {/* Film Perforations */}
        <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around py-2 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3 h-4 bg-black rounded-sm" />
          ))}
        </div>
        <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-around py-2 opacity-20">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3 h-4 bg-black rounded-sm" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- Component: Atmospheric Effects ---
function AmbientAtmosphere() {
  return (
    <>
      {/* Moving Warm Light Leak */}
      <motion.div 
        animate={{ 
          x: ['-100%', '100%'],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/10 to-transparent blur-[150px] z-10 pointer-events-none"
      />

      {/* Floating Dust Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "vw", 
              y: Math.random() * 100 + "vh" 
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, 40, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </>
  );
}