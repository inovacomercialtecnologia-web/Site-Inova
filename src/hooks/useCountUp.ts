import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountUpOptions {
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

export function useCountUp(
  target: number,
  { duration = 1500, delay = 0, suffix = '', prefix = '' }: UseCountUpOptions = {}
) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const startAnimation = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const startTime = performance.now() + delay;
    const isFloat = !Number.isInteger(target);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * target;

      setValue(isFloat ? parseFloat(current.toFixed(1)) : Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, delay, hasStarted]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startAnimation]);

  const display = `${prefix}${value}${suffix}`;

  return { display, ref, hasStarted };
}

/**
 * Parse a metric string like "68%", "140h", "4×", "50+" into { value, suffix }
 */
export function parseMetric(metric: string): { value: number; suffix: string } {
  const match = metric.match(/^([0-9.]+)(.*)$/);
  if (!match) return { value: 0, suffix: metric };
  return { value: parseFloat(match[1]), suffix: match[2] };
}
