import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Scissors, Cpu, Check, MessageSquare } from 'lucide-react';
import {
  PageHero, Reveal, Stagger, staggerItem, Parallax, ParallaxImage, ClipReveal,
  LuxHeading, ScrollProgress, CtaBand, SmartImg, ease,
} from '../components/Premium';
import { servicesDefaults } from '../data/pageDefaults';
import type { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { getCategories, getServices, type Category, type ServiceItem } from '../services/cmsService';

export default function Services() {
  const { sections } = useSections('services', servicesDefaults);
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

  const pillars = [
    {
      num: '01',
      tag: 'Primary Service',
      icon: Scissors,
      title: manualService.title,
      description: manualService.description,
      image: manualService.image,
      items: manualService.items,
      link: '/services/manual-editing',
      cta: 'Explore Manual Services',
    },
    {
      num: '02',
      tag: 'Additional Service',
      icon: Cpu,
      title: aiService.title,
      description: aiService.description,
      image: aiService.image,
      items: aiService.items,
      link: '/services/ai-services',
      cta: 'Explore AI Services',
    },
  ];

  return (
    <div className="bg-white">
      <ScrollProgress />
      <PageHero
        crumb="Services"
        eyebrow="What We Offer"
        title="Imagery, crafted"
        highlight="to perfection."
        subtitle="Expert manual image editing at the core, complemented by AI-powered solutions for modern content creation."
        images={sections.hero.images}
        stats={[{ val: '10K+', label: 'Images monthly' }, { val: '24hr', label: 'Turnaround' }, { val: '100%', label: 'Manual craft' }]}
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/contact#trial" className="lux-btn lux-btn-primary">
            Start a Free Trial <ArrowRight size={16} />
          </Link>
          <a href="#pillars" className="lux-btn lux-btn-ghost">Our Services</a>
        </div>
      </PageHero>

      {/* ── Service pillars: alternating editorial rows ───────────────────── */}
      <section id="pillars" className="scroll-mt-24 bg-white py-16 lg:py-20">
        <div className="lux-container">
          <LuxHeading
            eyebrow="Two Disciplines"
            title="One uncompromising"
            highlight="standard."
            subtitle="Manual image editing by experts, and AI-powered solutions for modern content creation."
            align="center"
            className="mb-12 lg:mb-14"
          />

          <div className="space-y-16 lg:space-y-20">
            {pillars.map((p, i) => (
              <div key={p.num} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
                <div className={`lg:col-span-7 ${i % 2 ? 'lg:order-2' : ''}`}>
                  <div className="relative">
                    <ClipReveal className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-45px_rgba(17,19,24,0.5)]">
                      <ParallaxImage src={p.image} alt={p.title} className="aspect-[4/3] w-full" strength={10} />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                      <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur">
                        {p.tag}
                      </span>
                      <span className="lux-serif absolute bottom-5 left-6 text-3xl text-white sm:text-4xl">{p.title}</span>
                    </ClipReveal>
                    <Parallax offset={40} className={`absolute -bottom-8 hidden w-40 sm:block ${i % 2 ? '-left-6' : '-right-6'}`}>
                      <div className="rounded-2xl border-[5px] border-white bg-white shadow-2xl">
                        <div className="aspect-[4/5] overflow-hidden rounded-xl">
                          <SmartImg src={i === 0 ? sections.pillarThumbnails.manual.src : sections.pillarThumbnails.ai.src} alt={i === 0 ? sections.pillarThumbnails.manual.alt : sections.pillarThumbnails.ai.alt} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                        <p className="px-1 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">{p.items.length}+ services</p>
                      </div>
                    </Parallax>
                  </div>
                </div>
                <div className={`lg:col-span-5 ${i % 2 ? 'lg:order-1' : ''}`}>
                  <Reveal>
                    <div className="mb-8 flex items-center gap-5">
                      <span className="lux-serif text-7xl leading-none text-[#C9A96E]/70">{p.num}</span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-hairline bg-ivory text-ink">
                        <p.icon size={20} strokeWidth={1.6} />
                      </span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">{p.title}</h2>
                    <p className="mt-5 text-base leading-relaxed text-slate-500">{p.description}</p>
                  </Reveal>
                  <Stagger className={`mt-8 grid gap-x-6 gap-y-3 border-t border-hairline pt-8 ${p.items.length > 5 ? 'sm:grid-cols-2' : ''}`} gap={0.05}>
                    {p.items.map((s) => (
                      <motion.div key={s} variants={staggerItem} className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        {s}
                      </motion.div>
                    ))}
                  </Stagger>
                  <Reveal delay={0.2}>
                    <Link to={p.link} className={`lux-btn mt-10 ${i === 0 ? 'lux-btn-primary' : 'lux-btn-ghost'}`}>
                      {p.cta} <ArrowRight size={15} />
                    </Link>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category explorer (from CMS) ──────────────────────────────────── */}
      {serviceItems.length > 0 && (
        <section className="bg-ivory py-16 lg:py-20">
          <div className="lux-container">
            <LuxHeading
              eyebrow="Browse by Category"
              title="Explore every"
              highlight="service."
              subtitle="Choose a category to see the services available for that type of work."
              align="center"
              className="mb-12"
            />
            <Reveal>
              <div className="lux-no-scrollbar mx-auto mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-hairline bg-white p-1">
                {['All', ...serviceCategories.map((category) => category.name)].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-semibold transition-colors ${activeCategory === category ? 'text-white' : 'text-slate-500 hover:text-ink'}`}
                  >
                    {activeCategory === category && (
                      <motion.span layoutId="services-cat-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                    )}
                    <span className="relative">{category}</span>
                  </button>
                ))}
              </div>
            </Reveal>

            <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visibleServices.map((service, i) => (
                  <motion.article
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.04, ease }}
                    className="lux-card lux-img-zoom group overflow-hidden"
                  >
                    {service.image_url && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <SmartImg src={service.image_url} alt={service.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      </div>
                    )}
                    <div className="p-7">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A8875A]">{service.category_name || service.type}</span>
                      <div className="mt-2 flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold text-ink">{service.title}</h3>
                        <ArrowUpRight size={18} className="mt-1 flex-shrink-0 text-slate-300 transition-all duration-500 group-hover:rotate-45 group-hover:text-ink" />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
            {visibleServices.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No services in this category yet.</p>}
          </div>
        </section>
      )}

      {/* ── Not sure strip ────────────────────────────────────────────────── */}
      <section className="bg-white pt-14 lg:pt-16">
        <div className="lux-container">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-hairline bg-ivory p-8 sm:flex-row sm:items-center sm:p-10">
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-ink shadow-sm">
                  <MessageSquare size={22} strokeWidth={1.6} />
                </span>
                <div>
                  <h4 className="text-xl font-semibold text-ink">Not sure what you need?</h4>
                  <p className="mt-1 text-sm text-slate-500">Talk to our experts and get the right solution for your business.</p>
                </div>
              </div>
              <Link to="/contact" className="lux-btn lux-btn-primary flex-shrink-0">
                Talk to Experts <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
