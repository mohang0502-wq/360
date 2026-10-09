import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, CheckCircle, Star,
  Scissors, Clock, Shield, RefreshCw, HeadphonesIcon,
  Award, Users, Quote, ChevronLeft, ChevronRight,
} from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import FileUpload from '../components/FileUpload';
import {
  Reveal, Stagger, staggerItem, SplitWords, Parallax,
  Counter, ScrollProgress, LuxHeading, Marquee, Accordion, SmartImg, ease,
} from '../components/Premium';
import { ExpandOnScroll, HorizontalScroll, GsapBatch } from '../components/GsapEffects';
import { homeDefaults } from '../data/pageDefaults';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { submitContact } from '../services/cmsService';

const whyChoose = [
  { icon: Scissors, title: 'Manual Expertise', desc: 'Senior editors with years of hands-on craft — never batch automation.' },
  { icon: Award, title: 'Premium Quality', desc: 'Pixel-perfect, 100% hand-edited results that meet luxury brand standards.' },
  { icon: Clock, title: 'Fast Turnaround', desc: 'Dependable 24–48 hour delivery, with rush lanes for launches.' },
  { icon: Shield, title: 'Secure & Private', desc: 'NDA-ready workflows and strict confidentiality for every asset.' },
  { icon: RefreshCw, title: 'Unlimited Revisions', desc: 'We refine until every frame matches your vision.' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'A dedicated account manager across every time zone.' },
];

const manualWorkflowSteps = [
  { num: '01', title: 'Brief & Upload', desc: 'Share images, references and style guides.' },
  { num: '02', title: 'Review', desc: 'We plan the ideal editing approach.' },
  { num: '03', title: 'Manual Editing', desc: 'Experts retouch with precision and care.' },
  { num: '04', title: 'Internal QC', desc: 'Multi-level senior quality assurance.' },
  { num: '05', title: 'Client Review', desc: 'You review and approve every frame.' },
  { num: '06', title: 'Revisions', desc: 'Refinements until fully satisfied.' },
  { num: '07', title: 'Delivery', desc: 'Final files, on time, every time.' },
];

const testimonials = [
  {
    name: 'Rohit Sharma',
    role: 'E-commerce Manager, IndiaMart',
    quote: 'The quality, communication and turnaround time are outstanding. 360° Retouching is our go-to partner for all image editing needs.',
    rating: 5,
  },
  {
    name: 'Priya Mehta',
    role: 'Creative Director, Fashion Studio',
    quote: "We've worked with many retouching services but 360° Retouching stands out for their attention to detail and consistency.",
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Owner, JW Jewelry',
    quote: 'Our jewelry photography has been transformed completely. The metal enhancement and detail work is exceptional.',
    rating: 5,
  },
];

const faqs = [
  { q: 'What types of images do you edit?', a: 'We edit all types of product, fashion, jewelry, furniture, and e-commerce images. Our manual editing team handles everything from simple background removal to complex high-end retouching.' },
  { q: 'How long does editing take?', a: 'Standard turnaround is 24–48 hours for most projects. Rush delivery is available for time-sensitive orders. Larger volume projects will have custom timelines.' },
  { q: 'Do you offer a free trial?', a: "Yes! Send us 2–5 images and we'll provide a free sample edit with no obligation. Use the Free Trial form on this page to get started." },
  { q: 'How many revisions do you provide?', a: 'We offer unlimited revisions until you are completely satisfied with the result. Your happiness is our priority.' },
  { q: 'Is my data and imagery secure?', a: 'Absolutely. We treat all client files with strict confidentiality. Your images are never shared or used without your explicit permission.' },
];

const brands = ['ZARA', 'Amazon', 'Myntra', 'AJIO', 'IKEA', 'Nykaa', 'Snapdeal'];

const heroStats = [
  { val: '10K+', label: 'Images edited' },
  { val: '120+', label: 'Global brands' },
  { val: '4.9/5', label: 'Client rating' },
];

