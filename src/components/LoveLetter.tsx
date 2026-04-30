"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Sparkles, Download, MailOpen, Mail, PenTool, X, Star, Ghost } from "lucide-react";
import html2canvas from "html2canvas";

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);

  // 1. Cinematic Background Animation Logic
  const downloadLetter = async () => {
    if (letterRef.current) {
      const canvas = await html2canvas(letterRef.current, {
        backgroundColor: "#0a0104",
        scale: 3, // High resolution for premium feel
        
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "A_Lifetime_With_Rajanya.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-32 px-4 overflow-hidden bg-transparent">
      
      {/* ✨ FLOATING BACKGROUND PARTICLES (Section Specific) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0], 
              scale: [0.5, 1.2, 0.5],
              y: [-20, -150],
              x: Math.sin(i) * 50
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: i * 0.5 
            }}
            className="absolute text-rose-400/20"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${60 + Math.random() * 40}%` 
            }}
          >
            <Heart size={Math.random() * 20 + 10} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* 🎬 SECTION HEADER: CINEMATIC REVEAL */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="mb-20 text-center relative z-10"
      >
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center gap-4 mb-6 text-amber-400"
        >
          <Star size={20} fill="currentColor" />
          <Heart size={24} className="text-rose-500" fill="currentColor" />
          <Star size={20} fill="currentColor" />
        </motion.div>
        
        <h2 className="text-rose-200 font-black tracking-[0.6em] uppercase text-[12px] md:text-sm mb-4 drop-shadow-glow">
          Private Commemoration
        </h2>
        <p className="text-rose-100/40 text-lg font-serif italic max-w-md mx-auto leading-relaxed">
          "Some feelings are too deep for code, so I wrote them in a letter for your soul."
        </p>
      </motion.div>

      {/* ✉️ THE INTERACTIVE 3D ENVELOPE */}
      <div className="relative z-20 perspective-2000">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
          initial={{ rotateY: -10 }}
          whileHover={{ rotateY: 0, scale: 1.02, y: -10 }}
          className={`relative cursor-pointer transition-all duration-1000 transform-style-3d ${isOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100"}`}
        >
          {/* Heartbeat Glow */}
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-rose-600 blur-[80px] rounded-full"
          />

          <div className="relative bg-gradient-to-br from-rose-50 to-rose-200 w-72 h-48 md:w-96 md:h-64 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex items-center justify-center border-b-[6px] border-rose-300/50">
            {/* Wax Seal Design */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Mail size={60} strokeWidth={1} className="text-rose-800/80" />
              </motion.div>
              <span className="font-serif italic font-bold text-xl text-rose-900/70 tracking-tight">
                To My Soulmate, Rajanya
              </span>
            </div>

            {/* Premium Gold Seal */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-6 bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-600 w-16 h-16 rounded-full border-4 border-rose-100 flex items-center justify-center shadow-2xl"
            >
              <Heart size={24} fill="white" className="text-white drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 📜 THE CINEMATIC MODAL LETTER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Cinematic Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[999] bg-[#080104]/95 backdrop-blur-3xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100 }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
            >
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar group">
                
                {/* Float-top Close */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-16 right-0 text-white/40 hover:text-rose-500 transition-all flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 hover:border-rose-500/50 uppercase tracking-[0.4em] text-[10px] font-black"
                >
                  Close <X size={16} />
                </button>

                {/* THE STATIONERY CARD */}
                <div 
                  ref={letterRef}
                  className="relative bg-[#fffefc] text-[#1a0f11] rounded-[3rem] p-12 md:p-20 shadow-[0_50px_150px_rgba(244,63,94,0.3)] rounded-[40px] overflow-hidden"
                >
                  {/* Subtle Paper Texture & Watermark */}
                  <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                     <Heart size={400} fill="currentColor" className="text-rose-900" />
                  </div>

                  {/* Red Margin Lines */}
                  <div className="absolute top-0 left-14 w-[2px] h-full bg-rose-100" />
                  <div className="absolute top-0 left-16 w-[1px] h-full bg-rose-50" />

                  {/* Letter Header */}
                  <div className="relative z-10 flex justify-between items-start mb-16">
                    <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                      <p className="font-serif italic text-rose-800 text-3xl md:text-4xl mb-1">My Dearest Rajanya ❤️</p>
                      <p className="text-[10px] text-amber-600/60 uppercase tracking-[0.5em] font-bold">Est. Forever & Always</p>
                    </motion.div>
                    <div className="text-rose-200">
                      <PenTool size={40} strokeWidth={1} />
                    </div>
                  </div>

                  {/* Deep Emotional Body Content */}
                  <div className="relative z-10 font-serif space-y-10 text-2xl md:text-3xl leading-[1.8] italic text-gray-800/90">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                      They say the best things in life aren't things—they are <span className="text-rose-600 font-black not-italic underline decoration-rose-200 underline-offset-8">souls</span>. 
                      Since you've walked into my life, every "ordinary" moment has felt like a cinematic masterpiece.
                    </motion.p>
                    
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                      In your smile, I found my peace. In your eyes, I found my future. You are not just my partner; 
                      you are the very heartbeat of my existence. Thank you for choosing me to be your person.
                    </motion.p>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                      Happy Birthday, my Rajanya. May this digital world I built for you be a reminder that 
                      even in a universe of billions, my heart only ever beats for <span className="text-rose-600 font-bold">you</span>.
                    </motion.p>
                  </div>

                  {/* Letter Signature */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 2 }}
                    className="relative z-10 mt-20 pt-10 border-t border-rose-100 flex flex-col items-end"
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-[0.5em] mb-4">Yours, until the stars go out,</p>
                    <p className="text-5xl md:text-7xl font-serif font-black bg-gradient-to-r from-rose-700 via-rose-500 to-amber-600 bg-clip-text text-transparent pb-2">
                      Subhadip ❤️
                    </p>
                  </motion.div>
                </div>

                {/* PREMIUM ACTION BUTTONS */}
                <div className="flex flex-col md:flex-row justify-center gap-6 mt-12 mb-20 px-4">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(244,63,94,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadLetter}
                    className="flex items-center justify-center gap-4 bg-white text-rose-950 px-10 py-5 rounded-full font-black text-sm tracking-widest shadow-2xl transition-all group"
                  >
                    <Download size={20} className="group-hover:animate-bounce" />
                    SAVE AS KEEPSAKE
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(244,63,94,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-4 bg-rose-600/10 backdrop-blur-xl border border-rose-500/30 text-rose-100 px-10 py-5 rounded-full font-black text-sm tracking-widest transition-all"
                  >
                    <Heart size={20} className="fill-rose-500" />
                    KEEP IN MY HEART
                  </motion.button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-2000 { perspective: 2000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        
        .drop-shadow-glow {
          filter: drop-shadow(0 0 10px rgba(244,63,94,0.5));
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }

        @media (max-width: 768px) {
          .perspective-2000 { perspective: 1200px; }
        }
      `}</style>
    </div>
  );
}