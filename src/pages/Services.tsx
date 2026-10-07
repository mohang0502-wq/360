import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scissors, Cpu, CheckCircle, MessageSquare } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { bannerImages } from '../data/images';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { getCategories, getServices, type Category, type ServiceItem } from '../services/cmsService';

export default function Services() {
  const { sections } = useSections('services', defaultCmsContent.services);
  const manualService = sections.manual as typeof defaultCmsContent.services.manual;
  const aiService = sections.ai as typeof defaultCmsContent.services.ai;
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getServices().then(setServiceItems).catch(() => {});
    getCategories('service').then(setServiceCategories).catch(() => {});
  }, []);

  const visibleServices = activeCategory === 'All'
    ? serviceItems
    : serviceItems.filter((item) => item.category_name === activeCategory);

  return (
    <div>
      {/* Page Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img src={bannerImages.services} alt="Services" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/70">Services</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">Our Services</h1>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="What We Offer"
            title="Two Powerful "
            highlight="Service Categories"
            subtitle="Manual image editing by experts, and AI-powered solutions for modern content creation."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Manual editing card — primary */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-primary bg-white shadow-xl">
              <div className="absolute top-4 right-4 bg-slate-primary text-white text-xs font-bold px-3 py-1 rounded-full">Primary Service</div>
              <div className="h-56 overflow-hidden">
                <img
                  src={manualService.image}
                  alt={manualService.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-primary rounded-xl flex items-center justify-center">
                    <Scissors size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">01</span>
                    <h2 className="text-xl font-extrabold text-slate-primary">{manualService.title}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {manualService.description}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {manualService.items.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle size={12} className="text-slate-400 flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <Link
                  to="/services/manual-editing"
                  className="inline-flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
                >
                  Explore Manual Services <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* AI services card — secondary */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">Additional Service</div>
              <div className="h-56 overflow-hidden">
                <img
                  src={aiService.image}
                  alt={aiService.title}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Cpu size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">02</span>
                    <h2 className="text-xl font-extrabold text-slate-700">{aiService.title}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {aiService.description}
                </p>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {aiService.items.map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle size={12} className="text-slate-300 flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <Link
                  to="/services/ai-services"
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 border border-slate-200 hover:border-slate-400 px-6 py-3 rounded-lg transition-colors"
                >
                  Explore AI Services <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {serviceItems.length > 0 && (
            <div className="border-t border-slate-100 pt-12">
              <SectionHeader
                eyebrow="Browse By Category"
                title="Explore Every "
                highlight="Service"
                subtitle="Choose a category to see the services available for that type of work."
              />
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {['All', ...serviceCategories.map((category) => category.name)].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${activeCategory === category ? 'bg-slate-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleServices.map((service) => (
                  <article key={service.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {service.image_url && <img src={service.image_url} alt={service.title} className="h-44 w-full object-cover" />}
                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{service.category_name || service.type}</span>
                      <h3 className="mt-1 text-base font-bold text-slate-800">{service.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              {visibleServices.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No services in this category yet.</p>}
            </div>
          )}

          {/* Not sure section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} className="text-slate-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Not Sure What You Need?</h4>
                <p className="text-xs text-slate-500 mt-0.5">Talk to our experts and get the right solution for your business.</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-800 px-5 py-2.5 rounded-lg transition-colors"
            >
              Talk to Experts <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}