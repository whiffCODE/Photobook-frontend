"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Download,
  Heart,
  Crown,
  X,
  Trash2,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Infinity as InfinityIcon,
  Stars
} from "lucide-react";
import confetti from "canvas-confetti";
import MusicPlayer from "@/components/MusicPlayer";
import UploadPanel from "@/components/UploadPanel";

// --- GPU ACCELERATED FLOATING EMOTIONS ---
function FloatingEmotions() {
  const particles = useMemo(() => Array.from({ length: 40 }), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 0.7, 0.4, 0], 
            scale: [0.5, 1.2, 0.8],
            rotate: [0, 180, -180, 0] 
          }}
          transition={{
            duration: 12 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
          className="absolute text-rose-500/20 text-3xl filter blur-[1px] will-change-transform"
        >
          {i % 3 === 0 ? "❤️" : i % 3 === 1 ? "✨" : "💖"}
        </motion.div>
      ))}
    </div>
  );
}

// --- MAGNETIC GLOWING HEART CURSOR ---
function HeartCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 400, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 400, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-12 h-12 bg-rose-600 rounded-full blur-[30px] opacity-40 animate-pulse" />
        <span className="text-3xl drop-shadow-[0_0_15px_rgba(225,29,72,0.9)]">❤️</span>
      </div>
    </motion.div>
  );
}

