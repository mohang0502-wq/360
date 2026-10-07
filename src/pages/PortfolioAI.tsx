import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SectionHeader from '../components/SectionHeader';
import { aiBeforeAfterPairs, bannerImages } from '../data/images';
import { getPortfolio, type PortfolioItem } from '../services/cmsService';

const fallbackAiGallery = aiBeforeAfterPairs;

const aiCategories = [
  { label: 'AI Model Generation', count: 4 },
  { label: 'AI Product Photography', count: 6 },
  { label: 'AI Background Creation', count: 5 },
  { label: 'AI Lifestyle Images', count: 3 },
  { label: 'AI Fashion Models', count: 4 },
];

export default function PortfolioAI() {
  const [liveItems, setLiveItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    getPortfolio('ai').then(setLiveItems).catch(() => {});
  }, []);

  const aiGallery = liveItems.length
    ? liveItems.map((p) => ({ before: p.before_image, after: p.after_image, caption: p.caption, category: p.category_name || 'AI Generated' }))
    : fallbackAiGallery;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-deep overflow-hidden">
        <img
          src={bannerImages.portfolio}
          alt="AI Portfolio"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to="/portfolio" className="hover:text-white/70">Portfolio</Link>
            <span>/</span>
            <span className="text-white/70">AI Services Demo</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block px-2 py-0.5 bg-white/10 text-white/60 text-xs font-semibold rounded-full">All content AI Generated</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">AI Services Demo</h1>
          <p className="text-white/50 mt-2 text-sm">AI-generated content examples — all items clearly labeled.</p>
        </div>
      </div>

      {/* Note */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <p className="text-sm text-slate-500 text-center">
            All content on this page is AI Generated. Our primary service is{' '}
            <Link to="/portfolio/manual-editing" className="text-slate-800 underline font-medium">manual image editing</Link>.
          </p>
        </div>
      </div>

      {/* Category overview */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {aiCategories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
                <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
                <span className="text-xs text-slate-400">{cat.count} examples</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-slate-deep">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="AI Generated"
            title="AI Services "
            highlight="Examples"
            subtitle="Input to output comparisons — drag the slider to compare."
            light={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiGallery.map((pair, i) => (
              <div key={i}>
                <BeforeAfterSlider
                  beforeSrc={pair.before}
                  afterSrc={pair.after}
                  caption={pair.caption}
                  category={pair.category}
                  aspectRatio="aspect-[16/10]"
                  zoomable={true}
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded-full border border-white/10">AI Generated</span>
                  <span className="text-sm font-semibold text-white/70">{pair.caption}</span>
                </div>
              </div>
            ))}
          </div>
          {aiGallery.length === 0 && <p className="py-16 text-center text-sm text-white/60">AI editing examples are not available yet.</p>}
        </div>
      </section>
    </div>
  );
}