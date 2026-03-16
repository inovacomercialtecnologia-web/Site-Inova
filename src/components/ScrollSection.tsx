import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
}

export default function ScrollSection({ children, className = "", isFirst = false }: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Entrance (0 -> 0.3): Fade in + Scale up slightly
  // Middle (0.3 -> 0.7): Stable
  // Exit (0.7 -> 1.0): Disruptive (Scale up aggressively, Blur, Rotate, Fade out)

  const opacity = useTransform(
    scrollYProgress,
    isFirst ? [0, 0.85, 1] : [0, 0.15, 0.85, 1],
    isFirst ? [1, 1, 0] : [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    isFirst ? [0, 0.85, 1] : [0, 0.15, 0.85, 1],
    isFirst ? [1, 1, 1.3] : [0.85, 1, 1, 1.3]
  );

  const filter = useTransform(
    scrollYProgress,
    [0.85, 1],
    ["blur(0px)", "blur(10px)"]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0.85, 1],
    [0, -1.5]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale, filter, rotate }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
