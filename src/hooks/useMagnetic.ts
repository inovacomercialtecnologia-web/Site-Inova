import { useRef, useCallback, useState, useEffect } from 'react';

interface UseMagneticOptions {
  strength?: number;
  radius?: number;
}

export function useMagnetic({ strength = 0.2, radius = 100 }: UseMagneticOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      window.matchMedia('(max-width: 767px)').matches
      || 'ontouchstart' in window
      || navigator.maxTouchPoints > 0
    );
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < radius) {
      setOffset({
        x: distX * strength,
        y: distY * strength,
      });
    }
  }, [isMobile, strength, radius]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 && offset.y === 0
      ? 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
      : 'transform 0.15s ease-out',
  };

  return {
    ref,
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
