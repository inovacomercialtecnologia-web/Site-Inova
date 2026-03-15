"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface HeroToCarouselWrapperProps {
  /**
   * The Hero component to be displayed in the foreground initially.
   * Example usage: <HeroToCarouselWrapper heroComponent={<Hero />} carouselComponent={<ImpactCarousel />} />
   */
  heroComponent: React.ReactNode;
  /**
   * The Carousel component that will scale up and fade in from the background.
   */
  carouselComponent: React.ReactNode;
}

/**
 * A 3D Scroll-linked Transition Wrapper.
 * Orchestrates a "Camera Fly-through" (Z-axis tunnel effect) transition 
 * between Section 1 (Hero) and Section 2 (Carousel).
 */
export default function HeroToCarouselWrapper({
  heroComponent,
  carouselComponent
}: HeroToCarouselWrapperProps) {
  // The parent container acts as the 300vh scroll track
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- The 3D Math (useTransform) ---

  // Layer 1 (Hero Component)
  // Massive zoom in as the user scrolls down
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 5]);
  // Fades out as it passes the camera
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  // Motion blur effect as it gets closer to the camera
  const heroFilter = useTransform(scrollYProgress, [0, 0.3], ['blur(0px)', 'blur(20px)']);

  // Layer 2 (Carousel Component)
  // Starts small/far away, scales up to normal size
  const carouselScale = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
  // Fades in as it approaches
  const carouselOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0, 1]);

  return (
    <div ref={containerRef} className="h-[200vh] md:h-[300vh] relative w-full">
      {/* Sticky container that holds the viewport during the scroll track */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-black">
        
        {/* Layer 2: Carousel Component */}
        {/* Positioned absolutely covering the screen, behind Layer 1 (z-index lower) */}
        <motion.div
          style={{
            scale: carouselScale,
            opacity: carouselOpacity,
          }}
          className="absolute inset-0 z-0 flex items-center justify-center w-full h-full"
        >
          {/* Wrapper to ensure the inner component can scroll its own contents if needed, 
              or just render the component directly. */}
          <div className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
            {carouselComponent}
          </div>
        </motion.div>

        {/* Layer 1: Hero Component */}
        {/* Positioned absolutely covering the screen, in front of Layer 2 */}
        <motion.div
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            filter: heroFilter,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center w-full h-full origin-center pointer-events-none"
        >
          {/* Re-enable pointer events for the hero content so buttons remain clickable before scrolling */}
          <div className="w-full h-full pointer-events-auto">
            {heroComponent}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
