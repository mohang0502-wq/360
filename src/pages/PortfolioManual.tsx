import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SectionHeader from '../components/SectionHeader';
import { beforeAfterPairs, bannerImages } from '../data/images';
import { getPortfolio, getCategories, categoryLabel, type PortfolioItem, type Category } from '../services/cmsService';

const defaultCategories = ['All', 'Fashion', 'Product', 'Jewelry', 'Furniture'];

const fallbackGalleryItems = beforeAfterPairs;

export default function PortfolioManual() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [liveItems, setLiveItems] = useState<PortfolioItem[]>([]);
  const [liveCategories, setLiveCategories] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPortfolio('manual').then(setLiveItems).catch(() => {});
    getCategories('portfolio').then(setLiveCategories).catch(() => {});
  }, []);

  const categories = liveCategories.length ? ['All', ...liveCategories.filter((c) => c.name !== 'AI Generated').map(categoryLabel)] : defaultCategories;

  const galleryItems = liveItems.length
    ? liveItems.map((p) => ({ before: p.before_image, after: p.after_image, caption: p.caption, category: p.category_name || 'Manual' }))
    : fallbackGalleryItems;

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(p => p.category === activeFilter);
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => { setPage(1); }, [activeFilter]);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img
          src={bannerImages.portfolio}
          alt="Manual Editing Portfolio"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to="/portfolio" className="hover:text-white/70">Portfolio</Link>
            <span>/</span>
            <span className="text-white/70">Manual Editing Demo</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">Manual Editing Demo</h1>
          <p className="text-white/60 mt-2 text-sm">Before & after gallery of our manual editing work.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-sm text-slate-500">Showing: <strong className="text-slate-800">{activeFilter}</strong></span>
          <button onClick={() => setFilterOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Filter size={15} /> Filters
          </button>
        </div>
      </div>
      {filterOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40" onClick={() => setFilterOpen(false)}>
          <aside className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Filter by category</h2>
              <button onClick={() => setFilterOpen(false)} aria-label="Close filters" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setActiveFilter(cat); setFilterOpen(false); }} className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-semibold ${activeFilter === cat ? 'bg-slate-primary text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>{cat}</button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Gallery */}
      <section className="py-16 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Manual Editing"
            title="Before & After "
            highlight="Gallery"
            subtitle="Professional manual editing — drag the slider to compare before and after."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {visibleItems.map((pair, i) => (
              <div key={`${pair.before}-${i}`}>
                <BeforeAfterSlider
                  beforeSrc={pair.before}
                  afterSrc={pair.after}
                  caption={pair.caption}
                  category={pair.category}
                  aspectRatio="aspect-[4/3]"
                  zoomable={true}
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{pair.category}</span>
                  <span className="text-sm font-semibold text-slate-700">{pair.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40" aria-label="Previous page"><ChevronLeft size={16} /></button>
              <span className="text-sm font-semibold text-slate-600">Page {page} of {pageCount}</span>
              <button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40" aria-label="Next page"><ChevronRight size={16} /></button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-sm">No items in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}