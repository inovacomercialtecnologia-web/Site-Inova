import React, { useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence, useMotionValue } from 'motion/react';

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorSize = useMotionValue(20);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Skip event listeners on mobile/touch devices to save performance
    const isMobile = window.matchMedia('(max-width: 767px)').matches
      || 'ontouchstart' in window
      || navigator.maxTouchPoints > 0;
    if (isMobile) return;

    let pendingX = 0;
    let pendingY = 0;
    let rafId = 0;

    const flush = () => {
      mouseX.set(pendingX);
      mouseY.set(pendingY);
      rafId = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .interactive, input, textarea')) {
        setIsHovering(true);
        cursorSize.set(80);
      } else {
        setIsHovering(false);
        cursorSize.set(20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const springConfig = { damping: 25, stiffness: 250 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);
  const sSize = useSpring(cursorSize, springConfig);

  return (
    <motion.div
      style={{
        left: sx,
        top: sy,
        width: sSize,
        height: sSize,
        x: '-50%',
        y: '-50%',
      }}
      className={`fixed pointer-events-none hidden md:flex z-[9998] rounded-full border border-[#C9A84C] items-center justify-center mix-blend-difference ${isHovering ? 'bg-[#C9A84C]/10' : 'bg-transparent'}`}
    >
      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-1 h-1 bg-[#C9A84C] rounded-full"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomCursor;
