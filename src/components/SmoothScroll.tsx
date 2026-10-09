import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
// framer-motion scroll hooks stay perfectly in sync with the eased scroll.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const [ready, setReady] = useState(false);
  const tickRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    tickRef.current = tick;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.style.scrollBehavior = 'auto';
    setReady(true);

    return () => {
      if (tickRef.current) gsap.ticker.remove(tickRef.current);
      lenis.destroy();
      lenisInstance = null;
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Route change: jump to top (or to the hash target) and re-measure triggers
  useEffect(() => {
    const lenis = lenisInstance;
    if (!lenis) return;
    if (hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(hash) as HTMLElement | null;
        if (el) lenis.scrollTo(el, { offset: -80 });
      }, 150);
      return () => clearTimeout(t);
    }
    lenis.scrollTo(0, { immediate: true });
    const r = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(r);
  }, [pathname, hash, ready]);

  return <>{children}</>;
}
