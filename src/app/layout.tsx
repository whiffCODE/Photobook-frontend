"use client";

import "./globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">

        {/* 🎬 Page Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

      </body>
    </html>
  );
}