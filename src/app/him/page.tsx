"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useInView } from "framer-motion";
import MusicPlayer from "@/components/MusicPlayer";
import PasswordGate from "@/components/PasswordGate";
import Timeline from "@/components/Timeline";
import LoveLetter from "@/components/LoveLetter";
import Link from "next/link";
import { ArrowLeft, Download, Maximize2, X, Heart, Sparkles, Star, Camera, MousePointer2 } from "lucide-react";

// --- Types ---
interface MemoryImage {
  _id: string;
  url: string;
}

export default function HimPage() {
  const [images, setImages] = useState<MemoryImage[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // 1. Data Fetching & Mouse Tracking
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/HIM`);
        setImages(res.data);
      } catch (err) {
        console.error("Gallery sync failed", err);
      }
    };
    fetchGallery();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 2. Cinematic Slideshow Logic
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // 3. Performance-Optimized Particle Memoization
  const particles = useMemo(() => [...Array(35)], []);

  // 4. Enhanced Download Handler
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Rajanya_Love_Memory_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Could not download the memory right now.");
    }
  };

  return (
    <PasswordGate>
      <div className="relative min-h-screen bg-[#0a0205] text-white overflow-x-hidden cursor-none selection:bg-rose-500/40">
        
        {/* ❤️ CUSTOM BEAT-SYNC CURSOR */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center pointer-events-none"
          animate={{ 
            x: mousePos.x - 20, 
            y: mousePos.y - 20,
            scale: [1, 1.3, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            x: { type: "spring", damping: 25, stiffness: 250, mass: 0.5 },
            y: { type: "spring", damping: 25, stiffness: 250, mass: 0.5 },
            scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="relative">
            <span className="text-3xl drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">❤️</span>
            <motion.div 
               animate={{ scale: [1, 2], opacity: [0.5, 0] }}
               transition={{ duration: 1, repeat: Infinity }}
               className="absolute inset-0 bg-rose-500 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* 🎬 DYNAMIC PARALLAX BACKGROUND */}
        <motion.div style={{ y: backgroundY }} className="fixed inset-0 z-0">
          <AnimatePresence mode="wait">
            {images.length > 0 && (
              <motion.div
                key={bgIndex}
                initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                animate={{ opacity: 0.35, scale: 1, filter: "blur(4px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 3, ease: "circOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${images[bgIndex]?.url})` }}
              />
            )}
          </AnimatePresence>
          {/* Luxury Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0205] via-transparent to-[#0a0205]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0205]/80 via-transparent to-[#0a0205]/80" />
        </motion.div>

        {/* ✨ FLOATING HEART PARTICLES */}
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {particles.map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400/30"
              initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
              animate={{ 
                y: "-10vh", 
                x: [`${Math.random() * 100}vw`, `${Math.random() * 105}vw`],
                rotate: [0, 360],
                opacity: [0, 0.8, 0],
              }}
              transition={{ 
                duration: 12 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 20
              }}
            >
              {i % 2 === 0 ? <Heart size={12 + Math.random() * 20} fill="currentColor" /> : <Sparkles size={15} />}
            </motion.div>
          ))}
        </div>

        {/* 📜 PROGRESS INDICATOR */}
        <motion.div className="fixed top-0 left-0 right-0 h-1 z-[1000] bg-gradient-to-r from-rose-600 via-amber-400 to-rose-600" style={{ scaleX }} />

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-20">
          <MusicPlayer src="/music/him.mp3" />

          {/* 🔙 NAVIGATION */}
          <nav className="p-6 md:p-12 flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-rose-500/50 transition-all">
                <ArrowLeft size={18} className="text-rose-500 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] tracking-widest font-bold uppercase">Back Home</span>
              </Link>
            </motion.div>
          </nav>

          {/* ❤️ HERO SECTION */}
          <header className="container mx-auto px-6 pt-10 pb-32 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div className="flex justify-center items-center gap-4 mb-10">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-amber-400" size={28} />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  <Heart className="text-rose-600 fill-rose-600" size={48} />
                </motion.div>
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="text-amber-400" size={28} />
                </motion.div>
              </div>

              <h1 className="text-sm md:text-lg font-bold tracking-[0.6em] text-rose-300 uppercase mb-8">
                Happy Birthday My Forever Life-Partner
              </h1>

              <h2 className="text-6xl md:text-[10rem] font-serif italic font-black leading-none mb-12">
                Rajanya <br />
                <span className="bg-gradient-to-r from-rose-100 via-rose-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(225,29,72,0.5)]">
                  The One ❤️
                </span>
              </h2>

              <p className="max-w-3xl mx-auto text-xl md:text-3xl font-light italic text-rose-100/70 leading-relaxed">
                "Our story is a masterpiece written in the language of heartbeats. Every second with you is a cinematic dream."
              </p>
            </motion.div>
          </header>

          {/* 🕰️ TIMELINE */}
          <section className="py-24 bg-white/[0.02] backdrop-blur-sm border-y border-white/5">
            <div className="max-w-6xl mx-auto px-6">
               <Timeline />
            </div>
          </section>

          {/* 🖼️ GALLERY GRID */}
          <section className="container mx-auto px-6 py-40">
            <div className="flex flex-col items-center mb-24">
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: 100 }}
                className="w-px bg-gradient-to-b from-transparent via-rose-500 to-transparent mb-10" 
              />
              <h3 className="text-5xl md:text-8xl font-serif italic mb-4">Gallery of Us</h3>
              <p className="text-rose-400/60 tracking-[0.3em] uppercase text-xs">Captured Emotions • Click to Zoom</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {images.map((img, idx) => (
                <GalleryCard 
                  key={img._id} 
                  img={img} 
                  index={idx} 
                  onZoom={() => setSelected(img.url)} 
                  onDownload={() => handleDownload(img.url)}
                />
              ))}
            </div>
          </section>

          {/* 💌 LOVE LETTER */}
          <section className="py-20">
            <LoveLetter />
          </section>

          {/* FOOTER */}
          <footer className="py-32 text-center">
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 0.4 }}
               className="flex flex-col items-center gap-6"
            >
              <div className="flex gap-4">
                <Heart size={16} className="text-rose-500" />
                <Star size={16} className="text-amber-500" />
                <Heart size={16} className="text-rose-500" />
              </div>
              <p className="text-[10px] tracking-[1em] uppercase font-black">
                Inifinity & Beyond • Subhadip
              </p>
            </motion.div>
          </footer>
        </div>

        {/* 🔍 MODAL ZOOM */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/98 backdrop-blur-2xl flex flex-col justify-center items-center z-[10000] p-4"
              onClick={() => setSelected(null)}
            >
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.1 }}
                className="absolute top-10 right-10 text-white/50 hover:text-rose-500 transition-colors"
              >
                <X size={48} />
              </motion.button>

              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selected}
                  className="max-h-[80vh] w-auto rounded-3xl shadow-[0_0_80px_rgba(244,63,94,0.4)] border border-white/10"
                  alt="Full view"
                />
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#f43f5e", color: "#fff" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(selected)}
                  className="mt-10 flex items-center gap-4 bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all"
                >
                  <Download size={22} />
                  Download Memory
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&family=Plus+Jakarta+Sans:wght@300;400;700;800&display=swap');
          
          body { background: #0a0205; cursor: none !important; }
          .font-serif { font-family: 'Playfair Display', serif; }
          .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0a0205; }
          ::-webkit-scrollbar-thumb { 
            background: linear-gradient(to bottom, #e11d48, #fbbf24); 
            border-radius: 20px; 
          }
        `}</style>
      </div>
    </PasswordGate>
  );
}

// --- Subcomponent for Performance ---
function GalleryCard({ img, index, onZoom, onDownload }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      whileHover={{ y: -20, scale: 1.03 }}
      className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
    >
      <img
        src={img.url}
        className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        alt="Memory"
        loading="lazy"
      />
      
      {/* Overlay with high-end glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
        <div className="flex gap-4 justify-center items-center translate-y-10 group-hover:translate-y-0 transition-all duration-700">
          <motion.button 
            whileHover={{ scale: 1.2, backgroundColor: "#f43f5e" }}
            onClick={onZoom}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white"
          >
            <Maximize2 size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.2, backgroundColor: "#fff", color: "#000" }}
            onClick={onDownload}
            className="p-4 bg-rose-600 rounded-full text-white shadow-lg"
          >
            <Download size={20} />
          </motion.button>
        </div>
      </div>

      {/* Decorative Heart Tag */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
          <Heart size={14} className="text-rose-400 fill-rose-400" />
        </div>
      </div>
    </motion.div>
  );
}