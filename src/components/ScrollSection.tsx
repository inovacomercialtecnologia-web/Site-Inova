import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  isFirst?: boolean;
}

export default function ScrollSection({ children, className = "", isFirst = false }: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(
    scrollYProgress,
    isFirst ? [0, 0.85, 1] : [0, 0.15, 0.85, 1],
    isFirst ? [1, 1, 0] : [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    isFirst ? [0, 0.85, 1] : [0, 0.15, 0.85, 1],
    isFirst ? [1, 1, isMobile ? 1.0 : 1.3] : [isMobile ? 0.98 : 0.85, 1, 1, isMobile ? 1.0 : 1.3]
  );

  // Disable blur and rotation on mobile — GPU intensive
  const filter = useTransform(
    scrollYProgress,
    [0.85, 1],
    isMobile ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(10px)"]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0.85, 1],
    isMobile ? [0, 0] : [0, -1.5]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale, filter: isMobile ? undefined : filter, rotate: isMobile ? undefined : rotate }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
