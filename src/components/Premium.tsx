import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { ArrowRight, ImageOff, Plus } from 'lucide-react';

// Shared motion + layout primitives for the premium marketing pages
// (Home, Services, Portfolio, About, Contact).

export const ease = [0.22, 1, 0.36, 1] as const;

// ─── Reveal: fade + rise when scrolled into view ─────────────────────────────
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'span' | 'section';
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Comp>
  );
}

// ─── Stagger: children animate one after another ─────────────────────────────
export function Stagger({ children, className = '', gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

// ─── SplitWords: headline revealed word-by-word from a mask ──────────────────
export function SplitWords({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  // Observe the wrapper, not the masked words: words start translated outside
  // their overflow-hidden mask, so observing them directly never fires.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const words = text.split(' ').filter(Boolean);
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            animate={inView || reduce ? { y: '0%' } : undefined}
            transition={{ duration: 1, delay: delay + i * 0.06, ease }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Parallax: content drifts against scroll ─────────────────────────────────
export function Parallax({
  children,
  offset = 80,
  className = '',
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [offset, -offset]);
  const smooth = useSpring(y, { stiffness: 80, damping: 20, mass: 0.4 });
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smooth }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

// ─── SmartImg: <img> that degrades to a neutral placeholder ──────────────────
// Empty or failing sources (missing upload, dead remote URL) render a clean
// tinted block instead of the browser's broken-image icon.
export function ImagePlaceholder({ label = '', className = '' }: { label?: string; className?: string }) {
  return (
    <span role="img" aria-label={label} className={`flex items-center justify-center bg-gradient-to-br from-sand to-ivory text-slate-300 ${className}`}>
      <ImageOff size={22} strokeWidth={1.5} />
    </span>
  );
}

export function SmartImg({ src, alt = '', className = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) return <ImagePlaceholder label={alt} className={className} />;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}

// ─── ParallaxImage: image scaled up and panned inside a clipped frame ────────
export function ParallaxImage({
  src,
  alt,
  className = '',
  strength = 12,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : [`-${strength}%`, `${strength}%`]);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {src && !failed ? (
        <motion.img
          src={src}
          alt={alt}
          style={{ y, scale: 1 + (strength * 2.4) / 100 }}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImagePlaceholder label={alt} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}

// ─── ClipReveal: image unveiled with a curtain wipe ──────────────────────────
export function ClipReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.3, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

// ─── Counter: animates the numeric part of "10K+", "4.9/5", "24hr" ──────────
export function Counter({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [display, setDisplay] = useState(match && !reduce ? `${match[1]}0${match[3]}` : value);

  useEffect(() => {
    if (!inView || !match || reduce) {
      if (reduce) setDisplay(value);
      return;
    }
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num);
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const controls = animate(0, target, {
      duration: 2,
      ease,
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return <span ref={ref} className={className}>{display}</span>;
}

// ─── ScrollProgress: thin accent line pinned under the navbar ────────────────
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent-red via-[#C9A96E] to-ink"
    />
  );
}

// ─── Section heading ─────────────────────────────────────────────────────────
export function LuxHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className="lux-eyebrow mb-5">{eyebrow}</span>
        </Reveal>
      )}
      <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.5rem]">
        <SplitWords text={title} />
        {highlight && (
          <>
            {' '}
            <SplitWords text={highlight} className="lux-serif text-accent-red" delay={0.15} />
          </>
        )}
      </h2>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className={`mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg ${centered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

// ─── LuxFrame: rich image frame — inner hairline, sheen, caption on hover ────
export function LuxFrame({
  src,
  alt,
  className = '',
  label,
  sub,
  parallax = true,
  rounded = 'rounded-[1.75rem]',
}: {
  src: string;
  alt: string;
  className?: string;
  label?: string;
  sub?: string;
  parallax?: boolean;
  rounded?: string;
}) {
  return (
    <div className={`group relative overflow-hidden bg-sand ${rounded} ${className}`}>
      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]">
        {parallax ? (
          <ParallaxImage src={src} alt={alt} className="absolute inset-0 h-full w-full" strength={8} />
        ) : (
          <SmartImg src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      {/* sheen sweep */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100" />
      <span className={`pointer-events-none absolute inset-0 ${rounded} ring-1 ring-inset ring-black/5`} />
      {(label || sub) && (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-white/85 px-4 py-3 backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
          <div className="min-w-0">
            {label && <p className="truncate text-sm font-semibold text-ink">{label}</p>}
            {sub && <p className="truncate text-[11px] text-slate-500">{sub}</p>}
          </div>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
            <ArrowRight size={13} className="-rotate-45" />
          </span>
        </div>
      )}
    </div>
  );
}

// ─── PageHero: light, editorial hero for inner pages with image collage ──────
export function PageHero({
  crumb,
  eyebrow,
  title,
  highlight,
  subtitle,
  images = [],
  stats = [],
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  images?: Array<string | { src: string; alt?: string }>;
  stats?: Array<{ val: string; label: string }>;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);
  const backY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);
  const frontY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -140]);
  const [main, second, third] = images
    .map((img) => (typeof img === 'string' ? { src: img, alt: '' } : { src: img.src, alt: img.alt || '' }))
    .filter((img) => img.src);

  return (
    <section ref={ref} className="lux-glow relative overflow-hidden">
      <div className="lux-grid-lines pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-20 top-0 h-[30rem] w-[30rem] rounded-full bg-accent-red/[0.06] blur-3xl"
      />
      <div className={`lux-container relative grid items-center gap-10 pb-14 pt-10 lg:gap-12 lg:pb-16 lg:pt-14 ${main ? 'lg:grid-cols-12' : ''}`}>
        <motion.div style={{ y: textY }} className={main ? 'lg:col-span-6' : 'max-w-4xl'}>
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-400 backdrop-blur"
          >
            <Link to="/" className="transition-colors hover:text-ink">Home</Link>
            <span className="h-px w-3 bg-slate-300" />
            <span className="text-ink">{crumb}</span>
          </motion.nav>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="lux-eyebrow mb-4 flex"
          >
            {eyebrow}
          </motion.span>
          <h1 className="text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-[4.5rem]">
            <SplitWords text={title} delay={0.15} />
            {highlight && (
              <>
                <br />
                <SplitWords text={highlight} className="lux-serif text-accent-red" delay={0.35} />
              </>
            )}
          </h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
              className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg"
            >
              {subtitle}
            </motion.p>
          )}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease }}
              className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline"
            >
              {stats.map((s) => (
                <div key={s.label} className="bg-white/80 px-4 py-4 backdrop-blur">
                  <Counter value={s.val} className="block text-2xl font-semibold tracking-tight text-ink" />
                  <span className="mt-0.5 block text-[11px] text-slate-500">{s.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {main && (
          <div className="relative h-[26rem] sm:h-[32rem] lg:col-span-6 lg:h-[36rem]">
            {/* main image */}
            <motion.div
              style={{ y: backY }}
              initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0% round 2rem)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
              transition={{ duration: 1.4, delay: 0.2, ease }}
              className="absolute inset-y-0 right-0 w-[78%] overflow-hidden rounded-[2rem] shadow-[0_50px_100px_-40px_rgba(17,19,24,0.5)]"
            >
              <LuxFrame src={main.src} alt={main.alt || crumb} className="h-full w-full" rounded="rounded-[2rem]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/25 via-transparent to-transparent" />
            </motion.div>

            {/* floating secondary tile */}
            {second && (
              <motion.div
                style={{ y: frontY }}
                initial={{ opacity: 0, x: -40, rotate: -6 }}
                animate={{ opacity: 1, x: 0, rotate: -4 }}
                transition={{ duration: 1.2, delay: 0.7, ease }}
                className="absolute bottom-10 left-0 w-[42%] rounded-[1.5rem] border-[6px] border-white bg-white shadow-[0_30px_60px_-20px_rgba(17,19,24,0.45)]"
              >
                <LuxFrame src={second.src} alt={second.alt} parallax={false} className="aspect-[4/5] w-full" rounded="rounded-[1.1rem]" />
              </motion.div>
            )}

            {/* small third tile */}
            {third && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.9, ease }}
                className="absolute left-[8%] top-4 hidden w-[26%] rounded-2xl border-[5px] border-white bg-white shadow-xl sm:block"
              >
                <LuxFrame src={third.src} alt={third.alt} parallax={false} className="aspect-square w-full" rounded="rounded-xl" />
              </motion.div>
            )}

            {/* rotating seal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.1, ease }}
              className="absolute -bottom-2 right-6 z-10 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl"
            >
              <motion.svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <path id={`seal-${crumb}`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-ink text-[9px] font-bold uppercase tracking-[0.3em]">
                  <textPath href={`#seal-${crumb}`}>360° Retouching · Hand Crafted · </textPath>
                </text>
              </motion.svg>
              <span className="lux-serif text-3xl text-accent-red">360°</span>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Marquee ─────────────────────────────────────────────────────────────────
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <div className="lux-marquee">
        {loop.map((item, i) => (
          <span key={i} className="mx-10 flex items-center gap-10 whitespace-nowrap text-2xl font-semibold tracking-tight text-slate-300 transition-colors hover:text-ink sm:text-3xl">
            {item}
            <span className="lux-serif text-xl text-[#C9A96E]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Accordion (FAQ) with animated height ────────────────────────────────────
export function Accordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-hairline border-y border-hairline">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex items-baseline gap-5">
                <span className="text-xs font-semibold tabular-nums text-slate-300">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-base font-semibold text-ink transition-colors group-hover:text-accent-red sm:text-lg">{item.q}</span>
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.4, ease }}
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${isOpen ? 'border-ink bg-ink text-white' : 'border-hairline text-ink'}`}
              >
                <Plus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 pl-10 text-sm leading-relaxed text-slate-500 sm:text-base">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── CTA band shared by inner pages ──────────────────────────────────────────
export function CtaBand({
  title = 'Ready to elevate',
  highlight = 'every image?',
  subtitle = 'Start with a complimentary sample edit and experience the 360° standard first-hand.',
}: {
  title?: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="lux-container">
        <Reveal>
          <div className="lux-glow relative overflow-hidden rounded-[2.5rem] border border-hairline px-6 py-14 text-center sm:px-16 lg:py-20">
            <div className="lux-grid-lines pointer-events-none absolute inset-0" />
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-dashed border-[#C9A96E]/40"
            />
            <div className="relative">
              <span className="lux-eyebrow mb-6">Begin a partnership</span>
              <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
                <SplitWords text={title} /> <SplitWords text={highlight} className="lux-serif text-accent-red" delay={0.2} />
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base text-slate-500 sm:text-lg">{subtitle}</p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link to="/contact#trial" className="lux-btn lux-btn-primary">
                  Get a Free Trial <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="lux-btn lux-btn-ghost">
                  Talk to Our Team
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
