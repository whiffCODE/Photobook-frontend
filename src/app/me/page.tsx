"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import axios from "axios";
import { Download, Trash2, ArrowLeft, Sparkles, Star, Crown, Heart, Zap, Camera } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

// Shared Components
import MusicPlayer from "@/components/MusicPlayer";
import UploadPanel from "@/components/UploadPanel";

const localImages = Array.from({ length: 52 }, (_, i) => `/images/${i + 1}.jpeg`);

// 🌸 Custom Animated Glow Cursor
const CustomCursor = () => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:block"
      style={{ x: mouseX, y: mouseY }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <span className="text-3xl drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">❤️</span>
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-rose-500 rounded-full blur-2xl"
        />
      </div>
    </motion.div>
  );
};

// ✨ Floating Heart & Star Particles (GPU Optimized)
const FloatingParticles = () => {
  const particles = useMemo(() => Array.from({ length: 30 }), []);
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ 
            y: "-10vh", 
            opacity: [0, 0.8, 0], 
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.5] 
          }}
          transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="text-rose-500/30 text-2xl"
        >
          {i % 2 === 0 ? "❤️" : "✨"}
        </motion.div>
      ))}
    </div>
  );
};

// 🎞️ Cinematic Background Slideshow
const BackgroundSlideshow = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((p) => (p + 1) % localImages.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050102]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.15, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <img src={localImages[index]} className="w-full h-full object-cover filter blur-[6px]" alt="bg" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
    </div>
  );
};

