import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, MessageCircle, Calendar,
  ArrowRight, CheckCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import SectionHeader from '../components/SectionHeader';
import { bannerImages } from '../data/images';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';
import { submitContact } from '../services/cmsService';
import { useSite } from '../hooks/useSite';

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

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const site = useSite();
  const { sections } = useSections('contact', { main: defaultCmsContent.contact });
  const contact = sections.main as typeof defaultCmsContent.contact;

  const sendForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
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
      event.currentTarget.reset();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img src={bannerImages.contact} alt="Contact" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/70">Contact Us</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">Contact Us</h1>
        </div>
      </div>

      {/* Contact section */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: contact info */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-primary mb-3">Let's Work Together</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Have a project in mind? Get in touch with us and we'll get back to you within 24 hours.
              </p>

              {/* Contact details */}
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={15} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <a href={`tel:${site.phone}`} className="text-sm font-semibold text-slate-800 hover:text-slate-600">{site.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={15} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                    <a href={`mailto:${site.email}`} className="text-sm font-semibold text-slate-800 hover:text-slate-600">{site.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={15} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
                    <p className="text-sm text-slate-700">{site.address}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={site.whatsapp || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-5 py-3 rounded-lg transition-colors text-sm mb-3"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>

              {/* Schedule */}
              <a
                href="#"
                className="flex items-center gap-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-lg transition-colors text-sm"
              >
                <Calendar size={18} className="text-slate-600" />
                Schedule a Meeting
              </a>

              {/* Quick info */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {contact.quickInfo.map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <p className="text-xs font-bold text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={28} className="text-slate-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                    <p className="text-sm text-slate-500">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={sendForm}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Name *</label>
                        <input name="name" type="text" required placeholder="Full name" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address *</label>
                        <input name="email" type="email" required placeholder="you@company.com" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name</label>
                        <input name="company" type="text" placeholder="Your company" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number</label>
                        <input name="phone" type="tel" placeholder="+91 00000 00000" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Service Interested In</label>
                      <select name="service" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">
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
                        <option>Other / Not Sure</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Your Message *</label>
                      <textarea name="message" required rows={4} placeholder="Describe your project, volume, requirements, or any questions..." className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none" />
                    </div>
                    {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                    <button type="submit" disabled={submitting} className="w-full bg-slate-primary hover:bg-slate-mid text-white font-bold py-3.5 rounded-lg transition-colors text-sm disabled:opacity-60">
                      {submitting ? 'Sending…' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial / Quote section */}
      <section id="trial" className="py-20 bg-off-white scroll-mt-20">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Free Trial"
            title="Request a Free "
            highlight="Sample Edit"
            subtitle="Send us 2–5 sample images and receive a professionally edited result with no obligation."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quote options */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Request a Quote For:</h3>
              {contact.trialOptions.map((opt) => (
                <Link
                  key={opt.title}
                  to={opt.link}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">{opt.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
                </Link>
              ))}
            </div>

            {/* Free trial form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Free Sample Edit Request</h3>
              <form className="space-y-4" onSubmit={sendForm}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="name" required type="text" placeholder="Your name *" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
                  <input name="email" required type="email" placeholder="Email address *" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 transition" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select name="service" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">
                    <option value="">Service required...</option>
                    <option>Clipping Path</option>
                    <option>Background Removal</option>
                    <option>Product Retouching</option>
                    <option>High-End Retouching</option>
                    <option>Ghost Mannequin</option>
                    <option>Jewelry Editing</option>
                    <option>Fashion Retouching</option>
                    <option>AI Services</option>
                    <option>Other</option>
                  </select>
                  <select className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">
                    <option value="">Approximate volume...</option>
                    <option>1–50 images/month</option>
                    <option>50–200 images/month</option>
                    <option>200–500 images/month</option>
                    <option>500+ images/month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Upload Sample Images</label>
                  <FileUpload />
                </div>
                <textarea name="notes" required rows={3} placeholder="Instructions, style references, or special notes..." className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 transition resize-none" />
                {submitError && <p className="text-sm text-red-600">{submitError}</p>}
                <button type="submit" disabled={submitting} className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-bold py-3.5 rounded-lg transition-colors text-sm disabled:opacity-60">
                  {submitting ? 'Sending…' : 'Send Free Trial Request'}
                </button>
                <p className="text-xs text-slate-400 text-center">No credit card · No obligation · 24-hour delivery</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeader eyebrow="FAQ" title="Frequently Asked " highlight="Questions" />
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            {contact.faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>
    </div>
  );
}