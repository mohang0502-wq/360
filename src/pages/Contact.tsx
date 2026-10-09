import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, MessageCircle, Calendar, ArrowRight, ArrowUpRight, Check,
  Zap, ShieldCheck, Gift, Headphones,
} from 'lucide-react';
import {
  PageHero, Reveal, Stagger, staggerItem, LuxHeading, ScrollProgress, Accordion, ease,
} from '../components/Premium';
import { contactDefaults } from '../data/pageDefaults';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { submitContact } from '../services/cmsService';
import { useSite, whatsappHref } from '../hooks/useSite';

const quickIcons = [Zap, ShieldCheck, Gift, Headphones];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const site = useSite();
  const whatsapp = whatsappHref(site.whatsapp);
  const meetingHref = `mailto:${site.email}?subject=${encodeURIComponent('Meeting request — 360° Retouching')}&body=${encodeURIComponent('Hi, I would like to schedule a call to discuss my project.\n\nPreferred date/time:\nTime zone:\nPhone:')}`;
  const { sections } = useSections('contact', contactDefaults);
  const contact = sections.main as typeof defaultCmsContent.contact;
  const serviceOptions = contact.serviceOptions?.length ? contact.serviceOptions : defaultCmsContent.contact.serviceOptions;

  const sendForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setSubmitError('');
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await submitContact({
        name: String(values.name || ''),
        email: String(values.email || ''),
        company: String(values.company || ''),
        phone: String(values.phone || ''),
        service: String(values.service || ''),
        message: String(values.message || values.notes || ''),
      });
      setSubmitted(true);
      form.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const channels = [
    { icon: Phone, label: 'Call us', value: site.phone, href: `tel:${site.phone}` },
    { icon: Mail, label: 'Email us', value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: 'Visit us', value: site.address, href: undefined },
  ];

  return (
    <div className="bg-white">
      <ScrollProgress />
      <PageHero
        crumb="Contact"
        eyebrow="Let's Work Together"
        title="Start a"
        highlight="conversation."
        subtitle={contact.subtitle}
        images={sections.hero.images}
        stats={[{ val: '24hr', label: 'Response time' }, { val: '120+', label: 'Global clients' }, { val: '24/7', label: 'Support' }]}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#trial" className="lux-btn lux-btn-primary">
            Send a Message <ArrowRight size={16} />
          </a>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="lux-btn lux-btn-ghost">
              <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
            </a>
          )}
        </div>
      </PageHero>

      {/* ── Contact channels ──────────────────────────────────────────────── */}
      <section className="relative z-10 -mt-10 bg-transparent">
        <Stagger className="lux-container grid grid-cols-1 gap-5 md:grid-cols-3">
          {channels.map((c) => {
            const body = (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-hairline bg-ivory text-ink transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <c.icon size={20} strokeWidth={1.6} />
                  </span>
                  {c.href && <ArrowUpRight size={18} className="text-slate-300 transition-all duration-500 group-hover:rotate-45 group-hover:text-ink" />}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{c.label}</p>
                <p className="mt-2 text-base font-semibold leading-snug text-ink">{c.value}</p>
              </>
            );
            return (
              <motion.div key={c.label} variants={staggerItem}>
                {c.href ? (
                  <a href={c.href} className="lux-card group block h-full p-8">{body}</a>
                ) : (
                  <div className="lux-card group h-full p-8">{body}</div>
                )}
              </motion.div>
            );
          })}
        </Stagger>
      </section>

      {/* ── Form + side panel ─────────────────────────────────────────────── */}
      <section id="trial" className="scroll-mt-24 bg-white py-16 lg:py-20">
        <div className="lux-container grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5">
            <LuxHeading
              eyebrow="Project Enquiry"
              title="Tell us about"
              highlight="your project."
              subtitle="Share your volume, timelines and requirements. A dedicated specialist will reply within 24 hours."
            />

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lux-btn flex-1 justify-center bg-[#25D366] text-white shadow-[0_14px_30px_-14px_rgba(37,211,102,0.7)] after:bg-[#1da851]"
                >
                  <MessageCircle size={17} /> Chat on WhatsApp
                </a>
                )}
                <a href={meetingHref} className="lux-btn lux-btn-ghost flex-1 justify-center">
                  <Calendar size={17} /> Schedule a Meeting
                </a>
              </div>
            </Reveal>

            <Stagger className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline">
              {contact.quickInfo.map((item, i) => {
                const Icon = quickIcons[i % quickIcons.length];
                return (
                  <motion.div key={item.label} variants={staggerItem} className="bg-ivory p-5">
                    <Icon size={18} strokeWidth={1.6} className="mb-4 text-accent-red" />
                    <p className="text-sm font-semibold text-ink">{item.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.sub}</p>
                  </motion.div>
                );
              })}
            </Stagger>
          </div>

          <Reveal className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-ivory p-6 shadow-[0_40px_80px_-50px_rgba(17,19,24,0.35)] sm:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="py-16 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                      className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-ink text-white"
                    >
                      <Check size={34} strokeWidth={2.5} />
                    </motion.span>
                    <h3 className="text-3xl font-semibold tracking-tight text-ink">
                      Message <span className="lux-serif text-accent-red">received.</span>
                    </h3>
                    <p className="mt-3 text-sm text-slate-500">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="lux-btn lux-btn-ghost mt-10">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                    onSubmit={sendForm}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-ink">Send us a message</h3>
                      <span className="text-xs text-slate-400">* required</span>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Your Name *</span>
                        <input name="name" type="text" required placeholder="Full name" className="lux-input" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address *</span>
                        <input name="email" type="email" required placeholder="you@company.com" className="lux-input" />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Company Name</span>
                        <input name="company" type="text" placeholder="Your company" className="lux-input" />
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number</span>
                        <input name="phone" type="tel" placeholder="+91 00000 00000" className="lux-input" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Service Interested In</span>
                      <select name="service" className="lux-input">
                        <option value="">Select a service...</option>
                        {serviceOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">Your Message *</span>
                      <textarea name="message" required rows={5} placeholder="Describe your project, volume, requirements, or any questions..." className="lux-input resize-none" />
                    </label>
                    {submitError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>}
                    <button type="submit" disabled={submitting} className="lux-btn lux-btn-primary w-full justify-center disabled:opacity-60">
                      {submitting ? 'Sending…' : <>Send Message <ArrowRight size={16} /></>}
                    </button>
                    <p className="text-center text-xs text-slate-400">Your details are kept strictly confidential.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Engagement options ────────────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <LuxHeading eyebrow="Ways to Engage" title="A model for" highlight="every scale." align="center" className="mb-10" />
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {contact.trialOptions.map((opt, i) => (
              <motion.div key={opt.title} variants={staggerItem}>
                <Link to={opt.link} className="lux-card group flex h-full flex-col p-8">
                  <span className="lux-serif text-5xl text-slate-200 transition-colors duration-500 group-hover:text-[#C9A96E]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-8 text-xl font-semibold text-ink">{opt.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-500">{opt.desc}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    Learn more <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-white py-16 lg:py-20">
        <div className="lux-container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <LuxHeading eyebrow="FAQ" title="Frequently asked" highlight="questions." />
          </div>
          <Reveal className="lg:col-span-8">
            <Accordion items={contact.faqs} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
