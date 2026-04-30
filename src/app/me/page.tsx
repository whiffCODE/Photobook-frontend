"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useSpring, useScroll, useTransform, useMotionValue } from "framer-motion";
import axios from "axios";
import { 
  Download, Trash2, ArrowLeft, Sparkles, Star, Crown, 
  Heart, Eye, X, Gift, Coffee, Camera, Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

// --- External Components (Ensure these exist in your project) ---
import MusicPlayer from "@/components/MusicPlayer";
import UploadPanel from "@/components/UploadPanel";

const localImages = Array.from({ length: 52 }, (_, i) => `/images/${i + 1}.jpeg`);

// 🖱️ 1. Funky Emoji Glow Cursor with Trail Logic
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999999] hidden md:block"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            rotate: [0, 15, -15, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl filter drop-shadow-[0_0_15px_rgba(251,113,133,0.8)]"
        >
          💖
        </motion.div>
        <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full scale-150 animate-pulse" />
      </div>
    </motion.div>
  );
};

// ✨ 2. Heavy Emotion Particle Engine (Hearts & Sparkles)
const ParticleOrchestra = () => {
  const particles = useMemo(() => Array.from({ length: 40 }), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 0.7, 0], 
            rotate: [0, 360],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`]
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
          className="text-rose-400/30 text-2xl"
        >
          {i % 3 === 0 ? "❤️" : i % 3 === 1 ? "🤍" : "✨"}
        </motion.div>
      ))}
    </div>
  );
};

// 🎞️ 3. Cinematic Background Slideshow (Noir Style)
const CinematicBackground = () => {
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % localImages.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div style={{ y }} className="fixed inset-0 z-0 bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.2, filter: "blur(10px) grayscale(1)" }}
          animate={{ opacity: 0.4, scale: 1, filter: "blur(2px) grayscale(1)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 3 }}
          className="w-full h-full"
        >
          <img src={localImages[index]} className="w-full h-full object-cover" alt="cinema" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-radial-gradient(circle, transparent 20%, black 90%)" />
    </motion.div>
  );
};

export default function MePage() {
  const [apiImages, setApiImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: string } | null>(null);

  const triggerAlert = (msg: string, type: string) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
      if (Array.isArray(res.data)) setApiImages(res.data);
    } catch (err) { console.error("Vault offline..."); }
  };

  useEffect(() => { fetchImages(); }, []);

  const downloadImg = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Rajanya_Special_${Date.now()}.jpg`;
      link.click();
      triggerAlert("Captured Forever! 🤍", "save");
      confetti({ particleCount: 150, spread: 70, colors: ['#fb7185', '#ffffff'] });
    } catch (e) { triggerAlert("Download failed", "error"); }
  };

  const deleteImage = async (img: any) => {
    if (!confirm("Are you sure? This memory will fade... 🥺")) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/delete`, { id: img._id, public_id: img.public_id });
      triggerAlert("A memory was removed... 🕊️", "delete");
      fetchImages();
    } catch (err) { triggerAlert("Could not delete", "error"); }
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-rose-500/50 cursor-none overflow-x-hidden font-sans">
      <CustomCursor />
      <CinematicBackground />
      <ParticleOrchestra />

      {/* --- Notification Toast --- */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ y: -100, opacity: 0, x: "-50%" }} 
            animate={{ y: 50, opacity: 1, x: "-50%" }} 
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-0 left-1/2 z-[1000000] px-10 py-5 rounded-2xl border backdrop-blur-3xl shadow-[0_0_50px_rgba(251,113,133,0.2)] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em]
              ${alert.type === 'delete' ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-white/5 border-white/20 text-rose-100'}`}
          >
            <div className="animate-beat"><Sparkles size={18} className="text-rose-500" /></div>
            {alert.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-40">
        <MusicPlayer src="/music/me.mp3" />

        <nav className="p-8 flex justify-between items-center">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1, x: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <ArrowLeft size={16} /> Return
            </motion.button>
          </Link>
          <motion.div 
            animate={{ y: [0, -5, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 text-rose-500 font-black text-[10px] tracking-widest"
          >
            LIVE MOMENTS <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
          </motion.div>
        </nav>

        {/* --- Hero Header --- */}
        <header className="flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 15 }}
            className="mb-12 relative"
          >
            <Crown className="text-rose-500 drop-shadow-[0_0_40px_#fb7185]" size={120} />
            <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute inset-0 bg-rose-500 rounded-full blur-[60px] -z-10" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[13rem] font-black tracking-tighter leading-[0.85] mb-10"
          >
            HAPPY BIRTHDAY <br />
            <span className="bg-gradient-to-r from-rose-500 via-white to-rose-500 bg-clip-text text-transparent italic px-4">RAJANYA ❤️</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="flex items-center gap-6 text-white/40 uppercase tracking-[1.2em] text-[9px] font-bold"
          >
            <Coffee size={14} /> Soulmate & Friend <Coffee size={14} />
          </motion.div>
        </header>

        {/* --- Premium Upload Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-6 mb-56"
        >
          <div className="group relative p-[2px] rounded-[4rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-white/20 to-rose-500 animate-spin-slow opacity-50" />
            <div className="relative bg-black/80 backdrop-blur-3xl p-16 rounded-[4rem] text-center border border-white/10">
               <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="mb-8 inline-block p-6 bg-rose-500/10 rounded-3xl border border-rose-500/20">
                  <Gift size={50} className="text-rose-500 animate-beat" />
               </motion.div>
               <h2 className="text-xl font-black uppercase tracking-[0.6em] mb-10">Seal a New Memory</h2>
               <UploadPanel onUpload={() => { fetchImages(); triggerAlert("Locked in the Vault! ✨", "success"); }} />
            </div>
          </div>
        </motion.div>

        {/* --- The Memory Gallery --- */}
        <section className="max-w-[1400px] mx-auto px-8 pb-60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {localImages.map((img, i) => (
              <GalleryCard key={`local-${i}`} img={img} index={i} onDownload={downloadImg} onSelect={setSelected} />
            ))}
            {apiImages.map((img, i) => (
              <GalleryCard 
                key={img._id} 
                img={img.url} 
                index={i + localImages.length} 
                onDownload={downloadImg} 
                onSelect={setSelected} 
                isCloud 
                onDelete={() => deleteImage(img)} 
              />
            ))}
          </div>
        </section>
      </div>

      {/* --- Immersive Zoom Lightbox --- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.button 
              whileHover={{ rotate: 90, scale: 1.2 }}
              className="absolute top-10 right-10 p-6 bg-white/5 border border-white/10 rounded-full text-white z-50"
              onClick={() => setSelected(null)}
            >
              <X size={40} />
            </motion.button>

            <motion.div 
              initial={{ scale: 0.8, y: 100, rotate: 5 }} 
              animate={{ scale: 1, y: 0, rotate: 0 }} 
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-5xl w-full flex flex-col items-center gap-12"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative group cursor-zoom-out" onClick={() => setSelected(null)}>
                 <img src={selected} className="max-h-[70vh] rounded-[3rem] shadow-[0_0_120px_rgba(251,113,133,0.4)] border border-white/10 object-contain" alt="Zoom" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
              </div>

              <div className="flex gap-6">
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadImg(selected)}
                  className="px-16 py-6 bg-rose-500 text-white rounded-full font-black text-xs uppercase tracking-[0.5em] flex items-center gap-4 shadow-2xl shadow-rose-500/20"
                >
                  <Download size={22} /> Hold This Moment
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-40 text-center border-t border-white/5 mx-20 md:mx-60">
          <div className="flex justify-center gap-8 mb-10 opacity-30 animate-pulse">
            <Heart size={20} /> <Star size={20} /> <Sparkles size={20} />
          </div>
          <p className="text-[10px] uppercase tracking-[2.5em] opacity-20">Rajanya x Infinity • 2026</p>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-beat { animation: heartBeat 1.2s infinite cubic-bezier(0.4, 0, 0.6, 1); }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.2); filter: brightness(1.3) drop-shadow(0 0 10px #fb7185); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #fb7185; border-radius: 10px; }
        body { overscroll-behavior: none; }
      `}</style>
    </div>
  );
}

// 🖼️ 4. Heavy Animated Card Component
const GalleryCard = ({ img, index, onDownload, onSelect, isCloud, onDelete }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: (index % 4) * 0.15,
        type: "spring",
        stiffness: 50
      }}
      whileHover={{ y: -30, rotate: index % 2 === 0 ? 2 : -2 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-white/5 border border-white/5 shadow-2xl"
    >
      <motion.img 
        src={img} 
        className="w-full h-full object-cover grayscale brightness-50 transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-125 group-hover:brightness-110" 
      />
      
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
        <div className="flex flex-col gap-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-700 delay-100">
          
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "white", color: "black" }}
            onClick={(e) => { e.stopPropagation(); onSelect(img); }}
            className="w-full py-5 bg-white/10 backdrop-blur-2xl text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-white/10 shadow-2xl"
          >
            <Eye size={20} /> Immerse Moment
          </motion.button>
          
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#fb7185" }}
              onClick={(e) => { e.stopPropagation(); onDownload(img); }}
              className="flex-1 py-5 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              <Download size={18} /> Save
            </motion.button>
            
            {isCloud && (
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-5 bg-red-500/20 backdrop-blur-xl text-red-400 rounded-2xl border border-red-500/30 shadow-lg"
              >
                <Trash2 size={22} />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-150">
        <Heart className="text-rose-500 fill-rose-500 animate-beat" size={32} />
      </div>
    </motion.div>
  );
};