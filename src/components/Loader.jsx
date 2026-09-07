import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Loader({ onFinishLoading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onFinishLoading) onFinishLoading();
          }, 600);
          return 100;
        }
        // Smooth luxury progress increment
        const increment = Math.floor(Math.random() * 6) + 3;
        return Math.min(100, prev + increment);
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onFinishLoading]);

  // Format number as 2-3 digits: 00, 08, 45, 100
  const formattedProgress = progress < 10 ? `0${progress}` : `${progress}`;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        y: '-100%',
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FAF7F2] text-[#1C1917] px-6 py-12 select-none overflow-hidden"
    >
      {/* Top Subtle Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] text-[#8A7968] uppercase"
      >
        Fine Art & Luxury Photography
      </motion.div>

      {/* Centerpiece: Pure Logo & Gold Hairline Indicator */}
      <div className="flex flex-col items-center justify-center space-y-8 my-auto">
        {/* Logo with Soft Silky Glow */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center"
        >
          <img
            src="/logo.png"
            alt="Frame Your Moments"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(197,160,89,0.18)]"
          />
        </motion.div>

        {/* Minimal Luxury Hairline Progress Line */}
        <div className="w-48 sm:w-64 space-y-3">
          <div className="w-full h-[1.5px] bg-[#E8DFD1] relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#BF953F] via-[#D5B064] to-[#AA771C]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>

          {/* Clean Percentage Display */}
          <div className="flex items-center justify-between font-cinzel text-[10px] tracking-[0.3em] text-[#8A7968] uppercase">
            <span>Loading</span>
            <span className="font-mono text-xs text-[#1C1917]">{formattedProgress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Subtle Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="font-serif-luxury italic text-xs sm:text-sm text-[#786C62] tracking-wider text-center"
      >
        Capturing your timeless stories...
      </motion.div>
    </motion.div>
  );
}
