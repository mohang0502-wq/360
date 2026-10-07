import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ZoomIn, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SectionHeader from '../components/SectionHeader';
import { beforeAfterPairs, portfolioImages, aiBeforeAfterPairs, bannerImages } from '../data/images';
import { getPortfolio, getCategories, categoryLabel, type PortfolioItem, type Category } from '../services/cmsService';

const defaultFilterCategories = [
  'All', 'Fashion', 'Jewelry', 'Furniture', 'Product', 'Ghost Mannequin',
  'Clipping Path', 'Retouching', 'Color Correction',
];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [liveManual, setLiveManual] = useState<PortfolioItem[]>([]);
  const [liveAi, setLiveAi] = useState<PortfolioItem[]>([]);
  const [liveCategories, setLiveCategories] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

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

  const filteredImages = manualGridItems.filter((img) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'AI Generated') return false;
    return img.cat === activeFilter;
  });
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
  const filteredPairs = activeFilter === 'All'
    ? allPairs
    : allPairs.filter((pair) => pair.category === activeFilter);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img
          src={bannerImages.portfolio}
          alt="Portfolio"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/70">Portfolio</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">Our Portfolio</h1>
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-sm text-slate-500">Showing: <strong className="text-slate-800">{activeFilter}</strong></span>
          <button onClick={() => setFilterOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Filter size={15} /> Filters</button>
        </div>
      </div>
      {filterOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40" onClick={() => setFilterOpen(false)}>
          <aside className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Filter by category</h2><button onClick={() => setFilterOpen(false)} aria-label="Close filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button></div>
            <div className="space-y-2">{filterCategories.map((cat) => <button key={cat} onClick={() => { setActiveFilter(cat); setFilterOpen(false); }} className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold ${activeFilter === cat ? 'bg-slate-primary text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>{cat}</button>)}</div>
          </aside>
        </div>
      )}

      {/* Manual Editing section — primary, shown first */}
      {(activeFilter === 'All' || !showingAi) && (
        <section className="py-16 bg-off-white">
          <div className="max-w-8xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <SectionHeader
                eyebrow="Manual Editing"
                title="Before & After "
                highlight="Gallery"
                subtitle="Real manual editing transformations by our professional team."
                centered={false}
              />
              <Link
                to="/portfolio/manual-editing"
                className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                Full Gallery <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredPairs.filter((pair) => pair.type === 'manual').slice(0, 4).map((pair, i) => (
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
            {/* Image grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleImages.filter(i => i.type !== 'ai').map((img, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden aspect-square card-hover">
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <p className="text-xs font-bold text-white">{img.label}</p>
                    <span className="text-xs text-white/60">{img.cat}</span>
                  </div>
                  <button className="absolute top-2 right-2 bg-white/90 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={14} className="text-slate-800" />
                  </button>
                </div>
              ))}
            </div>
            {pageCount > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={16} /></button>
                <span className="text-sm font-semibold text-slate-600">Page {page} of {pageCount}</span>
                <button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40" aria-label="Next page"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Entry cards */}
      {activeFilter === 'All' && (
        <section className="py-12 bg-white">
          <div className="max-w-8xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/portfolio/manual-editing" className="group rounded-2xl overflow-hidden relative h-48 card-hover">
                <img
                  src={bannerImages.about}
                  alt="Manual Editing Demo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-extrabold text-white mb-2">Manual Editing Demo</h3>
                    <p className="text-sm text-white/70 mb-3">Full before & after gallery</p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white border border-white/40 px-4 py-2 rounded-lg group-hover:bg-white/10 transition-colors">
                      View Gallery <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
              <Link to="/portfolio/ai-services" className="group rounded-2xl overflow-hidden relative h-48 card-hover">
                <img src={bannerImages.services} alt="AI Services Demo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70" />
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <div className="text-center">
                    <span className="inline-block px-2 py-0.5 bg-white/20 text-white/70 text-xs font-semibold rounded-full mb-2">AI Generated</span>
                    <h3 className="text-xl font-extrabold text-white mb-2">AI Services Demo</h3>
                    <p className="text-sm text-white/70 mb-3">AI-generated results gallery</p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white border border-white/40 px-4 py-2 rounded-lg group-hover:bg-white/10 transition-colors">
                      View Gallery <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* AI Services section — secondary, shown after manual */}
      {aiPairs.length > 0 && (
        <section className="py-16 bg-slate-deep">
          <div className="max-w-8xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <SectionHeader
                eyebrow="AI Services"
                title="AI Generated "
                highlight="Examples"
                subtitle="AI-powered results — clearly labeled and separately showcased."
                centered={false}
                light={true}
              />
              <Link
                to="/portfolio/ai-services"
                className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-lg transition-colors"
              >
                AI Gallery <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPairs.filter((pair) => pair.type === 'ai').map((pair, i) => (
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
          </div>
        </section>
      )}
    </div>
  );
}