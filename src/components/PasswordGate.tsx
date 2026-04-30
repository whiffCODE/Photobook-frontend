"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Sparkles, Lock, Camera, Stars, Eye, 
  EyeOff, Info, Music, Sparkle, HeartHandshake, 
  Flame, CloudRain 
} from "lucide-react";

export default function PasswordGate({ children }: any) {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const correct = "Rajjo";

  // Handle Mouse movement for the ❤️ Cursor
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Performance optimized particle generator
  const floatingElements = useMemo(() => [...Array(35)], []);

  const handleVerify = () => {
    if (pass.trim().toLowerCase() === correct.toLowerCase()) {
      setOk(true);
    } else {
      // Custom sweet error feedback could go here
      alert("That's not our secret code, my life-partner... Try again? 🥰");
    }
  };

  if (ok) return children;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0104] cursor-none font-sans select-none perspective-1000">
      
      {/* 1. ❤️ ANIMATED GLOW CURSOR (Desktop Only) */}
      <motion.div
        className="fixed top-0 left-0 z-[99999] pointer-events-none hidden md:block"
        animate={{ 
          x: mousePos.x - 24, 
          y: mousePos.y - 24,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.5 }}
      >
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 2.2, 1], 
              opacity: [0.3, 0.6, 0.3],
              filter: ["blur(20px)", "blur(40px)", "blur(20px)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-rose-500 rounded-full w-12 h-12" 
          />
          <span className="text-4xl drop-shadow-[0_0_15px_rgba(244,63,94,1)]">❤️</span>
        </div>
      </motion.div>

      {/* 2. CINEMATIC BACKGROUND SLIDESHOW */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key="bg-slideshow"
            initial={{ scale: 1.3, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1.1, opacity: 0.5, filter: "blur(0px)" }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2070')] bg-cover bg-center grayscale-[30%] sepia-[20%]"
          />
        </AnimatePresence>
        
        {/* Deep Emotional Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0104] via-transparent to-[#0a0104] opacity-80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0a0104] opacity-90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* 3. BEAT-SYNC FLOATING SOUL PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {floatingElements.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
            animate={{ 
              y: "-10vh", 
              opacity: [0, 0.8, 0.8, 0],
              scale: [0.8, 1.2, 0.8], 
              rotate: [0, 360],
              x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`
            }}
            transition={{ 
              duration: Math.random() * 8 + 10, 
              repeat: Infinity, 
              delay: Math.random() * 15,
              ease: "easeInOut"
            }}
            className="absolute"
          >
            {i % 3 === 0 ? (
              <Heart className="text-rose-500/40" size={Math.random() * 25 + 10} fill="currentColor" />
            ) : i % 3 === 1 ? (
              <Sparkles className="text-amber-200/30" size={Math.random() * 20 + 10} />
            ) : (
              <div className="text-white/20 font-serif text-xl italic">Always</div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 4. THE ULTRA-PREMIUM 3D ACCESS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateY: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 60 }}
        className="relative z-10 w-[92%] max-w-lg"
      >
        {/* Glowing Border Wrap */}
        <div className="relative p-[1px] rounded-[3.5rem] bg-gradient-to-tr from-rose-500/40 via-white/20 to-amber-500/40 backdrop-blur-3xl shadow-[0_0_100px_rgba(244,63,94,0.15)] overflow-hidden">
          
          <div className="bg-[#0e0206]/90 rounded-[3.4rem] p-8 md:p-14 border border-white/5 text-center relative overflow-hidden">
            
            {/* Animated Inner Aura */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1] 
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-80 h-80 bg-rose-600 blur-[100px] rounded-full pointer-events-none"
            />

            {/* Top Badge */}
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="flex justify-center mb-6"
            >
              <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                <HeartHandshake size={32} className="text-rose-400 animate-pulse" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 -right-1"
                >
                  <Sparkle size={16} className="text-amber-400 fill-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main Text Content */}
            <div className="space-y-2 mb-10">
              <h1 className="text-[10px] uppercase tracking-[0.8em] text-rose-300/60 font-bold">Life-Partner Exclusive Access</h1>
              <h2 className="text-4xl md:text-5xl font-serif italic text-white">Happy Birthday</h2>
              <h3 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white via-rose-100 to-rose-400 bg-clip-text text-transparent py-2">
                Rajanya <span className="inline-block animate-bounce">❤️</span>
              </h3>
            </div>

            {/* Emotional Hint Box */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 to-transparent border border-rose-500/20 text-left relative group overflow-hidden"
            >
              <div className="flex gap-4 relative z-10">
                <Info size={20} className="text-rose-400 shrink-0 mt-1" />
                <p className="text-xs md:text-sm text-rose-100/70 leading-relaxed italic">
                  "Only my favorite person knows the secret name I use to call them. It's the key to our digital sanctuary."
                </p>
              </div>
              <motion.div 
                className="absolute inset-0 bg-rose-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" 
              />
            </motion.div>

            {/* Input & Action */}
            <div className="space-y-5">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter secret name..."
                  value={pass}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-center focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all placeholder:text-zinc-700 tracking-[0.2em] font-bold"
                />
                <button 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-rose-400 transition-colors p-2"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  boxShadow: "0 10px 40px rgba(244,63,94,0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerify}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold tracking-[0.3em] uppercase text-[10px] flex items-center justify-center gap-3 transition-all border border-rose-400/20 group"
              >
                Unlock Memories
                <Flame size={16} className="group-hover:animate-bounce" />
              </motion.button>
            </div>

            <p className="mt-10 text-[9px] uppercase tracking-[0.4em] text-zinc-600 font-medium italic">
              Forever & Always Yours
            </p>
          </div>
        </div>
      </motion.div>

      {/* 5. LARGE BACKGROUND TYPOGRAPHY (The Soul Name) */}
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-5 whitespace-nowrap opacity-[0.03] select-none pointer-events-none"
      >
        <span className="text-[20rem] font-black text-white italic tracking-tighter">
          PARTNER RAJANNYA PARTNER RAJANNYA PARTNER RAJANNYA
        </span>
      </motion.div>

      {/* 6. CORNER VIBE ACCENTS */}
      <div className="absolute top-10 left-10 text-rose-500/10 hidden lg:block">
        <Stars size={120} className="animate-pulse" />
      </div>
      <div className="absolute bottom-10 right-10 text-rose-500/10 hidden lg:block">
        <Heart size={120} strokeWidth={1} className="animate-pulse" />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,900&family=Inter:wght@300;500;700;900&display=swap');
        
        body { 
          background: #0a0104; 
          margin: 0; 
          overflow: hidden; 
        }

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .perspective-1000 {
          perspective: 1000px;
        }

        ::selection {
          background: #fb7185;
          color: white;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}