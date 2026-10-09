import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import SectionHeader from '../components/SectionHeader';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { aiServicesDefaults } from '../data/pageDefaults';
import { getServices, getPortfolio, type ServiceItem, type PortfolioItem } from '../services/cmsService';

const aiServices = [
  {
    title: 'AI Model Generation',
    desc: 'Create realistic virtual models for your brand and product line. Reduce costs and production time for fashion imagery.',
    details: 'Generate diverse, realistic human models in any pose, outfit, or setting. Useful for fashion brands needing consistent, scalable model imagery without studio costs.',
    img: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80',
    use: ['Fashion e-commerce', 'Apparel brands', 'Clothing retailers', 'Lookbook production'],
  },
  {
    title: 'AI Product Photography',
    desc: 'Generate stunning product photos from existing assets. Create multiple scene variations quickly and cost-effectively.',
    details: 'Transform simple product shots into polished, context-rich photographs. Multiple lighting, angle, and environment options from a single source image.',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    use: ['E-commerce brands', 'Product startups', 'Marketplace sellers', 'D2C brands'],
  },
  {
    title: 'AI Background Creation',
    desc: 'Generate any background environment you can imagine for your products. From studio whites to lifestyle scenes.',
    details: 'Replace plain or unwanted backgrounds with AI-generated environments that match your brand aesthetic and product category.',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    use: ['Any e-commerce product', 'Brand consistency', 'Seasonal campaigns', 'Product variations'],
  },
  {
    title: 'AI Lifestyle Images',
    desc: 'Create lifestyle scene images for marketing and advertising that place your products in realistic environments.',
    details: 'Generate aspirational lifestyle imagery showing products in use, without expensive lifestyle photoshoots.',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
    use: ['Home decor brands', 'Lifestyle products', 'Marketing campaigns', 'Social media content'],
  },
  {
    title: 'AI Fashion Models',
    desc: 'Virtual fashion models for your clothing and accessories — diverse, scalable, and brand-consistent.',
    details: 'Create a consistent roster of virtual models across your entire catalog. Control age, ethnicity, body type, and styling to match brand requirements.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    use: ['Fashion retailers', 'Apparel brands', 'Accessory brands', 'Online fashion stores'],
  },
];

const aiWorkflow = [
  { num: '01', title: 'Receive Brief & Assets', desc: 'Share your images, brief, and style requirements' },
  { num: '02', title: 'AI Generation', desc: 'AI models produce initial outputs based on your brief' },
  { num: '03', title: 'Review & Refinement', desc: 'We review and refine results to match requirements' },
  { num: '04', title: 'QC Check', desc: 'Quality assurance before delivery' },
  { num: '05', title: 'Final Delivery', desc: 'Finished files delivered in your required format' },
];

const faqs = [
  { q: 'Are the AI-generated images realistic enough for commercial use?', a: 'Yes, our AI service outputs are reviewed and refined by our team before delivery to ensure commercial quality. We only deliver results that meet our quality standards.' },
  { q: 'Do I own the rights to AI-generated images?', a: 'For commercial use, we provide AI-generated images for your business use. Please contact us for specific licensing details for your use case.' },
  { q: 'Can AI services replace my existing photography?', a: 'AI services are best viewed as a complement to professional photography, particularly for scale, variation, and specific content needs. They work well alongside manual editing of real product photography.' },
  { q: 'How are AI services priced?', a: 'AI service pricing is based on service type, output quantity, and complexity. Contact us for a custom quote or see our Pricing page for general guidance.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-sm font-semibold text-slate-800 pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>
      {open && <p className="pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>}
    </div>
  );
}

const iconMap = {
  Cpu,
  Sparkles: Cpu,
  ImageIcon: Cpu,
};

export default function AIServices() {
  const { sections: pageCms } = useSections('aiServices', aiServicesDefaults);
  const { sections } = useSections('services', defaultCmsContent.services);
  const ai = sections.ai as typeof defaultCmsContent.services.ai;

  const [liveCards, setLiveCards] = useState<ServiceItem[]>([]);
  const [liveShowcase, setLiveShowcase] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    getServices('ai').then(setLiveCards).catch(() => {});
    getPortfolio('ai').then(setLiveShowcase).catch(() => {});
  }, []);

  const aiCards = liveCards.length
    ? liveCards.map((c) => ({ title: c.title, description: c.description, details: c.description, image: c.image_url, use: c.items_json || [], icon: 'Sparkles' }))
    : (ai.serviceCards.length
      ? ai.serviceCards
      : aiServices.map((s) => ({ title: s.title, description: s.desc, details: s.details, image: s.img, use: s.use, icon: 'Sparkles' })));

  const aiShowcase = liveShowcase.length
    ? liveShowcase.map((p) => ({ before: p.before_image, after: p.after_image, caption: p.caption, category: p.category_name || 'AI' }))
    : ai.showcase;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-deep overflow-hidden">
        <img
          src={pageCms.banner.image}
          alt={pageCms.banner.alt}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white/70">Services</Link>
            <span>/</span>
            <span className="text-white/70">AI Services</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-block px-2 py-0.5 bg-white/10 text-white/60 text-xs font-semibold rounded-full">Additional Service</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">{ai.title}</h1>
          <p className="text-white/50 mt-2 text-sm max-w-xl">
            {ai.description}
          </p>
        </div>
      </div>

      {/* Intro note */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-8xl mx-auto px-6 py-4">
          <p className="text-sm text-slate-500 text-center">
            <strong className="text-slate-700">Our primary business is manual image editing.</strong> AI services are an additional offering for clients with specific content creation needs.{' '}
            <Link to="/services/manual-editing" className="text-slate-800 underline font-medium">View our core manual editing services →</Link>
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="AI Services"
            title="AI-Powered "
            highlight="Content Creation"
            subtitle="Faster content creation using AI — reviewed and refined by our team before delivery."
          />
          <div className="space-y-6">
            {aiCards.map((svc, i) => {
              const Icon = iconMap[svc.icon as keyof typeof iconMap] || Cpu;
              return (
                <div key={svc.title} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 rounded-2xl border border-slate-100 bg-slate-50`}>
                  <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-500 text-xs font-semibold rounded-full">AI Generated</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={16} className="text-slate-500" />
                      <h3 className="text-lg font-bold text-slate-800">{svc.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{svc.description}</p>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{svc.details}</p>
                    <div className="flex flex-wrap gap-2">
                      {svc.use.map((u) => (
                        <span key={u} className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full">{u}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`rounded-xl overflow-hidden ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <img src={svc.image} alt={svc.title} className="w-full h-52 object-cover opacity-90" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-20 bg-slate-deep">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="AI Examples"
            title="Input → Output "
            highlight="Examples"
            subtitle="All outputs labeled clearly as AI Generated. Reviewed by our team before delivery."
            light={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiShowcase.map((pair, i) => (
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

      {/* Workflow */}
      <section className="py-20 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="AI Service Workflow"
            title="How AI Services "
            highlight="Work"
            subtitle="A clear, simple process for AI-powered content delivery."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {aiWorkflow.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xs font-extrabold text-white">{step.num}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader eyebrow="FAQ" title="AI Services " highlight="FAQ" />
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

    </div>
  );
}