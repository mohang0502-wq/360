import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors, Shield, Award, Star, Users, Zap,
  BarChart3, RefreshCw, CheckCircle, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import FileUpload from '../components/FileUpload';
import SectionHeader from '../components/SectionHeader';
import { beforeAfterPairs, serviceImages, bannerImages } from '../data/images';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { getServices, getPortfolio, type ServiceItem, type PortfolioItem } from '../services/cmsService';

const services = [
  {
    icon: Scissors,
    title: 'Clipping Path',
    desc: 'Perfect cutouts with pixel-perfect edges. We manually trace around every subject to create clean, precise silhouettes suitable for any background.',
    applications: ['E-commerce product listings', 'Catalog production', 'White background images', 'Composite imagery'],
    img: serviceImages.clippingPath,
  },
  {
    icon: Shield,
    title: 'Background Removal / Replacement',
    desc: 'Remove or replace backgrounds seamlessly with manual selection tools. From simple products to complex hair and fabric edges.',
    applications: ['White/transparent backgrounds', 'Custom brand backgrounds', 'Lifestyle scene composites', 'Marketplace requirements'],
    img: serviceImages.backgroundRemoval,
  },
  {
    icon: Award,
    title: 'Product Retouching',
    desc: 'Clean, sharp and flawless product images. Dust removal, scratch repair, color enhancement, and detail perfection for every item.',
    applications: ['E-commerce product pages', 'Print catalogs', 'Brand asset libraries', 'Marketplace listings'],
    img: serviceImages.productRetouching,
  },
  {
    icon: Star,
    title: 'High-End Retouching',
    desc: 'Natural skin beauty and magazine-quality retouch. Frequency separation, dodge and burn, blemish removal, and natural skin texture preservation.',
    applications: ['Beauty & cosmetics brands', 'Editorial campaigns', 'Portfolio work', 'Magazine submissions'],
    img: serviceImages.highEndRetouching,
  },
  {
    icon: Users,
    title: 'Ghost Mannequin',
    desc: 'Neck joint and realistic 3D look for apparel. We composite front and back shots to create a natural-looking hollow mannequin effect.',
    applications: ['Apparel e-commerce', 'Fashion catalogs', 'Brand lookbooks', 'Clothing retailers'],
    img: serviceImages.ghostMannequin,
  },
  {
    icon: Zap,
    title: 'Jewelry Editing',
    desc: 'Brilliance, clarity and metal enhancement. We remove dust, improve gem clarity, enhance metal reflections, and ensure consistent color across sets.',
    applications: ['Jewelry retailers', 'Diamond & gemstone brands', 'Luxury accessories', 'Online jewelry stores'],
    img: serviceImages.jewelry,
  },
  {
    icon: BarChart3,
    title: 'Fashion / Apparel Retouching',
    desc: 'Editorial quality apparel retouching. Wrinkle removal, color accuracy, fabric texture enhancement, and consistent brand look.',
    applications: ['Fashion brands', 'Apparel retailers', 'Sportswear brands', 'Fashion editorials'],
    img: serviceImages.fashion,
  },
  {
    icon: RefreshCw,
    title: 'Furniture / Home Decor Editing',
    desc: 'Enhance colors, remove dust and achieve perfect details in furniture and home decor imagery for online and print use.',
    applications: ['Furniture retailers', 'Home decor brands', 'Interior design studios', 'Marketplace sellers'],
    img: serviceImages.furniture,
  },
  {
    icon: CheckCircle,
    title: 'Color Correction & Matching',
    desc: 'Accurate, consistent color across your entire image catalog. We match colors to brand standards and ensure consistency across product variants.',
    applications: ['Consistent product listings', 'Color variant matching', 'Print color preparation', 'Brand consistency'],
    img: serviceImages.colorCorrection,
  },
  {
    icon: Clock,
    title: 'Shadow / Reflection Editing',
    desc: 'Add natural drop shadows, reflection shadows, or remove unwanted shadows to give products a grounded, professional look.',
    applications: ['Product photography', 'E-commerce imagery', 'Catalog production', 'Studio photography post-processing'],
    img: serviceImages.shadow,
  },
];

const defaultManualCards = [...services];

const iconMap = {
  Scissors,
  Shield,
  Award,
  Star,
  Users,
  Zap,
  BarChart3,
  RefreshCw,
  CheckCircle,
  Clock,
};

const workflow = [
  { num: '01', title: 'Receive Images & Brief', desc: 'Upload your images and share your editing requirements and reference files.' },
  { num: '02', title: 'Review Requirements', desc: 'Our team reviews your brief and plans the optimal editing approach.' },
  { num: '03', title: 'Manual Editing', desc: 'Expert editors work on each image by hand with precision and care.' },
  { num: '04', title: 'Internal QC', desc: 'Multi-level quality assurance checks before anything reaches you.' },
  { num: '05', title: 'Client Review', desc: 'You review the edited images and request any changes.' },
  { num: '06', title: 'Revisions', desc: 'Free revisions until you are fully satisfied with the result.' },
  { num: '07', title: 'Final Delivery', desc: 'Final files delivered in your required format, on time, every time.' },
];

