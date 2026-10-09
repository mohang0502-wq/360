import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import {
  PageHero, Reveal, LuxHeading, ScrollProgress, ParallaxImage, ClipReveal, CtaBand, SmartImg, ease,
} from '../components/Premium';
import { beforeAfterPairs, portfolioImages, aiBeforeAfterPairs } from '../data/images';
import { portfolioDefaults } from '../data/pageDefaults';
import { useSections } from '../hooks/useSections';
import { getPortfolio, getCategories, categoryLabel, type PortfolioItem, type Category } from '../services/cmsService';

const defaultFilterCategories = [
  'All', 'Fashion', 'Jewelry', 'Furniture', 'Product', 'Ghost Mannequin',
  'Clipping Path', 'Retouching', 'Color Correction',
];

export default function Portfolio() {
  const { sections: cms } = useSections('portfolio', portfolioDefaults);
  const [activeFilter, setActiveFilter] = useState('All');
  const [liveManual, setLiveManual] = useState<PortfolioItem[]>([]);
  const [liveAi, setLiveAi] = useState<PortfolioItem[]>([]);
  const [liveCategories, setLiveCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    getPortfolio('manual').then(setLiveManual).catch(() => {});
    getPortfolio('ai').then(setLiveAi).catch(() => {});
    getCategories('portfolio').then(setLiveCategories).catch(() => {});
  }, []);

  const filterCategories = liveCategories.length
    ? ['All', ...liveCategories.filter((category) => category.name !== 'AI Generated').map(categoryLabel)]
    : defaultFilterCategories;

  const manualGridItems = liveManual.length
    ? liveManual.map((item) => ({ src: item.before_image, label: item.caption, cat: item.category_name || 'Manual', type: 'manual' as const }))
    : portfolioImages.filter((i) => i.type !== 'ai');

  const filteredImages = manualGridItems.filter((img) => activeFilter === 'All' || img.cat === activeFilter);
  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(filteredImages.length / pageSize));
  const visibleImages = filteredImages.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => { setPage(1); }, [activeFilter]);

  const manualPairs = liveManual.length
    ? liveManual.map((p) => ({ before: p.before_image, after: p.after_image, caption: p.caption, category: p.category_name || 'Manual' }))
    : beforeAfterPairs;
  const aiPairs = liveAi.length
    ? liveAi.map((p) => ({ before: p.before_image, after: p.after_image, caption: p.caption, category: p.category_name || 'AI' }))
    : aiBeforeAfterPairs;
  const allPairs = [...manualPairs.map((pair) => ({ ...pair, type: 'manual' as const })), ...aiPairs.map((pair) => ({ ...pair, type: 'ai' as const }))];
  const filteredPairs = activeFilter === 'All' ? allPairs : allPairs.filter((pair) => pair.category === activeFilter);
  const featuredManual = filteredPairs.filter((pair) => pair.type === 'manual').slice(0, 4);
  const featuredAi = filteredPairs.filter((pair) => pair.type === 'ai');

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % visibleImages.length));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + visibleImages.length) % visibleImages.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, visibleImages.length]);

  const scrollToWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-white">
      <ScrollProgress />
      <PageHero
        crumb="Portfolio"
        eyebrow="Selected Work"
        title="Proof in"
        highlight="every pixel."
        subtitle="Real manual editing transformations for fashion, jewelry, furniture and e-commerce brands — plus clearly labeled AI work."
        images={cms.hero.images}
        stats={[{ val: '250+', label: 'Projects' }, { val: '9', label: 'Categories' }, { val: '4.9/5', label: 'Avg. rating' }]}
      >
        <div className="flex flex-wrap gap-3">
          <button onClick={scrollToWork} className="lux-btn lux-btn-primary">
            Browse the Work <ArrowRight size={16} />
          </button>
          <Link to="/contact#trial" className="lux-btn lux-btn-ghost">Get a Free Sample</Link>
        </div>
      </PageHero>

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div id="work" className="sticky top-[65px] z-40 scroll-mt-[65px] border-y border-hairline bg-white/80 backdrop-blur-xl">
        <div className="lux-container flex items-center gap-6 py-3">
          <span className="hidden flex-shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 md:block">Filter</span>
          <div className="lux-no-scrollbar flex gap-1 overflow-x-auto">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${activeFilter === cat ? 'text-white' : 'text-slate-500 hover:text-ink'}`}
              >
                {activeFilter === cat && (
                  <motion.span layoutId="portfolio-filter-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                )}
                <span className="relative">{cat}</span>
              </button>
            ))}
          </div>
          <span className="ml-auto hidden flex-shrink-0 text-xs text-slate-400 lg:block">
            <strong className="font-semibold text-ink">{filteredImages.length}</strong> works
          </span>
        </div>
      </div>

      {/* ── Manual editing: featured before/after ─────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <LuxHeading
              eyebrow="Manual Editing"
              title="Before & after"
              highlight="gallery."
              subtitle="Drag across each image to reveal the transformation by our professional team."
            />
            <Reveal>
              <Link to="/portfolio/manual-editing" className="lux-btn lux-btn-ghost flex-shrink-0">
                Full Gallery <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>

          {featuredManual.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {featuredManual.map((pair) => (
                  <motion.div
                    key={pair.caption + pair.before}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
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
          ) : (
            <p className="rounded-2xl border border-dashed border-hairline py-12 text-center text-sm text-slate-400">
              No before/after pairs in “{activeFilter}” yet.
            </p>
          )}
        </div>
      </section>

      {/* ── Image grid ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="lux-container">
          <div className="mb-12 flex items-end justify-between gap-6">
            <LuxHeading eyebrow={activeFilter === 'All' ? 'All Work' : activeFilter} title="The" highlight="collection." />
            {pageCount > 1 && (
              <span className="hidden text-sm text-slate-400 sm:block">Page {page} of {pageCount}</span>
            )}
          </div>

          <motion.div layout className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            <AnimatePresence mode="popLayout">
              {visibleImages.map((img, i) => (
                <motion.button
                  key={`${page}-${img.src}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: i * 0.03, ease }}
                  onClick={() => setLightbox(i)}
                  className={`lux-img-zoom group relative overflow-hidden rounded-[1.25rem] bg-sand text-left ${i % 5 === 0 ? 'row-span-2' : ''}`}
                >
                  <div className={i % 5 === 0 ? 'h-full min-h-[18rem]' : 'aspect-square'}>
                    <SmartImg src={img.src} alt={img.label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-sm font-semibold text-white">{img.label}</p>
                    <span className="text-xs text-white/70">{img.cat}</span>
                  </div>
                  <span className="absolute right-3 top-3 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <Maximize2 size={14} />
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
          {visibleImages.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">No images in this category yet.</p>
          )}

          {pageCount > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((value) => value - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 text-sm font-semibold tabular-nums text-slate-600 sm:hidden">{page} / {pageCount}</span>
              {Array.from({ length: pageCount }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === pageCount || Math.abs(n - page) <= 1)
                .map((n, idx, arr) => (
                  <span key={n} className="hidden items-center sm:flex">
                    {idx > 0 && n - arr[idx - 1] > 1 && <span className="px-1 text-slate-300">…</span>}
                    <button
                      onClick={() => setPage(n)}
                      aria-current={page === n ? 'page' : undefined}
                      className={`h-11 min-w-11 rounded-full px-3 text-sm font-semibold transition-colors ${page === n ? 'bg-ink text-white' : 'text-slate-500 hover:bg-ivory hover:text-ink'}`}
                    >
                      {n}
                    </button>
                  </span>
                ))}
              <button
                disabled={page === pageCount}
                onClick={() => setPage((value) => value + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Entry cards ───────────────────────────────────────────────────── */}
      {activeFilter === 'All' && (
        <section className="bg-white pb-16 lg:pb-20">
          <div className="lux-container grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { to: '/portfolio/manual-editing', img: cms.entryCards.manualImage, alt: cms.entryCards.manualAlt, title: 'Manual Editing', sub: 'The full before & after gallery', tag: 'Primary' },
              { to: '/portfolio/ai-services', img: cms.entryCards.aiImage, alt: cms.entryCards.aiAlt, title: 'AI Services', sub: 'AI-generated results, clearly labeled', tag: 'AI Generated' },
            ].map((card, i) => (
              <ClipReveal key={card.to} delay={i * 0.15} className="overflow-hidden rounded-[2rem]">
                <Link to={card.to} className="group relative block">
                  <ParallaxImage src={card.img} alt={card.alt} className="h-[26rem] w-full" strength={8} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
                    <div>
                      <span className="mb-3 inline-block rounded-full border border-hairline bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur">{card.tag}</span>
                      <h3 className="text-3xl font-semibold tracking-tight text-ink">
                        {card.title} <span className="lux-serif text-accent-red">demo</span>
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{card.sub}</p>
                    </div>
                    <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </Link>
              </ClipReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── AI examples ───────────────────────────────────────────────────── */}
      {featuredAi.length > 0 && (
        <section className="bg-sand py-16 lg:py-20">
          <div className="lux-container">
            <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <LuxHeading
                eyebrow="AI Services"
                title="AI generated"
                highlight="examples."
                subtitle="AI-powered results — clearly labeled and separately showcased."
              />
              <Reveal>
                <Link to="/portfolio/ai-services" className="lux-btn lux-btn-ghost flex-shrink-0">
                  AI Gallery <ArrowRight size={15} />
                </Link>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featuredAi.map((pair, i) => (
                <Reveal key={i} delay={(i % 2) * 0.1}>
                  <div className="overflow-hidden rounded-[1.75rem] border border-hairline bg-white p-2">
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
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Your images could be" highlight="next." subtitle="Send a few samples and see how our editors elevate your catalog — free." />

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox !== null && visibleImages[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 p-4 backdrop-blur-xl"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white text-ink" aria-label="Close">
              <X size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + visibleImages.length) % visibleImages.length); }}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white text-ink sm:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <motion.figure
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
              className="max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImg src={visibleImages[lightbox].src} alt={visibleImages[lightbox].label} className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-2xl" />
              <figcaption className="mt-4 text-center">
                <span className="text-sm font-semibold text-ink">{visibleImages[lightbox].label}</span>
                <span className="ml-3 text-xs text-slate-400">{visibleImages[lightbox].cat}</span>
              </figcaption>
            </motion.figure>
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % visibleImages.length); }}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white text-ink sm:right-8"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
