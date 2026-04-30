"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Heart, ArrowLeft, Wand2, Sparkles, Camera } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import MusicPlayer from "@/components/MusicPlayer";
import UploadPanel from "@/components/UploadPanel";

/* ---------------- Cinematic Toast ---------------- */
function Toast({ message, show, onUndo }: any) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[1000] 
                     bg-white/10 backdrop-blur-2xl border border-white/20 
                     px-6 py-3 rounded-full text-white shadow-2xl flex items-center gap-4"
        >
          <Sparkles className="text-yellow-400 animate-pulse" size={18} />
          <span className="text-xs tracking-widest uppercase font-bold">{message}</span>
          {onUndo && (
            <button onClick={onUndo} className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-black hover:bg-pink-500 hover:text-white transition-colors">
              UNDO
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Floating Hearts & Particles ---------------- */
const ParticleOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0, scale: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1.2, 0.8],
            rotate: [0, 45, -45, 0]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "easeInOut"
          }}
          className="absolute text-red-600/30"
        >
          {i % 2 === 0 ? "❤️" : "✨"}
        </motion.div>
      ))}
    </div>
  );
};

export default function RajanyaPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [lastDeleted, setLastDeleted] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* ---------- Magic Cursor Tracking ---------- */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const fetchImages = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/DIDA-DADU`);
    const sorted = res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setImages(sorted);
  };

  useEffect(() => {
    fetchImages();
    const fav = localStorage.getItem("favorites");
    if (fav) setFavorites(JSON.parse(fav));

    const beatInterval = setInterval(() => {
      confetti({ particleCount: 2, spread: 50, colors: ["#ff0000", "#ffffff"], origin: { y: 0.8 } });
    }, 2500);
    return () => clearInterval(beatInterval);
  }, []);

  const toggleFavorite = (url: string) => {
    const updated = favorites.includes(url) ? favorites.filter((f) => f !== url) : [...favorites, url];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const deleteImage = (img: any) => {
    setLastDeleted(img);
    setImages((prev) => prev.filter((i) => i._id !== img._id));
    setToast({ show: true, message: "Memory archived 🖤" });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  const handleDownload = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "rajanya-birthday-memory.jpg";
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white cursor-none overflow-x-hidden">
      
      {/* 1. MAGIC CURSOR */}
      <motion.div 
        className="fixed top-0 left-0 z-[9999] pointer-events-none text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
      >
        <Wand2 size={24} />
      </motion.div>

      {/* 2. BACKGROUND ELEMENTS */}
      <ParticleOverlay />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none z-0" />
      <MusicPlayer src="/music/grandparents.mp3" />

      {/* 3. NAVIGATION */}
      <nav className="relative z-50 p-6 flex justify-between items-center">
        <Link href="/">
          <motion.div 
            whileHover={{ scale: 1.1, x: -5 }} 
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} /> Back
          </motion.div>
        </Link>
      </nav>

      {/* 4. CINEMATIC HERO SECTION */}
      <header className="relative z-10 pt-10 pb-20 px-6 text-center overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <motion.h2 
            initial={{ x: 1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.3 }}
            className="text-4xl md:text-7xl font-serif italic text-white/80"
          >
            Happy Birthday
          </motion.h2>
          <motion.h1 
            initial={{ x: -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 0.2 }}
            className="text-5xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent"
          >
            Rajanya <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">❤️</span>
          </motion.h1>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 text-gray-500 tracking-[0.5em] text-[10px] uppercase font-bold"
        >
          Cinematic Vintage Collection • Established 1990s
        </motion.p>
      </header>

      {/* 5. GALLERY GRID */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {images.map((img, idx) => (
              <motion.div
                key={img._id}
                layout
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, rotate: idx % 2 === 0 ? 1 : -1 }}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-[2rem] shadow-2xl transition-all"
              >
                <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/5] bg-gray-900">
                  <motion.img
                    src={img.url}
                    onClick={() => setSelected(img.url)}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 cursor-zoom-in"
                    whileHover={{ scale: 1.1 }}
                  />
                  
                  {/* Image UI Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <motion.button 
                        whileHover={{ scale: 1.2 }}
                        onClick={() => toggleFavorite(img.url)}
                        className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/20"
                      >
                        <Heart size={20} fill={favorites.includes(img.url) ? "red" : "none"} color={favorites.includes(img.url) ? "red" : "white"} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.2, backgroundColor: "#ef4444" }}
                        onClick={() => deleteImage(img)}
                        className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/20"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                    <motion.div className="text-center">
                      <p className="text-[10px] tracking-[0.3em] font-black uppercase text-white/70">Memory Piece</p>
                      <h3 className="text-sm font-serif italic">Grandparental Love</h3>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* 6. ZOOM MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.7, rotateX: 45, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-5xl w-full flex flex-col items-center gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selected} className="max-h-[70vh] w-auto rounded-xl shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10" />
              
              <div className="flex flex-wrap justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDownload(selected)}
                  className="bg-white/10 border border-white/20 px-10 py-4 rounded-full font-black tracking-widest flex items-center gap-3"
                >
                  <Download size={20} /> DOWNLOAD MEMORY
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelected(null)}
                  className="bg-red-600 px-10 py-4 rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. FLOATING UPLOADER DOCK */}
      <footer className="fixed bottom-0 left-0 w-full z-50 p-6 pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <motion.div 
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", delay: 0.5 }}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center"
          >
            <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
              <Camera size={12} /> Add to the story
            </div>
            <UploadPanel
              onUpload={() => {
                fetchImages();
                setToast({ show: true, message: "A new memory is born 🎞️" });
                setTimeout(() => setToast({ show: false, message: "" }), 3000);
              }}
            />
          </motion.div>
        </div>
      </footer>

      {/* 8. TOAST SYSTEM */}
      <Toast
        message={toast.message}
        show={toast.show}
        onUndo={lastDeleted ? () => { setImages(p => [lastDeleted, ...p]); setLastDeleted(null); } : null}
      />

      {/* 9. GLOBAL STYLES FOR THEME */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap');
        
        body { background-color: #000; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #ff0000; }

        .cursor-none * {
          cursor: none !important;
        }

        @keyframes grain {
          0%, 100% { transform:translate(0, 0) }
          10% { transform:translate(-5%, -10%) }
          30% { transform:translate(3%, -15%) }
          50% { transform:translate(12%, 9%) }
          70% { transform:translate(9%, 4%) }
          90% { transform:translate(-1%, 7%) }
        }

        .grain-effect::after {
          content: "";
          position: fixed;
          top: -200%;
          left: -200%;
          width: 400%;
          height: 400%;
          background-image: url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_filmgrain.png");
          opacity: 0.03;
          z-index: 100;
          pointer-events: none;
          animation: grain 8s steps(10) infinite;
        }
      `}</style>
    </div>
  );
}