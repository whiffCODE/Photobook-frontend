"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";
import FilmStrip from "@/components/FilmStrip"; 
import MusicPlayer from "@/components/MusicPlayer";

/**
 * 1. HIGH-PERFORMANCE ANIMATED COMPONENTS
 */

// Physics-based tail for the heart cursor
const CursorTail = ({ index, mouseX, mouseY }: { index: number, mouseX: any, mouseY: any }) => {
  const x = useSpring(mouseX, { damping: 20 + index * 2, stiffness: 250 - index * 10 });
  const y = useSpring(mouseY, { damping: 20 + index * 2, stiffness: 250 - index * 10 });

  return (
    <motion.div
      className="fixed top-0 left-0 w-2 h-2 bg-rose-400 rounded-full blur-[1px] pointer-events-none z-[99999]"
      style={{ 
        x, y, 
        translateX: "-50%", translateY: "-50%", 
        opacity: 0.6 - (index * 0.05), 
        scale: 1.8 - (index * 0.12) 
      }}
    />
  );
};

const CustomHeartCursor = ({ mouseX, mouseY }: { mouseX: any, mouseY: any }) => {
  const sx = useSpring(mouseX, { damping: 15, stiffness: 500 });
  const sy = useSpring(mouseY, { damping: 15, stiffness: 500 });

  return (
    <div className="fixed inset-0 pointer-events-none z-[100000] hidden md:block">
      <motion.div
        className="absolute w-16 h-16 flex items-center justify-center text-4xl"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      >
        <div className="absolute inset-0 bg-rose-500/40 blur-[40px] rounded-full animate-pulse" />
        <motion.span 
          animate={{ 
            scale: [1, 1.4, 1], 
            rotate: [0, 15, -15, 0],
            filter: ["drop-shadow(0 0 10px #e11d48)", "drop-shadow(0 0 30px #e11d48)", "drop-shadow(0 0 10px #e11d48)"]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          ❤️
        </motion.span>
      </motion.div>
      {[...Array(15)].map((_, i) => (
        <CursorTail key={i} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
};

// Global Floating Particles
const FloatingParticles = ({ active }: { active: boolean }) => {
  const count = active ? 100 : 50;
  const particles = useMemo(() => [...Array(count)], [count]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {particles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: "110vh", x: `${Math.random() * 100}vw` }}
            animate={{
              opacity: [0, 1, 0],
              y: ["110vh", "-20vh"],
              x: [`${Math.random() * 100}vw`, `${(Math.random() * 110) - 5}vw`],
              rotate: [0, 720],
              scale: [0.2, Math.random() * 1.5 + 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "easeInOut"
            }}
            className="absolute transform-gpu will-change-transform"
          >
            <span className="text-rose-300/50 text-2xl drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]">
              {["❤️", "✨", "💖", "🌸", "💕", "🧸", "🌟", "☁️"][i % 8]}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function LuxuryCard({ link, index }: { link: any, index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 150, rotateY: -20 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 1.5, type: "spring", bounce: 0.3 }}
      className="group relative h-[400px] w-full perspective-2000"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - (rect.left + rect.width / 2));
        y.set(e.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <Link href={link.href} className="block h-full w-full">
        <motion.div 
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="luxury-glass rounded-[3rem] h-full flex flex-col items-center justify-center p-8 relative overflow-hidden border border-white/20 transform-gpu transition-all duration-500 group-hover:border-rose-400 group-hover:shadow-[0_0_50px_rgba(225,29,72,0.3)]"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
               style={{ background: `radial-gradient(circle at 50% 50%, ${link.color}, transparent 70%)` }} />
          
          <motion.div 
            style={{ translateZ: 150 }}
            animate={{ y: [0, -25, 0], scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
            className="text-8xl mb-8 z-10 filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)]"
          >
            {link.icon}
          </motion.div>

          <div className="relative z-10 text-center" style={{ transform: "translateZ(80px)" }}>
            <span className="text-[14px] font-black tracking-[0.8em] text-rose-300 uppercase block mb-4 opacity-80 group-hover:text-white transition-all duration-500">
              For You
            </span>
            <h3 className="text-3xl font-bold tracking-wider text-white group-hover:scale-110 transition-transform duration-500 drop-shadow-md">
              {link.name}
            </h3>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/**
 * 2. MAIN PAGE COMPONENT
 */

export default function Home() {
  const [isDreamMode, setIsDreamMode] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const navLinks = [
    { name: "Family Archive", href: "/baba", icon: "🌸", color: "#fb7185" },
    { name: "Roots & Wisdom", href: "/dida", icon: "👵", color: "#fcd34d" },
    { name: "Soul Circle", href: "/friends", icon: "😎", color: "#7dd3fc" },
    { name: "His Queen ❤️", href: "/him", icon: "👑", color: "#f43f5e" },
    { name: "My Essence", href: "/me", icon: "💫", color: "#c084fc" },
  ];

  return (
    <div 
      className="relative min-h-screen w-full bg-[#0a0205] text-white overflow-x-hidden cursor-none selection:bg-rose-500/40"
      onMouseMove={handleMouseMove}
    >
      <style jsx global>{`
        * { cursor: none !important; }
        ::-webkit-scrollbar { display: none; }
        .luxury-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px) saturate(180%);
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
        }
        .text-glow-premium {
          background: linear-gradient(to bottom, #ffffff 10%, #fda4af 50%, #e11d48 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 30px rgba(225, 29, 72, 0.6));
        }
        .beat-sync { 
            animation: premium-heartbeat 1.4s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95); 
            will-change: transform, filter;
        }
        @keyframes premium-heartbeat {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          35% { transform: scale(1.12); filter: brightness(1.2) drop-shadow(0 0 80px rgba(225, 29, 72, 1)); }
          45% { transform: scale(1.05); }
        }
      `}</style>

      {/* FX LAYERS */}
      <CustomHeartCursor mouseX={mouseX} mouseY={mouseY} />
      <FloatingParticles active={isDreamMode} />
      <MusicPlayer src="/music/landing.mp3" />

      {/* DYNAMIC BACKGROUND */}
      <motion.div
        animate={{ 
          scale: isDreamMode ? 1.1 : 1,
          opacity: isDreamMode ? 0.9 : 0.6,
          filter: isDreamMode ? "blur(0px) brightness(0.8)" : "blur(8px) brightness(0.5)" 
        }}
        transition={{ duration: 2.5, ease: "circOut" }}
        className="fixed inset-0 z-0 transform-gpu overflow-hidden"
      >
        
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/20 via-transparent to-rose-900/20" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center px-6 py-28">
        
        {/* TITLES */}
        <div className="text-center mb-32 select-none perspective-2000">
          <div className="overflow-hidden py-4">
            <motion.h2 
              initial={{ x: "100vw", opacity: 0, scale: 2, skewX: -20 }}
              animate={{ x: 0, opacity: 1, scale: 1, skewX: 0 }}
              transition={{ type: "spring", stiffness: 40, damping: 12, delay: 0.3 }}
              className="text-6xl md:text-[9rem] font-thin tracking-[0.4em] text-white/80 mb-6 uppercase"
            >
              Happy Birthday
            </motion.h2>
          </div>
          
          <div className="overflow-visible mt-2">
            <motion.h1 
              initial={{ x: "-100vw", opacity: 0, scale: 0.5, rotateY: -45 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 45, damping: 10, delay: 0.7 }}
              className="text-9xl md:text-[18rem] font-black italic text-glow-premium leading-none beat-sync transform-gpu"
            >
              Rajanya ❤️
            </motion.h1>
          </div>
        </div>

        {/* INTERACTIVE CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 w-full max-w-[100rem] px-4">
          {navLinks.map((link, idx) => (
            <LuxuryCard key={link.name} link={link} index={idx} />
          ))}
        </div>

        {/* MODE TOGGLE BUTTON */}
        <motion.div className="mt-40">
          <motion.button
            whileHover={{ 
              scale: 1.1, 
              letterSpacing: "0.8em", 
              boxShadow: "0 0 70px rgba(225, 29, 72, 0.6)",
              backgroundColor: "rgba(225, 29, 72, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDreamMode(!isDreamMode)}
            className="group px-24 py-8 rounded-full border-2 border-rose-500/50 luxury-glass text-[14px] uppercase tracking-[0.5em] text-white font-bold relative overflow-hidden transition-all duration-700"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10">{isDreamMode ? "Awake" : "Enter the Dream"}</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ZOOMABLE IMAGE MODAL */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-[100px] p-6"
            onClick={() => setSelectedImg(null)}
          >
            <motion.div 
              initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.2, rotate: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="relative flex flex-col items-center transform-gpu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group overflow-hidden rounded-[3.5rem] border-4 border-white/10 shadow-[0_0_150px_rgba(225,29,72,0.6)]">
                <motion.img 
                  src={selectedImg} 
                  className="max-h-[75vh] w-auto transition-transform duration-[2s] ease-out group-hover:scale-105" 
                  alt="Precious Memory" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rose-900/40" />
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-10">
                <motion.a 
                  whileHover={{ scale: 1.15, backgroundColor: "#f43f5e", y: -8 }}
                  whileTap={{ scale: 0.9 }}
                  href={selectedImg} 
                  download={`Rajanya_Memory_${Date.now()}.jpg`}
                  className="px-16 py-6 bg-rose-600 rounded-full text-[12px] font-black uppercase tracking-[0.5em] flex items-center gap-4 shadow-[0_25px_50px_rgba(225,29,72,0.5)]"
                >
                  <span>Save Memory</span>
                </motion.a>
                
                <motion.button 
                  whileHover={{ scale: 1.15, y: -8, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedImg(null)}
                  className="px-16 py-6 luxury-glass rounded-full text-[12px] font-black uppercase tracking-[0.5em] border border-white/20"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}