const faqs = [
  { q: 'What file formats do you accept and deliver?', a: 'We accept JPEG, PNG, TIFF, PSD, RAW, and ZIP archives. Delivery formats include JPEG, PNG (transparent), TIFF, and PSD — whichever you require.' },
  { q: 'What is the standard turnaround time?', a: 'Standard turnaround is 24–48 hours for most projects. Rush delivery options are available. Larger volume orders will have a custom timeline agreed upfront.' },
  { q: 'Can you match our brand\'s editing style?', a: 'Yes. We follow client specifications precisely. Share reference images, style guides, or examples and we will match your existing look and feel.' },
  { q: 'Do you offer bulk pricing?', a: 'Yes. Volume discounts are available for ongoing projects and monthly retainers. Contact us or check our Pricing page for details.' },
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

export default function ManualEditing() {
  const { sections } = useSections('services', defaultCmsContent.services);
  const manual = sections.manual as typeof defaultCmsContent.services.manual;

  const [liveCards, setLiveCards] = useState<ServiceItem[]>([]);
  const [liveShowcase, setLiveShowcase] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    getServices('manual').then(setLiveCards).catch(() => {});
    getPortfolio('manual').then(setLiveShowcase).catch(() => {});
  }, []);

  const manualCards = liveCards.length
    ? liveCards.map((c) => ({ title: c.title, description: c.description, image: c.image_url, applications: c.items_json || [], icon: 'Scissors' }))
    : (manual.serviceCards.length ? manual.serviceCards : defaultManualCards.map((svc) => ({
    title: svc.title,
    description: svc.desc,
    image: svc.img,
    applications: svc.applications,
    icon: svc.icon.displayName || 'Scissors',
  })));

  const manualShowcase = liveShowcase.length
    ? liveShowcase.map((p) => ({ before: p.before_image, after: p.after_image, caption: p.caption, category: p.category_name || 'Manual' }))
    : manual.showcase;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img src={bannerImages.services} alt="Manual Editing" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white/70">Services</Link>
            <span>/</span>
            <span className="text-white/70">Manual Image Editing</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">{manual.title}</h1>
          <p className="text-white/60 mt-2 text-sm max-w-xl">
            {manual.description}
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Our Editing Services"
            title="Full Range of "
            highlight="Manual Editing"
            subtitle="Every service is performed by skilled human editors — no automated processing."
          />
          <div className="space-y-8">
            {manualCards.map((svc, i) => {
              const Icon = (svc.icon && iconMap[svc.icon as keyof typeof iconMap]) || Scissors;
              return (
                <div
                  key={svc.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 rounded-2xl border border-slate-100 bg-off-white ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={`${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-slate-primary rounded-lg flex items-center justify-center">
                        <Icon size={16} className="text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{svc.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{svc.description}</p>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Typical Applications</p>
                      <div className="flex flex-wrap gap-2">
                        {svc.applications.map((app) => (
                          <span key={app} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{app}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`rounded-xl overflow-hidden ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <img src={svc.image} alt={svc.title} className="w-full h-52 object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-20 bg-slate-primary">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Proof of Quality"
            title="See the "
            highlight="Difference"
            subtitle="Real before and after examples from our manual editing team."
            light={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {manualShowcase.slice(0, 4).map((pair, i) => (
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
            eyebrow="Production Workflow"
            title="How We "
            highlight="Work"
            subtitle="A structured, professional workflow designed for consistent quality and reliable delivery."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {workflow.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-slate-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xs font-extrabold text-white">{step.num}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality considerations */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="Quality Standards"
                title="Our Quality "
                highlight="Commitment"
                centered={false}
              />
              <div className="space-y-4">
                {[
                  { title: 'Multi-Layer QC', desc: 'Every image goes through multiple internal quality checks before delivery.' },
                  { title: 'Client Specifications', desc: 'We follow your exact specifications, style guides, and reference images.' },
                  { title: 'Unlimited Revisions', desc: 'We revise until you are fully satisfied — no extra charge.' },
                  { title: 'Consistent Results', desc: 'Batch consistency across large volume orders maintained throughout.' },
                  { title: 'Secure Handling', desc: 'All client files are handled with strict confidentiality and care.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80"
                alt="Quality editing workspace"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-off-white">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader eyebrow="FAQ" title="Common " highlight="Questions" />
          <div className="bg-white rounded-xl p-6 border border-slate-100">
            {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

    </div>
  );
}