// ─── Free Trial Form ─────────────────────────────────────────────────────────
function FreeTrialForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const send = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const v = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setStatus('sending');
    setError('');
    try {
      await submitContact({
        name: v.name || '',
        email: v.email || '',
        company: '',
        phone: '',
        service: v.service || '',
        message: [
          'Free sample edit request',
          v.volume ? `Approximate volume: ${v.volume}` : '',
          v.sampleFiles ? `Sample files selected: ${v.sampleFiles}` : '',
          v.sampleLink ? `Sample files link: ${v.sampleLink}` : '',
          '',
          v.notes || '(no instructions provided)',
        ].filter((line, i) => line || i === 4).join('\n'),
      });
      form.reset();
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send your request. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="py-10 text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white">
          <CheckCircle size={28} />
        </span>
        <h4 className="text-2xl font-semibold text-ink">Request <span className="lux-serif text-accent-red">received.</span></h4>
        <p className="mt-2 text-sm text-slate-500">We'll reply within 24 hours with next steps for your free sample edit.</p>
        <button type="button" onClick={() => setStatus('idle')} className="lux-btn lux-btn-ghost mt-8">Send another request</button>
      </motion.div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={send}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Your Name *</span>
          <input name="name" type="text" placeholder="Full name" required maxLength={150} autoComplete="name" className="lux-input" />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address *</span>
          <input name="email" type="email" placeholder="you@company.com" required maxLength={255} autoComplete="email" className="lux-input" />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Service Required</span>
          <select name="service" className="lux-input">
            <option value="">Select a service...</option>
            <option>Clipping Path</option>
            <option>Background Removal</option>
            <option>Product Retouching</option>
            <option>High-End Retouching</option>
            <option>Ghost Mannequin</option>
            <option>Jewelry Editing</option>
            <option>Fashion Retouching</option>
            <option>Furniture Editing</option>
            <option>Color Correction</option>
            <option>AI Services</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Approximate Volume</span>
          <select name="volume" className="lux-input">
            <option value="">Images per month...</option>
            <option>1–50 images</option>
            <option>50–200 images</option>
            <option>200–500 images</option>
            <option>500–1000 images</option>
            <option>1000+ images</option>
          </select>
        </label>
      </div>
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Sample Images</span>
        <FileUpload />
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Instructions / Reference Notes</span>
        <textarea
          name="notes"
          rows={3}
          maxLength={4000}
          placeholder="Describe your requirements, style references, or any special instructions..."
          className="lux-input resize-none"
        />
      </label>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === 'sending'} className="lux-btn lux-btn-primary w-full justify-center disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : <>Send Free Trial Request <ArrowRight size={16} /></>}
      </button>
      <p className="text-center text-xs text-slate-400">No credit card required · No obligation · Quick 24-hour delivery</p>
    </form>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ hero, gallery }: { hero: typeof homeDefaults.hero; gallery: typeof homeDefaults.heroGallery }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);
  const visualY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Subtle mouse-follow tilt on the visual
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 100, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 100, damping: 20 });

  const [lead, tail] = hero.title.includes(' for ')
    ? [hero.title.split(' for ')[0], 'for ' + hero.title.split(' for ')[1]]
    : [hero.title, ''];

  return (
    <section ref={ref} className="lux-glow relative overflow-hidden">
      <div className="lux-grid-lines pointer-events-none absolute inset-0" />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-[#C9A96E]/10 blur-3xl"
      />
      <div className="lux-container relative grid items-center gap-12 py-12 lg:min-h-[calc(100vh-110px)] lg:grid-cols-12 lg:py-10">
        <motion.div style={{ y: textY, opacity: fade }} className="lg:col-span-6">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-hairline bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-red opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-red" />
            </span>
            {hero.eyebrow}
          </motion.span>

          <h1 className="text-[2.9rem] font-semibold leading-[1] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[5.6rem]">
            <SplitWords text={lead} delay={0.1} />
            {tail && (
              <>
                <br />
                <SplitWords text={tail} className="lux-serif text-accent-red" delay={0.35} />
              </>
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-slate-500"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link to="/contact#trial" className="lux-btn lux-btn-primary">
              {hero.ctaPrimary} <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="lux-btn lux-btn-ghost">
              {hero.ctaSecondary}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 grid max-w-md grid-cols-3 divide-x divide-hairline border-t border-hairline pt-8"
          >
            {heroStats.map((s) => (
              <div key={s.label} className="px-4 first:pl-0">
                <Counter value={s.val} className="block text-3xl font-semibold tracking-tight text-ink" />
                <span className="mt-1 block text-xs text-slate-400">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          className="relative lg:col-span-6"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onMouseLeave={() => { mx.set(0); my.set(0); }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94, clipPath: 'inset(8% 8% 8% 8% round 2rem)' }}
            animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
            transition={{ duration: 1.4, delay: 0.2, ease }}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            className="relative rounded-[2rem] border border-white bg-white p-3 shadow-[0_50px_100px_-40px_rgba(17,19,24,0.45)]"
          >
            <div className="overflow-hidden rounded-[1.5rem]">
              <BeforeAfterSlider
                beforeSrc={hero.beforeImage}
                afterSrc={hero.afterImage}
                beforeAlt={hero.beforeLabel}
                afterAlt={hero.afterLabel}
                caption="Professional Fashion Retouching"
                aspectRatio="aspect-[4/3]"
                zoomable={true}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.1, ease }}
            className="absolute -right-3 top-10 hidden rounded-2xl border border-hairline bg-white/90 px-5 py-4 shadow-xl backdrop-blur sm:block"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className="fill-[#C9A96E] text-[#C9A96E]" />)}
            </div>
            <p className="mt-1.5 text-xs font-semibold text-ink">Rated 4.9 by 120+ brands</p>
            <div className="mt-3 flex -space-x-2">
              {gallery.avatars.slice(0, 4).map((avatar, i) => (
                <SmartImg key={`${avatar.src}-${i}`} src={avatar.src} alt={avatar.alt} className="h-7 w-7 rounded-full border-2 border-white object-cover" />
              ))}
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-ink text-[9px] font-bold text-white">+120</span>
            </div>
          </motion.div>

          {/* floating detail tile */}
          <motion.div
            initial={{ opacity: 0, y: -30, rotate: 8 }}
            animate={{ opacity: 1, y: 0, rotate: 5 }}
            transition={{ duration: 1.1, delay: 1, ease }}
            className="absolute -top-8 left-6 hidden w-32 rounded-2xl border-[5px] border-white bg-white shadow-2xl xl:block"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-xl">
              <SmartImg src={gallery.detailImage.src} alt={gallery.detailImage.alt} className="h-full w-full object-cover" />
            </div>
            <p className="px-1 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{gallery.detailLabel}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.25, ease }}
            className="absolute -bottom-6 -left-4 flex items-center gap-4 rounded-2xl bg-ink px-5 py-4 text-white shadow-2xl"
          >
            <span className="lux-serif text-4xl leading-none">100%</span>
            <span className="text-xs leading-tight text-white/60">Hand-crafted<br />manual editing</span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 lg:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-hairline">
          <motion.span
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 h-1/2 bg-ink"
          />
        </span>
      </motion.div>
    </section>
  );
}

