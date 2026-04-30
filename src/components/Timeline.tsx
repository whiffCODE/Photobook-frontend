"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Calendar, Star, Download, Maximize2, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const timelineMeta = [
  {
    title: "The Universe Aligned 💫",
    date: "2025",
    desc: "The day the stars whispered your name to mine. Every atom in me recognized you.",
    icon: <Sparkles className="text-amber-300" size={20} />,
  },
  {
    title: "A Moment Frozen 📸",
    date: "2026",
    desc: "Our first memory together. A second that turned into an eternity of love.",
    icon: <Star className="text-rose-300" size={20} />,
  },
  {
    title: "The Beautiful Journey 🌱",
    date: "2025-2026-...loading",
    desc: "Growing, learning, and loving. You are my safe haven and my life-partner.",
    icon: <Heart className="text-rose-400" size={20} />,
  },
  {
    title: "Happy Birthday Rajanya ❤️",
    date: "2026",
    desc: "To my forever person. Still writing our story with ink made of stars.",
    icon: <Heart className="fill-rose-600 text-rose-600" size={22} />,
  },
];

export default function Timeline() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const [selected, setSelected] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 📡 Fetch images
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gallery/HIM`)
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Timeline fetch error:", err));

    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🎬 Background Slideshow Logic
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setBgIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  const chunkImages = (arr: any[], parts: number) => {
    const chunkSize = Math.ceil(arr.length / parts);
    return Array.from({ length: parts }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize));
  };

  const groupedImages = useMemo(() => chunkImages(images, timelineMeta.length), [images]);
  const floatingHearts = useMemo(() => [...Array(30)], []);

  return (
    <div className="relative min-h-screen py-20 px-6 md:px-10 bg-[#0a0505] overflow-hidden cursor-none">
      
      {/* ❤️ CUSTOM GLOW CURSOR */}
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:flex items-center justify-center text-xl filter drop-shadow-[0_0_10px_#e11d48]"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
      >
        ❤️
      </motion.div>

      {/* 🎬 CINEMATIC BACKGROUND SLIDESHOW */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          {images.length > 0 && (
            <motion.div
              key={bgIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.2, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
              className="absolute inset-0 bg-cover bg-center filter blur-sm grayscale-[30%]"
              style={{ backgroundImage: `url(${images[bgIndex]?.url})` }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505] via-transparent to-[#0a0505]" />
      </div>

      {/* 🎈 FLOATING PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {floatingHearts.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500/20 text-2xl"
            initial={{ y: "110%", x: `${Math.random() * 100}%`, scale: Math.random() * 0.5 + 0.5 }}
            animate={{ 
              y: "-10%", 
              x: [`${Math.random() * 100}%`, `${Math.random() * 110}%`],
              rotate: [0, 360] 
            }}
            transition={{ duration: Math.random() * 10 + 15, repeat: Infinity, ease: "linear", delay: Math.random() * 20 }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-20">
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h2 className="text-rose-400 tracking-[0.4em] uppercase text-[10px] mb-4 font-bold">Deep Emotional Journey</h2>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            Our Eternal <span className="bg-gradient-to-r from-rose-400 to-amber-200 bg-clip-text text-transparent">Chapter</span>
          </h1>
          <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto rounded-full" />
        </motion.div>

        {/* TIMELINE TRACK */}
        <motion.div
          style={{ scaleY }}
          className="absolute left-6 md:left-1/2 top-40 bottom-0 w-[2px] bg-gradient-to-b from-rose-500 via-amber-200 to-rose-600 origin-top hidden md:block shadow-[0_0_15px_#e11d48]"
        />

        <div className="space-y-32">
          {timelineMeta.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* BEAT-SYNC ICON */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0px #e11d48", "0 0 20px #e11d48", "0 0 0px #e11d48"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-6 md:left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-[#1a0a0a] border-2 border-rose-500 flex items-center justify-center shadow-lg"
              >
                {item.icon}
              </motion.div>

              {/* TEXT CARD */}
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                className="w-full md:w-[45%] p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative group"
              >
                <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Heart className="text-rose-500" size={16} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={14} className="text-rose-400" />
                  <span className="text-[10px] tracking-widest text-rose-300 font-bold uppercase">{item.date}</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-4 group-hover:text-rose-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-rose-100/60 italic leading-relaxed font-light">"{item.desc}"</p>
              </motion.div>

              {/* IMAGE GRID */}
              <div className="w-full md:w-[45%] grid grid-cols-2 gap-4">
                {groupedImages[i]?.map((img: any, idx: number) => (
                  <motion.div
                    key={img._id}
                    whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
                    className="relative rounded-2xl overflow-hidden h-40 md:h-52 group cursor-pointer border border-white/5"
                    onClick={() => setSelected(img.url)}
                  >
                    <img src={img.url} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white" size={24} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔍 CINEMATIC ZOOM VIEW */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-[10000] p-6"
            onClick={() => setSelected(null)}
          >
            <motion.button 
              whileHover={{ rotate: 90 }}
              className="absolute top-10 right-10 text-white/50 hover:text-white"
            >
              <X size={40} />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selected}
              className="max-h-[85vh] max-w-full rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.3)] border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e11d48; border-radius: 10px; }
      `}</style>
    </div>
  );
}