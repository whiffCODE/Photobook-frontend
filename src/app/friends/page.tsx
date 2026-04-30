"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Download, ChevronLeft, Heart, Sparkles, Star, X, Maximize2, Scissors, Film, Zap } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import MusicPlayer from "@/components/MusicPlayer";

export default function FriendsPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothY = useSpring(scrollYProgress, { stiffness: 30, damping: 20 });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/FRIENDS`)
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Gallery Error:", err));

    // Perpetual Cinematic Love Rain
    const loveRain = setInterval(() => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#ff0000", "#ffffff"],
        ticks: 100
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#ff0000", "#ffffff"],
        ticks: 100
      });
    }, 1500);

    return () => clearInterval(loveRain);
  }, []);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Rajanya_Memory_2026.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Archive failure", err);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#020202] text-white selection:bg-rose-600/40 overflow-x-hidden cursor-none">
      <style jsx global>{`
        @keyframes vhs-flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        .vhs-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), 
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 3px 100%; pointer-events: none; z-index: 100; animation: vhs-flicker 0.1s infinite;
        }
        .text-glow { text-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(225,29,72,0.2); }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.2); }
        }
        .animate-heartbeat { animation: heartbeat 1.5s infinite ease-in-out; }
      `}</style>

      <div className="vhs-overlay" />
      <FunkyGlowCursor />
      <MusicPlayer src="/music/friends.mp3" />

      {/* BACKGROUND MEMORY DRIFT */}
      <div className="fixed inset-0 -z-40 opacity-20 grayscale pointer-events-none">
        <motion.div 
          style={{ y: useTransform(smoothY, [0, 1], [0, -1500]) }}
          className="flex flex-wrap w-[220vw] gap-12 p-20"
        >
          {images.concat(images).slice(0, 15).map((img, i) => (
            <motion.img 
              key={i}
              animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 10 + i, repeat: Infinity }}
              src={img.url} 
              className="w-[40vw] md:w-[20vw] h-[30vh] md:h-[50vh] object-cover rounded-[4rem] blur-[2px]"
            />
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]" />
      </div>

      {/* NAV - GLASSMORPHISM */}
      <nav className="fixed top-0 w-full p-6 md:p-12 flex justify-between items-center z-[150]">
        <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="bg-white/5 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-full flex items-center gap-3 group">
            <ChevronLeft size={18} className="text-rose-500 group-hover:-translate-x-2 transition-transform" />
            <span className="text-[10px] tracking-[0.5em] uppercase font-black">Escape Memory</span>
          </Link>
        </motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 360] }} 
          transition={{ repeat: Infinity, duration: 4 }}
          className="bg-rose-500/10 p-4 rounded-full border border-rose-500/20 text-rose-500"
        >
          <Heart fill="currentColor" size={20} />
        </motion.div>
      </nav>

      {/* HERO - BEAT-SYNCED TITLE */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div
          style={{ 
            opacity: useTransform(smoothY, [0, 0.3], [1, 0]), 
            scale: useTransform(smoothY, [0, 0.3], [1, 0.85]),
            y: useTransform(smoothY, [0, 0.3], [0, -100])
          }}
          className="z-10"
        >
          <motion.div 
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "1.2em", opacity: 1 }}
            className="flex items-center gap-4 text-white/40 mb-8 text-[10px] font-black uppercase"
          >
            <Scissors size={14} className="text-rose-500" /> SCENE: INFINITY <Scissors size={14} className="text-rose-500" />
          </motion.div>

          <h1 className="text-6xl md:text-[12rem] font-black leading-[0.8] mb-12 tracking-tighter">
            <span className="block text-white text-glow">HAPPY BDAY</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-white to-rose-600 italic animate-heartbeat">RAJANYA ❤️</span>
          </h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium tracking-widest uppercase italic leading-relaxed"
          >
            "A cosmic connection that defies the gravity of time."
          </motion.p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 opacity-20"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-rose-500 to-transparent" />
        </motion.div>
      </section>

      {/* 3D INTERACTIVE GALLERY */}
      <main className="max-w-[1600px] mx-auto px-8 md:px-20 py-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
          {images.map((img, index) => (
            <FriendCard3D key={img._id || index} img={img} index={index} onSelect={() => setSelected(img.url)} />
          ))}
        </div>
      </main>

      {/* CINEMATIC LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-[50px] flex flex-col items-center justify-center p-4"
          >
            <motion.button 
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={() => setSelected(null)}
              className="absolute top-10 right-10 text-white/30 hover:text-rose-500 transition-colors"
            >
              <X size={48} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.7, rotateX: 20, y: 100 }}
              animate={{ scale: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative w-full max-w-5xl shadow-[0_0_100px_rgba(255,0,0,0.15)] rounded-[3rem] overflow-hidden"
            >
              <img src={selected} className="w-full h-auto max-h-[75vh] object-contain" alt="Memory" />
              
              <div className="flex flex-wrap justify-center gap-6 py-12 bg-black/50 backdrop-blur-md">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(selected)}
                  className="bg-white/10 border border-white/20 px-12 py-5 rounded-full font-black text-[10px] tracking-[0.4em] flex items-center gap-3 transition-all"
                >
                  <Download size={20} /> ARCHIVE TO DEVICE
                </motion.button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-12 py-5 rounded-full text-[10px] tracking-[0.4em] font-black border border-white/10 hover:bg-rose-950/40 transition-all"
                >
                  RETURN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-60 text-center relative z-10 flex flex-col items-center gap-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
           <Star className="text-rose-600 blur-[1px]" size={40} fill="currentColor" />
        </motion.div>
        <p className="text-[10px] tracking-[2.5em] text-white/10 uppercase font-black pl-[2.5em]">
          ETERNAL CHAPTER • 2026
        </p>
      </footer>
    </div>
  );
}

function FriendCard3D({ img, index, onSelect }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 200, damping: 25 });

  function handleMouse(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: index * 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onSelect}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative aspect-[4/5] rounded-[4rem] overflow-hidden cursor-none border border-white/5 bg-zinc-900/50"
    >
      <motion.img 
        src={img.url} 
        className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-110 transition-all duration-1000" 
      />
      
      {/* Floating Particles on Card Hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -200], x: [0, (i % 2 === 0 ? 40 : -40)], opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ repeat: Infinity, duration: 2 + Math.random(), delay: i * 0.2 }}
            className="absolute bottom-0 text-rose-500/60"
            style={{ left: `${12 * i}%` }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="absolute bottom-10 left-10" style={{ transform: "translateZ(60px)" }}>
        <div className="flex items-center gap-3 mb-3">
            <Zap className="text-rose-500" size={14} fill="currentColor" />
            <span className="text-rose-500 text-[9px] font-black tracking-widest uppercase">Memory Frame</span>
        </div>
        <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-2xl">Soul Scene {index + 1}</h3>
        <div className="flex items-center gap-2 mt-4 text-white/30 text-[9px] font-bold tracking-[0.3em]">
            <Maximize2 size={12} /> TAP TO RECALL
        </div>
      </div>
    </motion.div>
  );
}

function FunkyGlowCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      className="fixed top-0 left-0 z-[2000] pointer-events-none hidden md:block"
    >
      <div className="relative flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute w-16 h-16 bg-rose-600 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute w-20 h-20 border border-white/20 rounded-full border-dashed" 
        />
        <span className="text-3xl filter drop-shadow-[0_0_10px_white]">🤘</span>
        
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], y: [-10, -40] }}
            transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
            className="absolute text-white/40 text-xs"
          >
            ✨
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}