// ─── Process timeline with scroll-drawn line ─────────────────────────────────
function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 50%'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="lux-container">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <LuxHeading eyebrow="Our Process" title="A seven-step craft," highlight="refined over a decade." />
          <Reveal>
            <Link to="/how-it-works" className="lux-btn lux-btn-ghost flex-shrink-0">
              How It Works <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div ref={ref} className="relative">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-hairline lg:block" />
          <motion.div style={{ scaleX }} className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-ink lg:block" />
          <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:grid-cols-7" gap={0.1}>
            {manualWorkflowSteps.map((step) => (
              <motion.div key={step.num} variants={staggerItem} className="group relative">
                <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white text-xs font-bold text-ink transition-all duration-500 group-hover:scale-110 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                  {step.num}
                </div>
                <h4 className="text-sm font-semibold text-ink">{step.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials carousel ───────────────────────────────────────────────────
function Testimonials() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [index]);
  const t = testimonials[index];

  return (
    <section className="relative overflow-hidden bg-sand py-16 lg:py-20">
      <div className="lux-container">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LuxHeading eyebrow="Client Voices" title="Trusted by" highlight="120+ brands." />
            <Reveal delay={0.2}>
              <div className="mt-10 flex gap-3">
                <button
                  onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-ink hover:text-white"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setIndex((index + 1) % testimonials.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-ink hover:text-white"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </Reveal>
          </div>
          <div className="relative min-h-[20rem] lg:col-span-8">
            <Quote size={64} className="absolute -top-4 left-0 text-[#C9A96E]/30" />
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.8, ease }}
                className="relative pt-12"
              >
                <blockquote className="lux-serif text-3xl leading-[1.25] text-ink sm:text-4xl lg:text-[2.75rem]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{t.name[0]}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.name}</span>
                    <span className="block text-xs text-slate-500">{t.role}</span>
                  </span>
                  <span className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="fill-[#C9A96E] text-[#C9A96E]" />)}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="mt-10 flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10" aria-label={`Testimonial ${i + 1}`}>
                  {i === index && (
                    <motion.span
                      key={index}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 7, ease: 'linear' }}
                      className="block h-full bg-ink"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Home Page ──────────────────────────────────────────────────────────