export default function BirthdayPage() {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const pulseScale = useSpring(1, { stiffness: 400, damping: 10 });

  const triggerAlert = (msg: string, type: "success" | "error" = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/BABA-MAA-ME`);
      setImages(res.data);
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
    const heartBeat = setInterval(() => {
      pulseScale.set(1.1);
      setTimeout(() => pulseScale.set(1), 150);
      confetti({ 
        particleCount: 12, 
        spread: 80, 
        origin: { y: 0.8 }, 
        colors: ["#e11d48", "#fbbf24", "#ffffff"],
        gravity: 0.5
      });
    }, 2500);
    return () => clearInterval(heartBeat);
  }, [pulseScale]);

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Rajanya_Memory_${Date.now()}.jpg`;
      link.click();
      triggerAlert("Saved to your heart! 📥");
    } catch (e) {
      triggerAlert("Download interrupted", "error");
    }
  };

  const handleDelete = async (id: string, publicId: string) => {
    if (!confirm("Are you sure you want to archive this memory? ❤️")) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/delete`, { id, public_id: publicId });
      setImages(images.filter(img => img._id !== id));
      triggerAlert("Memory safely archived 🕊️");
    } catch (err) {
      triggerAlert("Action failed", "error");
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050102] text-rose-50 overflow-x-hidden cursor-none selection:bg-rose-500/30 font-sans">
      <HeartCursor />
      <FloatingEmotions />
      <MusicPlayer src="/music/parents.mp3" />

      {/* --- PREMIUM BACK NAVIGATION --- */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1, x: 10, backgroundColor: "rgba(225, 29, 72, 0.15)" }}
        onClick={() => router.back()}
        className="fixed top-8 left-8 z-[5000] p-4 rounded-2xl border border-rose-500/20 backdrop-blur-xl bg-white/5 flex items-center gap-3 transition-all"
      >
        <ArrowLeft size={20} className="text-rose-400" />
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-rose-200">Return</span>
      </motion.button>

      {/* --- CINEMATIC ALERTS --- */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ y: -100, opacity: 0, scale: 0.9 }} 
            animate={{ y: 40, opacity: 1, scale: 1 }} 
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            className={`fixed top-0 left-1/2 -translate-x-1/2 z-[10000] px-10 py-5 rounded-full border backdrop-blur-2xl flex items-center gap-4 shadow-3xl ${
              alert.type === 'success' ? 'border-rose-500/40 bg-rose-950/40 shadow-rose-900/20' : 'border-red-500/40 bg-red-950/40 shadow-red-900/20'
            }`}
          >
            {alert.type === 'success' ? <CheckCircle2 size={20} className="text-rose-400" /> : <AlertCircle size={20} className="text-red-400" />}
            <span className="text-xs font-bold tracking-widest uppercase">{alert.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BLURRED BACKGROUND SLIDESHOW --- */}
      <motion.div style={{ y: bgY }} className="fixed inset-0 -z-20 opacity-25 filter blur-[10px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 h-[200vh]">
          {images.concat(images).map((img, i) => (
            <div key={i} className="relative w-full h-[600px] rounded-[4rem] overflow-hidden">
              <img src={img.url} className="w-full h-full object-cover grayscale" alt="background" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050102] via-[#050102]/60 to-[#050102]" />
      </motion.div>

      {/* --- HERO SECTION: DIRECTIONAL ENTRANCE --- */}
      <section className="h-screen flex flex-col justify-center items-center text-center relative px-6 overflow-hidden">
        <motion.div 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ type: "spring", delay: 0.5 }}
          className="mb-6"
        >
          <Crown className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]" size={56} />
        </motion.div>

        <div className="relative z-10">
          <motion.h2
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 35, damping: 15 }}
            className="text-4xl md:text-7xl font-serif italic text-rose-200/90 mb-2 leading-tight"
          >
            Happy Birthday
          </motion.h2>

          <motion.h1
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 35, damping: 15, delay: 0.1 }}
            style={{ scale: pulseScale }}
            className="text-7xl md:text-[160px] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-rose-300 to-rose-600 bg-clip-text text-transparent filter drop-shadow-[0_20px_60px_rgba(225,29,72,0.5)]"
          >
            Rajanya ❤️
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-rose-500/40" />
            <Stars className="text-amber-300" size={20} />
            <p className="text-rose-300/40 uppercase tracking-[1em] text-[10px] md:text-sm font-bold">Infinite Love Bond</p>
            <Stars className="text-amber-300" size={20} />
            <div className="h-[1px] w-12 bg-rose-500/40" />
          </div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="text-rose-500/30">
            <InfinityIcon size={40} strokeWidth={1} />
          </motion.div>
        </motion.div>
      </section>

      {/* --- MEMORY GALLERY: DEEP ANIMATED CARDS --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center gap-4 mb-24">
          <Sparkles className="text-rose-400" size={24} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-rose-200/60">The Eternal Memory Vault</h3>
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {images.map((img) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ y: -20, rotateZ: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] transition-all duration-700"
            >
              <img 
                src={img.url} 
                className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-125 cursor-zoom-in"
                onClick={() => setSelected(img.url)}
              />
              
              {/* HIGH-END OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050102] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                <div className="flex flex-col gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload(img.url)}
                    className="w-full bg-white text-black py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] tracking-widest shadow-2xl"
                  >
                    <Download size={18} /> DOWNLOAD PORTRAIT
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
                    onClick={() => handleDelete(img._id, img.public_id)}
                    className="w-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-red-100 py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] tracking-widest transition-colors"
                  >
                    <Trash2 size={18} /> DELETE MEMORY
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FOOTER UPLOADER: COZY GLASS PANEL --- */}
      <section className="mt-32 pb-48 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative p-10 md:p-16 rounded-[4rem] bg-gradient-to-br from-rose-950/20 to-black border border-rose-500/20 backdrop-blur-3xl text-center overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,72,0.1),transparent)]" />
            <UploadCloud className="mx-auto text-rose-500 mb-8 animate-bounce" size={56} />
            <h4 className="text-3xl font-serif italic mb-12 text-rose-100">Add a New Chapter...</h4>
            <UploadPanel onUpload={() => {
              fetchGallery();
              triggerAlert("A new star has been added! ✨");
              confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            }} />
          </motion.div>
        </div>
      </section>

      {/* --- FULLSCREEN CINEMATIC MODAL --- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors"
            >
              <X size={48} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <img src={selected} className="max-h-[75vh] w-auto rounded-[3rem] shadow-[0_0_100px_rgba(225,29,72,0.4)] border border-white/5 object-contain" />
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDownload(selected)}
                className="mt-12 bg-rose-600 px-16 py-6 rounded-full font-black tracking-[0.4em] text-[10px] flex items-center gap-4 shadow-3xl shadow-rose-600/30 border border-rose-400"
              >
                <Download size={20} /> DOWNLOAD ORIGINAL
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-24 text-center border-t border-rose-900/10">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Heart className="mx-auto text-rose-600 mb-8" fill="currentColor" size={32} />
        </motion.div>
        <p className="text-[10px] tracking-[1.5em] text-rose-400/30 uppercase mb-4">Baba • Maa • Rajanya</p>
        <p className="text-[8px] tracking-widest text-rose-500/20 uppercase">Our Heartbeat Forever</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,400&display=swap');
        ::-webkit-scrollbar { display: none; }
        body { background-color: #050102; scroll-behavior: smooth; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .cursor-zoom-in { cursor: zoom-in; }
      `}</style>
    </div>
  );
}