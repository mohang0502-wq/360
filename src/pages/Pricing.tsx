import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Minus, Mail, Gift, RefreshCw, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import {
  PageHero, Reveal, Stagger, staggerItem, LuxHeading, ScrollProgress, ease,
} from '../components/Premium';
import { useSections } from '../hooks/useSections';
import { pricingDefaults } from '../data/pageDefaults';

type Plan = (typeof pricingDefaults.main.plans)[number];

const trust = [
  { icon: Gift, title: 'Free sample edit', sub: 'Try before you commit' },
  { icon: RefreshCw, title: 'Revisions included', sub: 'We refine until it is right' },
  { icon: ShieldCheck, title: 'Confidential', sub: 'Your files stay private' },
  { icon: Clock, title: '24–48h turnaround', sub: 'Rush delivery available' },
];

// Resolve "Everything in <plan>" lines into the full inherited feature set, so
// the comparison table reflects what each plan actually includes.
function resolvePlanFeatures(plans: Plan[]) {
  const resolved: Set<string>[] = [];
  plans.forEach((plan, i) => {
    const set = new Set<string>();
    plan.features.forEach((f) => {
      if (/^everything in/i.test(f)) {
        const prev = resolved[i - 1];
        prev?.forEach((x) => set.add(x));
      } else {
        set.add(f);
      }
    });
    resolved.push(set);
  });
  const rows: string[] = [];
  plans.forEach((plan, i) => {
    [...resolved[i], ...plan.missing].forEach((f) => { if (!rows.includes(f)) rows.push(f); });
  });
  return { resolved, rows };
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const featured = plan.highlight;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease }}
      className="relative flex h-full"
    >
      {/* gradient ring for the featured plan */}
      {featured && <div aria-hidden className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-ink via-ink/40 to-accent-red/60" />}
      <div
        className={`group relative flex w-full flex-col rounded-[2rem] p-7 transition-all duration-500 sm:p-9 ${
          featured
            ? 'bg-white shadow-[0_50px_100px_-45px_rgba(17,19,24,0.55)]'
            : 'border border-hairline bg-white hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-50px_rgba(17,19,24,0.4)]'
        }`}
      >
        {featured && (
          <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
            <Sparkles size={12} className="text-[#C9A96E]" /> Most Popular
          </span>
        )}

        {/* header — fixed min-height keeps prices aligned across cards */}
        <div className="sm:min-h-[4.5rem]">
          <h3 className="text-xl font-semibold text-ink">{plan.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
        </div>

        <div className="mt-6 border-y border-hairline py-6 sm:min-h-[8.5rem]">
          <p className="h-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{plan.priceNote}</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className={`tracking-[-0.04em] text-ink ${/\d/.test(plan.price) ? 'text-5xl font-semibold' : 'lux-serif text-5xl'}`}>
              {plan.price}
            </span>
            <span className="text-sm text-slate-500">{plan.unit}</span>
          </p>
          <p className="mt-2 text-xs text-slate-400">{plan.note}</p>
        </div>

        <ul className="mt-6 flex-1 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
              <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${featured ? 'bg-accent-red text-white' : 'bg-ink text-white'}`}>
                <Check size={11} strokeWidth={3} />
              </span>
              <span className={/^everything in/i.test(f) ? 'font-semibold text-ink' : ''}>{f}</span>
            </li>
          ))}
          {plan.missing.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-hairline">
                <Minus size={11} />
              </span>
              <span className="line-through decoration-slate-200">{f}</span>
            </li>
          ))}
        </ul>

        <Link
          to={plan.ctaLink || '/contact'}
          className={`lux-btn mt-8 w-full justify-center ${featured ? 'lux-btn-primary' : 'lux-btn-ghost'}`}
        >
          {plan.cta} <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const { sections } = useSections('pricing', pricingDefaults);
  const pricing = sections.main;
  const plans = pricing.plans?.length ? pricing.plans : pricingDefaults.main.plans;
  const { resolved, rows } = resolvePlanFeatures(plans);

  return (
    <div className="bg-white">
      <ScrollProgress />
      <PageHero
        crumb="Pricing"
        eyebrow={pricing.eyebrow}
        title={pricing.title.trim()}
        highlight={pricing.highlight}
        subtitle={pricing.subtitle}
      >
        <div className="flex flex-wrap gap-3">
          <a href="#plans" className="lux-btn lux-btn-primary">
            Compare Plans <ArrowRight size={16} />
          </a>
          <Link to="/contact#trial" className="lux-btn lux-btn-ghost">Get a Free Sample</Link>
        </div>
      </PageHero>

      {/* ── Plans ─────────────────────────────────────────────────────────── */}
      <section id="plans" className="scroll-mt-20 bg-white pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="lux-container">
          <div className={`mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:gap-7 ${plans.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
            {plans.map((plan, i) => (
              <div key={plan.name} className={plans.length >= 3 && i === plans.length - 1 ? 'md:col-span-2 md:mx-auto md:w-1/2 lg:col-span-1 lg:mx-0 lg:w-auto' : ''}>
                <PlanCard plan={plan} index={i} />
              </div>
            ))}
          </div>

          {/* trust indicators */}
          <Stagger className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline lg:grid-cols-4">
            {trust.map(({ icon: Icon, title, sub }) => (
              <motion.div key={title} variants={staggerItem} className="flex items-center gap-3 bg-ivory p-4 sm:gap-4 sm:p-6">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-sm">
                  <Icon size={17} strokeWidth={1.6} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{title}</span>
                  <span className="block text-xs text-slate-500">{sub}</span>
                </span>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-24">
        <div className="lux-container">
          <LuxHeading eyebrow="Side by Side" title="Compare" highlight="every plan." align="center" className="mb-10" />
          <Reveal>
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-hairline bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-hairline">
                      <th scope="col" className="w-2/5 p-5 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Features</th>
                      {plans.map((plan) => (
                        <th key={plan.name} scope="col" className={`p-5 text-center ${plan.highlight ? 'bg-ivory' : ''}`}>
                          <span className="block text-sm font-semibold text-ink">{plan.name}</span>
                          <span className="mt-1 block text-xs font-normal text-slate-500">
                            {plan.priceNote ? `${plan.priceNote} ` : ''}{plan.price} {plan.unit}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row} className="border-b border-hairline last:border-0 transition-colors hover:bg-ivory/60">
                        <th scope="row" className="p-4 pl-5 text-left font-medium text-slate-600">{row}</th>
                        {plans.map((plan, i) => (
                          <td key={plan.name} className={`p-4 text-center ${plan.highlight ? 'bg-ivory/70' : ''}`}>
                            {resolved[i].has(row) ? (
                              <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white" aria-label="Included">
                                <Check size={12} strokeWidth={3} />
                              </span>
                            ) : (
                              <Minus size={14} className="mx-auto text-slate-300" aria-label="Not included" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-5" />
                      {plans.map((plan) => (
                        <td key={plan.name} className={`p-5 text-center ${plan.highlight ? 'bg-ivory/70' : ''}`}>
                          <Link to={plan.ctaLink || '/contact'} className="inline-flex items-center gap-1 text-sm font-semibold text-ink underline decoration-accent-red underline-offset-4">
                            {plan.cta} <ArrowRight size={13} />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400 sm:hidden">Swipe the table sideways to compare all plans.</p>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing notes ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="lux-container">
          <LuxHeading eyebrow="How Pricing Works" title="Transparent," highlight="by design." className="mb-10" />
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {pricing.notes.map((note, i) => (
              <motion.div key={note.title} variants={staggerItem} className="lux-card group flex flex-col p-7 sm:p-8">
                <span className="lux-serif text-5xl text-slate-200 transition-colors duration-500 group-hover:text-[#C9A96E]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h4 className="mt-6 text-lg font-semibold text-ink">{note.title}</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{note.desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Custom quote ──────────────────────────────────────────────────── */}
      <section className="bg-white pb-16 lg:pb-24">
        <div className="lux-container">
          <Reveal>
            <div className="lux-glow relative overflow-hidden rounded-[2rem] border border-hairline p-7 sm:p-12">
              <div className="lux-grid-lines pointer-events-none absolute inset-0" />
              <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex items-start gap-5">
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
                    <Mail size={22} strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {pricing.ctaTitle}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">{pricing.ctaDescription}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/contact" className="lux-btn lux-btn-primary">
                    Get a Quote <ArrowRight size={15} />
                  </Link>
                  <Link to="/contact#trial" className="lux-btn lux-btn-ghost">Free Trial</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

