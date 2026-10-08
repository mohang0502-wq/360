import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Star, ChevronDown, ChevronUp,
  Scissors, Clock, Shield, RefreshCw, HeadphonesIcon,
  Zap, Award, Users, BarChart3, Upload, ChevronLeft, ChevronRight,
  Play
} from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import FileUpload from '../components/FileUpload';
import SectionHeader from '../components/SectionHeader';
import { beforeAfterPairs, serviceImages } from '../data/images';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';

// ─── Apple Cards Carousel ───────────────────────────────────────────────────
const trustCards = [
  {
    stat: '10K+',
    label: 'Images Edited',
    sub: 'Delivered with precision and care',
    bg: 'from-slate-800 to-slate-900',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
  },
  {
    stat: '120+',
    label: 'Happy Clients',
    sub: 'Brands, studios & agencies worldwide',
    bg: 'from-slate-700 to-slate-800',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
  },
  {
    stat: '4.9/5',
    label: 'Average Rating',
    sub: 'Consistently praised for quality',
    bg: 'from-slate-800 to-slate-900',
    img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80',
  },
  {
    stat: '10+',
    label: 'Years Experience',
    sub: 'Decade of manual editing expertise',
    bg: 'from-slate-700 to-slate-800',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
  {
    stat: '24hr',
    label: 'Turnaround',
    sub: 'Standard delivery on most projects',
    bg: 'from-slate-900 to-slate-primary',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    stat: '100%',
    label: 'Satisfaction',
    sub: 'We work until you are fully happy',
    bg: 'from-slate-800 to-slate-900',
    img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80',
  },
];

const manualServices = [
  { icon: Scissors, label: 'Clipping Path', desc: 'Pixel-perfect cutouts with clean edges', img: serviceImages.clippingPath },
  { icon: Shield, label: 'Background Removal', desc: 'Remove or replace backgrounds seamlessly', img: serviceImages.backgroundRemoval },
  { icon: Award, label: 'Product Retouching', desc: 'Clean, sharp, flawless product images', img: serviceImages.productRetouching },
  { icon: Star, label: 'High-End Retouching', desc: 'Natural skin, beauty & magazine quality', img: serviceImages.highEndRetouching },
  { icon: Users, label: 'Ghost Mannequin', desc: 'Neck joint & realistic 3D look', img: serviceImages.ghostMannequin },
  { icon: Zap, label: 'Jewelry Editing', desc: 'Brilliance, clarity & metal enhancement', img: serviceImages.jewelry },
  { icon: BarChart3, label: 'Fashion Retouching', desc: 'Editorial quality apparel retouching', img: serviceImages.fashion },
  { icon: RefreshCw, label: 'Furniture Editing', desc: 'Enhance colors, remove dust, perfect details', img: serviceImages.furniture },
  { icon: CheckCircle, label: 'Color Correction', desc: 'Accurate, consistent color across images', img: serviceImages.colorCorrection },
  { icon: Play, label: 'Shadow & Reflection', desc: 'Natural shadows and reflections added', img: serviceImages.shadow },
];

const whyChoose = [
  { icon: Scissors, title: 'Manual Expertise', desc: 'Skilled editors with years of hands-on experience' },
  { icon: Award, title: 'Premium Quality', desc: 'Pixel-perfect and 100% hand-edited results' },
  { icon: Clock, title: 'Fast Turnaround', desc: 'On-time delivery, always' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your images are safe with us' },
  { icon: RefreshCw, title: 'Unlimited Revisions', desc: 'We work until you are 100% satisfied' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: "We're here to help you anytime" },
];

const manualWorkflowSteps = [
  { num: '01', title: 'Receive Images & Brief', desc: 'Upload your images and share editing requirements' },
  { num: '02', title: 'Review Requirements', desc: 'We analyze and plan the best editing approach' },
  { num: '03', title: 'Manual Editing', desc: 'Expert editors work with precision and care' },
  { num: '04', title: 'Internal QC', desc: 'Multi-level quality assurance checks' },
  { num: '05', title: 'Client Review', desc: 'You review and approve the edited images' },
  { num: '06', title: 'Revisions', desc: 'Free revisions until you are fully satisfied' },
  { num: '07', title: 'Final Delivery', desc: 'Files delivered on time, every time' },
];

const aiServices = [
  { label: 'AI Model Generation', desc: 'Create realistic models for your brand', img: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=400&q=80' },
  { label: 'AI Product Photography', desc: 'Stunning product photos from assets', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80' },
  { label: 'AI Background Creation', desc: 'Generate any background you imagine', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { label: 'AI Lifestyle Images', desc: 'Create lifestyle scenes for marketing', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80' },
  { label: 'AI Fashion Models', desc: 'Virtual fashion models for your products', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80' },
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
  { q: 'Do you offer a free trial?', a: 'Yes! Send us 2–5 images and we\'ll provide a free sample edit with no obligation. Use the Free Trial form on this page to get started.' },
  { q: 'How many revisions do you provide?', a: 'We offer unlimited revisions until you are completely satisfied with the result. Your happiness is our priority.' },
  { q: 'Is my data and imagery secure?', a: 'Absolutely. We treat all client files with strict confidentiality. Your images are never shared or used without your explicit permission.' },
];

const brands = ['ZARA', 'Amazon', 'Myntra', 'AJIO', 'IKEA', 'Nykaa', 'Snapdeal', 'ZARA', 'Amazon', 'Myntra', 'AJIO', 'IKEA', 'Nykaa', 'Snapdeal'];

const iconMap = {
  Scissors,
  Shield,
  Award,
  Star,
  Users,
};

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-800 pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-500 flex-shrink-0" />}
      </button>
      {open && <p className="pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>}
    </div>
  );
}

// ─── Apple Cards Carousel ────────────────────────────────────────────────────
function AppleCardsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        <ChevronLeft size={18} className="text-slate-700" />
      </button>
      <div ref={scrollRef} className="apple-cards-scroll px-2">
        {trustCards.map((card, i) => (
          <div
            key={i}
            className={`apple-card w-72 h-48 rounded-2xl bg-gradient-to-br ${card.bg} overflow-hidden relative`}
          >
            <img src={card.img} alt={card.label} className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div className="text-4xl font-extrabold text-white">{card.stat}</div>
              <div>
                <div className="text-base font-bold text-white">{card.label}</div>
                <div className="text-sm text-white/60 mt-1">{card.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
      >
        <ChevronRight size={18} className="text-slate-700" />
      </button>
    </div>
  );
}

// ─── Free Trial Form ─────────────────────────────────────────────────────────
function FreeTrialForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name *</label>
          <input
            type="text"
            placeholder="Full name"
            required
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
          <input
            type="email"
            placeholder="you@company.com"
            required
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Service Required</label>
          <select className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">
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
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Approximate Volume</label>
          <select className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">
            <option value="">Images per month...</option>
            <option>1–50 images</option>
            <option>50–200 images</option>
            <option>200–500 images</option>
            <option>500–1000 images</option>
            <option>1000+ images</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Upload Sample Images</label>
        <FileUpload />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Instructions / Reference Notes</label>
        <textarea
          rows={3}
          placeholder="Describe your requirements, style references, or any special instructions..."
          className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-bold py-3.5 rounded-lg transition-colors text-sm"
      >
        Send Free Trial Request
      </button>
      <p className="text-xs text-slate-400 text-center">No credit card required · No obligation · Quick 24-hour delivery</p>
    </form>
  );
}

// ─── Main Home Page ──────────────────────────────────────────────────────────
export default function Home() {
  const { sections: home } = useSections('home', defaultCmsContent.home);
  const cms = { home };
  const [showcaseFilter, setShowcaseFilter] = useState('All');
  const showcaseFilters = ['All', 'Fashion', 'Product', 'Jewelry', 'Furniture'];
  const filteredPairs = showcaseFilter === 'All'
    ? cms.home.showcase
    : cms.home.showcase.filter(p => p.category === showcaseFilter);

  const hero = cms.home.hero;
  const coreServices = cms.home.coreServices.map((svc) => {
    const Icon = iconMap[svc.icon as keyof typeof iconMap] ?? Scissors;
    return {
      ...svc,
      img: svc.image,
      label: svc.title,
      desc: svc.description,
      icon: Icon,
    };
  });

  return (
    <div>
      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <section className="bg-white min-h-[calc(100vh-120px)] flex items-center">
        <div className="max-w-8xl mx-auto px-6 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                <span className="w-6 h-px bg-slate-300" />
                {hero.eyebrow}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-primary mb-6">
                {hero.title.split(' for ')[0]}<br />
                <span className="text-accent-red">{hero.title.includes(' for ') ? 'for ' + hero.title.split(' for ')[1] : 'for Every Image.'}</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                {hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/contact#trial"
                  className="inline-flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-6 py-3.5 rounded-lg transition-colors text-sm"
                >
                  {hero.ctaPrimary} <ArrowRight size={16} />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors text-sm"
                >
                  {hero.ctaSecondary}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'High-End Retouching',
                  'Perfect Color & Tone',
                  'Pixel Perfect Delivery',
                  'On-Time, Every Time',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle size={14} className="text-slate-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Before/After Box */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
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
              <div className="absolute -bottom-4 -right-4 bg-slate-primary text-white rounded-xl px-4 py-3 text-xs font-semibold shadow-xl">
                <div className="text-xl font-extrabold text-white">100%</div>
                <div className="text-white/70">Manual editing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand ticker */}
      <section className="bg-slate-primary py-5 overflow-hidden">
        <div className="flex items-center gap-3 mb-2 max-w-8xl mx-auto px-6">
          <span className="text-xs justify-center font-semibold text-white/40 uppercase tracking-widest whitespace-nowrap">Trusted by brands & studios worldwide</span>
        </div>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="text-lg font-extrabold text-white/30 hover:text-white/60 transition-colors mx-8 tracking-wider">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Apple Cards Carousel ─────────────────────────────── */}
      <section className="py-20 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Client Proof"
            title="Trusted Results, "
            highlight="Every Time"
            subtitle="Numbers that reflect our commitment to quality, consistency, and client satisfaction."
          />
          <AppleCardsCarousel />
        </div>
      </section>

      {/* ── Section 3: Manual Services ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Manual Image Editing"
            title="Core Editing "
            highlight="Services"
            subtitle="Human expertise, precision and visual judgment for flawless results — the foundation of everything we do."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {coreServices.map((svc) => (
              <div key={svc.label} className="card-hover rounded-xl overflow-hidden border border-slate-100 bg-white">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={svc.img} alt={svc.label} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svc.icon size={13} className="text-slate-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800">{svc.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/services/manual-editing"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-800 hover:bg-slate-50 px-6 py-3 rounded-lg transition-colors"
            >
              View All Manual Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Before/After Showcase ─────────────────────────────── */}
      <section className="py-20 bg-slate-primary">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <SectionHeader
              eyebrow="Real Results"
              title="Before / After "
              highlight="Showcase"
              subtitle="See the real transformation done by our professional manual editors."
              centered={false}
              light={true}
            />
            <div className="flex flex-wrap gap-2 flex-shrink-0">
              {showcaseFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setShowcaseFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    showcaseFilter === f
                      ? 'bg-white text-slate-900'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPairs.slice(0, 4).map((pair, i) => (
              <BeforeAfterSlider
                key={i}
                beforeSrc={pair.before}
                afterSrc={pair.after}
                caption={pair.caption}
                category={pair.category}
                aspectRatio="aspect-[16/10]"
                zoomable={true}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 bg-white hover:bg-off-white text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Explore All Work <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Why Choose ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Why Us"
            title="Why Choose "
            highlight="360° Retouching?"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {whyChoose.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon size={20} className="text-slate-700" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: How It Works Teaser ───────────────────────────────── */}
      <section className="py-20 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="lg:w-64 flex-shrink-0">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Our Simple Process</span>
              <h2 className="text-3xl font-extrabold text-slate-primary mb-3">How It Works</h2>
              <p className="text-sm text-slate-500 mb-6">Step-by-step workflow for smooth and reliable service.</p>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-800 px-5 py-2.5 rounded-lg transition-colors"
              >
                Learn More <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {manualWorkflowSteps.map((step, i) => (
                  <div key={step.num} className="relative">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-slate-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xs font-extrabold text-white">{step.num}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug mb-1">{step.title}</h4>
                      <p className="text-xs text-slate-500 leading-tight hidden lg:block">{step.desc}</p>
                    </div>
                    {i < manualWorkflowSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-5 left-1/2 right-0 h-px bg-slate-200 -translate-y-1/2 w-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Portfolio Teaser ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <SectionHeader
              eyebrow="Our Portfolio"
              title="Explore Our "
              highlight="Best Work"
              subtitle="High-quality results for every industry and category."
              centered={false}
            />
            <Link
              to="/portfolio"
              className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-800 px-5 py-2.5 rounded-lg transition-colors"
            >
              View Portfolio <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Fashion Editing', count: '120+', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80' },
              { label: 'Jewelry Editing', count: '80+', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
              { label: 'Product Editing', count: '150+', img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80' },
              { label: 'Furniture Editing', count: '70+', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
              { label: 'eCommerce Editing', count: '200+', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80' },
              { label: 'Retouching', count: '90+', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to="/portfolio"
                className="card-hover group relative rounded-xl overflow-hidden aspect-[3/4]"
              >
                <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-xs font-bold text-white">{cat.label}</p>
                  <p className="text-xs text-white/60">{cat.count} Projects</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 8: AI Services ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-deep">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="lg:w-80 flex-shrink-0">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">AI Powered Solutions</span>
              <h2 className="text-3xl font-extrabold text-white mb-3">
                AI <span className="text-slate-400">Services</span>
              </h2>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                Smarter content creation with advanced AI technology — a secondary service that complements our primary manual editing work.
              </p>
              <Link
                to="/services/ai-services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-5 py-2.5 rounded-lg transition-colors"
              >
                Explore AI Services <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiServices.map((svc) => (
                <div key={svc.label} className="rounded-xl overflow-hidden bg-white/5 border border-white/10 card-hover">
                  <div className="aspect-video overflow-hidden">
                    <img src={svc.img} alt={svc.label} className="w-full h-full object-cover opacity-70" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-0.5 bg-white/10 text-white/50 text-xs font-semibold rounded-full mb-2">AI Generated</span>
                    <h4 className="text-sm font-bold text-white">{svc.label}</h4>
                    <p className="text-xs text-white/50 mt-1">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 9: Free Trial Form ───────────────────────────────────── */}
      <section id="trial" className="py-20 bg-off-white scroll-mt-20">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeader
                eyebrow="Free Trial"
                title="Get a Free "
                highlight="Sample Edit"
                subtitle="Send us 2–5 images and receive a professionally edited sample with no obligation."
                centered={false}
              />
              <div className="space-y-4 mt-6">
                {[
                  { icon: CheckCircle, text: 'No credit card required' },
                  { icon: Clock, text: 'Quick 24-hour delivery' },
                  { icon: Shield, text: '100% free, no obligation' },
                  { icon: RefreshCw, text: 'Covers any of our manual editing services' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Request Your Free Sample Edit</h3>
              <FreeTrialForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 10: Testimonials ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="What Our Clients Say"
            title="Trusted by 120+ "
            highlight="Brands Worldwide"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-off-white rounded-xl p-6 border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-primary rounded-2xl p-6">
            {[
              { val: '10K+', label: 'Images Retouched' },
              { val: '120+', label: 'Happy Clients' },
              { val: '4.9/5', label: 'Average Rating' },
              { val: '10+', label: 'Years Experience' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-2">
                <div className="text-2xl font-extrabold text-white">{stat.val}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 11: FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 bg-off-white" id="faq">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="FAQ"
                title="Frequently Asked "
                highlight="Questions"
                centered={false}
              />
              <p className="text-sm text-slate-500 mb-4">
                Can't find your answer? <Link to="/contact" className="text-slate-800 underline">Contact us</Link>.
              </p>
            </div>
            <div className="divide-y divide-slate-100 bg-white rounded-xl p-6 border border-slate-100">
              {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
              <div className="pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  View All FAQs <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 12: Final CTA ─────────────────────────────────────────── */}
      <section className="py-20 bg-slate-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-4">Get Started Today</span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready for Professional<br />Image Editing?
          </h2>
          <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
            Join 120+ brands who trust 360° Retouching for precision manual editing. Start with a free trial — no credit card needed.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link
              to="/contact#trial"
              className="inline-flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Get a Free Trial <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-lg transition-colors border border-white/20"
            >
              Request a Quote
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}