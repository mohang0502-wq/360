import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { bannerImages } from '../data/images';
import { defaultCmsContent } from '../data/cms';
import { useSections } from '../hooks/useSections';

export default function Pricing() {
  const { sections } = useSections('pricing', { main: defaultCmsContent.pricing });
  const pricing = sections.main as typeof defaultCmsContent.pricing;

  return (
    <div>
      {/* Banner */}
      <div className="hidden relative h-56 bg-slate-primary overflow-hidden">
        <img src={bannerImages.pricing} alt="Pricing" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/70">Pricing</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">Pricing</h1>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow={pricing.eyebrow}
            title={pricing.title}
            highlight={pricing.highlight}
            subtitle={pricing.subtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pricing.plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border transition-shadow ${
                  plan.highlight
                    ? 'border-slate-primary bg-slate-primary text-white shadow-2xl'
                    : 'border-slate-200 bg-white text-slate-900 shadow-sm'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-red text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-lg font-extrabold mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs ${plan.highlight ? 'text-white/50' : 'text-slate-400'}`}>{plan.tagline}</p>
                </div>
                <div className="mb-6">
                  {plan.priceNote && <span className={`text-xs ${plan.highlight ? 'text-white/50' : 'text-slate-400'}`}>{plan.priceNote} </span>}
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-white/60' : 'text-slate-500'}`}>{plan.unit}</span>
                  <p className={`text-xs mt-1 ${plan.highlight ? 'text-white/40' : 'text-slate-400'}`}>{plan.note}</p>
                </div>
                <div className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} className={plan.highlight ? 'text-white/60' : 'text-slate-500'} />
                      <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-slate-600'}`}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-center gap-2 opacity-30">
                      <div className={`w-3.5 h-0.5 rounded-full ${plan.highlight ? 'bg-white' : 'bg-slate-400'}`} />
                      <span className={`text-sm line-through ${plan.highlight ? 'text-white/40' : 'text-slate-400'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center text-sm font-bold py-3 rounded-lg transition-colors ${
                    plan.highlight
                      ? 'bg-accent-red hover:bg-accent-red-hover text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Pricing notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {pricing.notes.map((note) => (
              <div key={note.title} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-2">{note.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{note.desc}</p>
              </div>
            ))}
          </div>

          {/* Custom quote */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-primary rounded-2xl p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{pricing.ctaTitle}</h4>
                <p className="text-sm text-white/60 mt-0.5">{pricing.ctaDescription}</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Get a Quote <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}