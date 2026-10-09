import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── ExpandOnScroll: inset, rounded media grows to full width as you scroll ──
export function ExpandOnScroll({ children, className = '' }: { children: ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced() || !wrap.current || !inner.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { clipPath: 'inset(8% 10% 8% 10% round 2.5rem)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 1.5rem)',
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top 85%', end: 'center 55%', scrub: 0.8 },
        },
      );
      gsap.fromTo(
        inner.current!.querySelectorAll('[data-expand-img]'),
        { scale: 1.25 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrap} className={className}>
      <div ref={inner} className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}

// ─── HorizontalScroll: pins the section and slides the track sideways ────────
export function HorizontalScroll({ children, header }: { children: ReactNode; header?: ReactNode }) {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced() || !section.current || !track.current) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const distance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth + 80);
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top+=64',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`; },
        },
      });
      return () => tween.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={section} className="overflow-hidden bg-white py-16 lg:flex lg:min-h-[calc(100vh-64px)] lg:flex-col lg:justify-center lg:py-12">
      {header}
      <div
        ref={track}
        className="lux-no-scrollbar flex gap-5 overflow-x-auto px-5 pb-2 md:px-10 lg:overflow-visible xl:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]"
      >
        {children}
      </div>
      <div className="lux-container mt-8 hidden lg:block">
        <div className="h-px w-full bg-hairline">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </div>
  );
}

// ─── StaggerFromBelow: GSAP batch reveal for dense grids ─────────────────────
export function GsapBatch({ children, className = '', selector = '[data-batch]' }: { children: ReactNode; className?: string; selector?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (prefersReduced() || !ref.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(selector);
      gsap.set(items, { y: 60, opacity: 0, rotateX: -8, transformPerspective: 800 });
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'expo.out', stagger: 0.08 }),
      });
    }, ref);
    return () => ctx.revert();
  }, [selector]);
  return <div ref={ref} className={className}>{children}</div>;
}