export default function MePage() {
  const [apiImages, setApiImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ msg: string; type: 'success' | 'delete' | 'save' } | null>(null);

  const triggerAlert = (msg: string, type: any) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery`);
      if (Array.isArray(res.data)) setApiImages(res.data);
    } catch (err) { console.error("Cloud storage offline..."); }
  };

  useEffect(() => { fetchImages(); }, []);

  const downloadImg = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Rajanya_Memory_${Date.now()}.jpg`;
    link.click();
    triggerAlert("Memory Saved Forever! ❤️", "save");
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#fb7185', '#e11d48', '#ffffff'] });
  };

  const deleteImage = async (img: any) => {
    if (!confirm("Are you sure you want to discard this memory? 🥺")) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/delete`, { id: img._id, public_id: img.public_id });
      triggerAlert("Memory hidden away... 🕊️", "delete");
      fetchImages();
    } catch (err) { triggerAlert("Couldn't delete memory ❌", "delete"); }
  };

  return (
    <div className="relative min-h-screen bg-[#050102] text-rose-50 overflow-x-hidden cursor-none selection:bg-rose-500/50">
      <CustomCursor />
      <BackgroundSlideshow />
      <FloatingParticles />

      {/* --- Premium Alerts --- */}
      <AnimatePresence>
        {alert && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -100, opacity: 0 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100001] px-8 py-4 rounded-full border backdrop-blur-2xl shadow-2xl flex items-center gap-3
              ${alert.type === 'delete' ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-rose-500/20 border-rose-500/50 text-rose-200'}`}
          >
            <Sparkles size={18} /> {alert.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30">
        <MusicPlayer src="/music/me.mp3" />

        <nav className="p-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1, x: 10, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-xs font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft size={16} /> Home
            </motion.button>
          </Link>
        </nav>

        {/* --- Hero Header with Split Entrance --- */}
        <header className="flex flex-col items-center justify-center py-20 px-4 text-center overflow-hidden">
          <motion.div 
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, type: "spring" }}
          >
            <Crown className="text-rose-400 mb-8 drop-shadow-[0_0_20px_rgba(251,113,133,0.6)]" size={64} />
          </motion.div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-4">
            <motion.h1 
              initial={{ x: 800, opacity: 0 }} animate={{ x: 0, opacity: 1 }} 
              transition={{ type: "spring", damping: 25, stiffness: 60 }}
              className="text-6xl md:text-9xl font-black italic text-white drop-shadow-2xl"
            >
              Happy Birthday
            </motion.h1>
            <motion.h1 
              initial={{ x: -800, opacity: 0 }} animate={{ x: 0, opacity: 1 }} 
              transition={{ type: "spring", damping: 25, stiffness: 60, delay: 0.2 }}
              className="text-6xl md:text-9xl font-black italic bg-gradient-to-r from-rose-300 via-pink-500 to-rose-600 bg-clip-text text-transparent drop-shadow-2xl"
            >
              Rajanya ❤️
            </motion.h1>
          </div>

          <motion.p 
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 5 }}
            className="mt-8 text-rose-300/60 uppercase tracking-[1.2em] text-[10px] md:text-sm"
          >
            The Most Beautiful Chapter of My Life
          </motion.p>
        </header>

        {/* --- Card Section: UploadPanel --- */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 mb-40"
        >
          <div className="relative group p-[1px] bg-gradient-to-tr from-rose-600 via-white/20 to-pink-600 rounded-[3rem] shadow-[0_0_80px_rgba(244,63,94,0.15)]">
            <div className="bg-black/80 backdrop-blur-[50px] p-10 rounded-[3rem] border border-white/5 group-hover:bg-black/60 transition-all duration-700">
              <UploadPanel onUpload={() => { fetchImages(); triggerAlert("Memory Uploaded! ✨", "save"); }} />
            </div>
          </div>
        </motion.div>

        {/* --- Beat-Sync Gallery --- */}
        <section className="max-w-7xl mx-auto px-6 pb-40">
          <div className="flex items-center gap-6 mb-20">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
            <h2 className="text-4xl font-serif italic text-rose-100 flex items-center gap-4">
              <Sparkles className="text-rose-400 animate-pulse" /> Captured Soul <Star className="text-rose-400 fill-rose-400 animate-bounce" />
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {localImages.map((img, i) => (
              <GalleryCard key={i} img={img} index={i} onDownload={downloadImg} onSelect={setSelected} />
            ))}
          </div>

          {apiImages.length > 0 && (
            <>
               <div className="flex items-center gap-6 my-24">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
                <h2 className="text-4xl font-serif italic text-pink-100 flex items-center gap-4"> <Camera size={24}/> Eternal Vault</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                {apiImages.map((img, i) => (
                  <GalleryCard key={img._id} img={img.url} index={i} onDownload={downloadImg} onSelect={setSelected} isCloud onDelete={() => deleteImage(img)} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* --- Fullscreen Viewer --- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100, rotate: -5 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-5xl w-full flex justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img src={selected} className="max-h-[80vh] w-auto rounded-[3rem] shadow-[0_0_120px_rgba(244,63,94,0.4)] border border-white/20" alt="View" />
              <motion.button 
                whileHover={{ scale: 1.2, rotate: 90 }}
                className="absolute -top-12 -right-4 text-white/50 hover:text-white"
                onClick={() => setSelected(null)}
              >
                <Zap size={40} />
              </motion.button>
            </motion.div>
            
            <motion.div className="mt-12 flex gap-8" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={e => e.stopPropagation()}>
               <motion.button 
                whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(225,29,72,0.6)" }} whileTap={{ scale: 0.9 }}
                onClick={() => downloadImg(selected)}
                className="px-16 py-5 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full font-black text-white shadow-2xl flex items-center gap-4 uppercase tracking-widest text-sm"
               >
                 <Download size={20} /> Keep Forever ❤️
               </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050102; }
        ::-webkit-scrollbar-thumb { background: #e11d48; border-radius: 10px; }
        body { overscroll-behavior: none; }
      `}</style>
    </div>
  );
}

const GalleryCard = ({ img, index, onDownload, onSelect, isCloud, onDelete }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 4, delay: index * 0.2 }}
      whileHover={{ y: -20, scale: 1.05 }}
      className="relative group aspect-[3/4] rounded-[2.5rem] overflow-hidden cursor-zoom-in border border-white/10 bg-white/5 shadow-2xl"
      onClick={() => onSelect(img)}
    >
      <img src={img} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-125" alt="Moment" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 gap-3">
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onDownload(img); }}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase"
        >
          <Download size={16} /> Save This
        </motion.button>
        {isCloud && (
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="flex items-center justify-center gap-3 w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase"
          >
            <Trash2 size={16} /> Discard
          </motion.button>
        )}
      </div>
      <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] pointer-events-none group-hover:border-rose-500/50 transition-colors" />
    </motion.div>
  );
};