export default function Home() {
  const { sections: home } = useSections('home', homeDefaults);
  const [showcaseFilter, setShowcaseFilter] = useState('All');
  const showcaseFilters = ['All', 'Fashion', 'Product', 'Jewelry', 'Furniture'];
  const filteredPairs = showcaseFilter === 'All'
    ? home.showcase
    : home.showcase.filter((p) => p.category === showcaseFilter);
  const trustItems = home.trust?.items?.length ? home.trust.items : defaultCmsContent.home.trust.items;

  return (
    <div className="bg-white">
      <ScrollProgress />
      <Hero hero={home.hero} gallery={home.heroGallery} />

      {/* ── Brand marquee ─────────────────────────────────────────────────── */}
      <section className="border-y border-hairline bg-white py-10">
        <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
          Trusted by brands & studios worldwide
        </p>
        <Marquee items={brands} />
      </section>

      {/* ── Manifesto + stats ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="lux-container">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal><span className="lux-eyebrow mb-8">Our Standard</span></Reveal>
              <p className="text-3xl font-medium leading-[1.25] tracking-[-0.02em] text-ink sm:text-4xl lg:text-5xl">
                <SplitWords text="Every image is a brand promise. We treat each one with" />{' '}
                <SplitWords text="obsessive, human precision" className="lux-serif text-accent-red" delay={0.4} />{' '}
                <SplitWords text="— at global scale." delay={0.6} />
              </p>
            </div>
            <Stagger className="grid grid-cols-2 gap-px self-end overflow-hidden rounded-3xl border border-hairline bg-hairline lg:col-span-5">
              {trustItems.slice(0, 4).map((item) => (
                <motion.div key={item.label} variants={staggerItem} className="bg-white p-7">
                  <Counter value={item.stat} className="block text-4xl font-semibold tracking-tight text-ink" />
                  <span className="mt-2 block text-sm font-semibold text-ink">{item.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-400">{item.sub}</span>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── Core services ─────────────────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <LuxHeading
              eyebrow="Manual Image Editing"
              title="Core editing"
              highlight="services."
              subtitle="Human expertise, precision and visual judgment — the foundation of everything we do."
            />
            <Reveal>
              <Link to="/services/manual-editing" className="lux-btn lux-btn-ghost flex-shrink-0">
                All Manual Services <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
          <GsapBatch className="grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-4">
            {home.coreServices.map((svc, i) => (
              <Link
                key={svc.title}
                data-batch
                to="/services/manual-editing"
                className={`lux-img-zoom group relative block overflow-hidden rounded-[1.75rem] bg-sand shadow-[0_24px_50px_-30px_rgba(17,19,24,0.45)] ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
              >
                <SmartImg src={svc.image} alt={svc.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/90" />
                <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
                <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-bold tabular-nums text-white backdrop-blur-md">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                  <ArrowUpRight size={16} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className={`font-semibold text-white ${i === 0 ? 'text-3xl sm:text-4xl' : 'text-lg'}`}>
                    {i === 0 ? <span className="lux-serif">{svc.title}</span> : svc.title}
                  </h3>
                  <p className={`mt-1.5 text-sm leading-relaxed text-white/75 transition-all duration-500 ${i === 0 ? 'max-w-sm' : 'max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100'}`}>
                    {svc.description}
                  </p>
                </div>
              </Link>
            ))}
          </GsapBatch>
        </div>
      </section>

      {/* ── Parallax statement band ───────────────────────────────────────── */}
      <section className="relative bg-white py-6">
        <div className="px-3 sm:px-5">
          <ExpandOnScroll className="relative h-[78vh] min-h-[480px] w-full">
            <SmartImg
              data-expand-img
              src={home.statement.image || home.hero.afterImage}
              alt={home.statement.imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/0" />
            <div className="absolute bottom-8 right-8 hidden gap-3 lg:flex">
              {home.statement.thumbnails.slice(0, 3).map((thumb, i) => (
                <Reveal key={`${thumb.src}-${i}`} delay={0.2 + i * 0.1}>
                  <div className="h-32 w-24 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                    <SmartImg src={thumb.src} alt={thumb.alt} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-xl px-8 sm:px-16">
                <span className="lux-eyebrow mb-6">{home.statement.eyebrow}</span>
                <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl">
                  <SplitWords text="Every pixel," /> <br />
                  <SplitWords text="considered." className="lux-serif text-accent-red" delay={0.2} />
                </h2>
                <Reveal delay={0.3}>
                  <ul className="mt-8 space-y-3">
                    {['High-end retouching', 'Perfect color & tone', 'Pixel-perfect delivery', 'On time, every time'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium text-ink">
                        <CheckCircle size={16} className="text-accent-red" /> {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </ExpandOnScroll>
        </div>
      </section>

      {/* ── Before / After showcase ───────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="lux-container">
          <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <LuxHeading eyebrow="Real Results" title="Before & after," highlight="side by side." subtitle="Drag to reveal real transformations by our professional manual editors." />
            <Reveal>
              <div className="flex flex-wrap gap-1 rounded-full border border-hairline bg-ivory p-1">
                {showcaseFilters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setShowcaseFilter(f)}
                    className={`relative rounded-full px-4 py-2 text-xs font-semibold transition-colors ${showcaseFilter === f ? 'text-white' : 'text-slate-500 hover:text-ink'}`}
                  >
                    {showcaseFilter === f && (
                      <motion.span layoutId="home-showcase-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                    )}
                    <span className="relative">{f}</span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredPairs.slice(0, 4).map((pair) => (
                <motion.div
                  key={pair.caption + pair.before}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease }}
                  className="overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-2 shadow-[0_30px_60px_-40px_rgba(17,19,24,0.35)]"
                >
                  <div className="overflow-hidden rounded-[1.35rem]">
                    <BeforeAfterSlider
                      beforeSrc={pair.before}
                      afterSrc={pair.after}
                      caption={pair.caption}
                      category={pair.category}
                      aspectRatio="aspect-[16/10]"
                      zoomable={true}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <Reveal className="mt-10 text-center">
            <Link to="/portfolio" className="lux-btn lux-btn-primary">
              Explore All Work <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Why choose ────────────────────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <LuxHeading eyebrow="Why 360°" title="Built for brands that" highlight="refuse to compromise." align="center" className="mb-10" />
          <Stagger className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item) => (
              <motion.div key={item.title} variants={staggerItem} className="group relative bg-white p-10 transition-colors duration-500 hover:bg-ivory">
                <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-ivory text-ink transition-all duration-500 group-hover:-translate-y-1 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                  <item.icon size={22} strokeWidth={1.6} />
                </span>
                <h4 className="text-lg font-semibold text-ink">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-red transition-all duration-700 group-hover:w-full" />
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <Process />

      {/* ── Portfolio teaser with offset parallax columns ─────────────────── */}
      <section className="overflow-hidden bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <LuxHeading eyebrow="Our Portfolio" title="Work across" highlight="every category." subtitle="High-quality results for every industry we serve." />
            <Reveal>
              <Link to="/portfolio" className="lux-btn lux-btn-ghost flex-shrink-0">
                View Portfolio <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {home.portfolioCategories.items.map((cat, i) => (
              <Parallax key={cat.label} offset={i % 3 === 1 ? 60 : 20} className={i % 3 === 1 ? 'lg:mt-16' : ''}>
                <Link to="/portfolio" className="lux-img-zoom group relative block aspect-[3/4] overflow-hidden rounded-[1.75rem]">
                  <SmartImg src={cat.image} alt={cat.alt || cat.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <div>
                      <p className="lux-serif text-3xl text-white sm:text-4xl">{cat.label}</p>
                      <p className="mt-1 text-xs font-medium text-white/70">{cat.count} Projects</p>
                    </div>
                    <span className="flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </Link>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI services (GSAP pinned horizontal scroll) ───────────────────── */}
      <HorizontalScroll
        header={
          <div className="lux-container">
            <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <LuxHeading
                eyebrow="AI-Powered Solutions"
                title="Intelligent content,"
                highlight="human-curated."
                subtitle="A complementary service to our manual craft — AI imagery reviewed and refined by our editors."
              />
              <Reveal>
                <Link to="/services/ai-services" className="lux-btn lux-btn-ghost flex-shrink-0">
                  Explore AI Services <ArrowRight size={15} />
                </Link>
              </Reveal>
            </div>
          </div>
        }
      >
        {home.aiServices.items.map((svc, i) => (
          <div key={svc.label} className={`w-[78vw] flex-shrink-0 sm:w-[20rem] lg:w-[24rem] ${i % 2 ? 'lg:mt-12' : ''}`}>
            <div className="lux-img-zoom group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-[0_30px_60px_-35px_rgba(17,19,24,0.5)]">
              <SmartImg src={svc.image} alt={svc.alt || svc.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                AI Generated
              </span>
              <span className="lux-serif absolute right-5 top-3 text-5xl text-white/40">{String(i + 1).padStart(2, '0')}</span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h4 className="text-xl font-semibold text-white">{svc.label}</h4>
                <p className="mt-1 text-sm text-white/70">{svc.desc}</p>
              </div>
            </div>
          </div>
        ))}
        <Link
          to="/services/ai-services"
          className="group flex aspect-[4/5] w-[60vw] flex-shrink-0 flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-ink/20 bg-ivory text-center sm:w-[16rem] lg:w-[18rem]"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight size={22} />
          </span>
          <span className="lux-serif mt-6 text-3xl text-ink">See all</span>
          <span className="mt-1 text-xs text-slate-500">AI services</span>
        </Link>
      </HorizontalScroll>

      <Testimonials />

      {/* ── Free trial ────────────────────────────────────────────────────── */}
      <section id="trial" className="scroll-mt-20 bg-white py-16 lg:py-20">
        <div className="lux-container">
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:sticky lg:top-32 lg:col-span-5">
              <LuxHeading
                eyebrow="Complimentary Trial"
                title="Experience the"
                highlight="360° standard."
                subtitle="Send us 2–5 images and receive a professionally edited sample — no obligation."
              />
              <Stagger className="mt-10 space-y-4">
                {[
                  { icon: CheckCircle, text: 'No credit card required' },
                  { icon: Clock, text: 'Quick 24-hour delivery' },
                  { icon: Shield, text: '100% free, no obligation' },
                  { icon: Users, text: 'Covers any of our manual editing services' },
                ].map(({ icon: Icon, text }) => (
                  <motion.div key={text} variants={staggerItem} className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-ivory">
                      <Icon size={16} className="text-ink" />
                    </span>
                    <span className="text-sm font-medium text-slate-600">{text}</span>
                  </motion.div>
                ))}
              </Stagger>
            </div>
            <Reveal className="lg:col-span-7">
              <div className="rounded-[2rem] border border-hairline bg-ivory p-6 shadow-[0_40px_80px_-50px_rgba(17,19,24,0.35)] sm:p-10">
                <h3 className="mb-8 text-xl font-semibold text-ink">Request your free sample edit</h3>
                <FreeTrialForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <LuxHeading eyebrow="FAQ" title="Questions," highlight="answered." />
              <Reveal delay={0.2}>
                <p className="mt-6 text-sm text-slate-500">
                  Can't find your answer?{' '}
                  <Link to="/contact" className="font-semibold text-ink underline decoration-accent-red underline-offset-4">Contact us</Link>.
                </p>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-8">
              <Accordion items={faqs} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-24">
        <div className="lux-grid-lines pointer-events-none absolute inset-0" />
        <div className="lux-container relative text-center">
          <Reveal><span className="lux-eyebrow mb-8">Get Started Today</span></Reveal>
          <h2 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1] tracking-[-0.045em] text-ink sm:text-7xl lg:text-[6.5rem]">
            <SplitWords text="Ready for" /> <SplitWords text="flawless" className="lux-serif text-accent-red" delay={0.15} /> <SplitWords text="imagery?" delay={0.25} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-xl text-lg text-slate-500">
              Join 120+ brands who trust 360° Retouching for precision manual editing. Start with a free trial — no credit card needed.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Link to="/contact#trial" className="lux-btn lux-btn-primary">
                Get a Free Trial <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="lux-btn lux-btn-ghost">
                Request a Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
