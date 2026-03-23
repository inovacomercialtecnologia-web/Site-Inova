import { useRef, useState, useCallback, CSSProperties } from 'react';

interface UseTiltOptions {
  maxDegrees?: number;
  perspective?: number;
  scale?: number;
}

export function useTilt({
  maxDegrees = 5,
  perspective = 800,
  scale = 1.02,
}: UseTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovering: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1...1
    const normalX = (e.clientX - centerX) / (rect.width / 2);
    const normalY = (e.clientY - centerY) / (rect.height / 2);

    // Clamp
    const clampedX = Math.max(-1, Math.min(1, normalX));
    const clampedY = Math.max(-1, Math.min(1, normalY));

    setTilt({
      rotateY: clampedX * maxDegrees,
      rotateX: -clampedY * maxDegrees,
      isHovering: true,
    });
  }, [maxDegrees]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, isHovering: false });
  }, []);

  const style: CSSProperties = {
    transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovering ? scale : 1}, ${tilt.isHovering ? scale : 1}, 1)`,
    transition: tilt.isHovering ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out',
    willChange: 'transform',
  };

  return {
    ref,
    style,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
    isHovering: tilt.isHovering,
  };
}
