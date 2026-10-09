import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Clock, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import {
  PageHero, Reveal, Stagger, staggerItem, LuxHeading, ScrollProgress, CtaBand, SmartImg, ease,
} from '../components/Premium';
import { useSections } from '../hooks/useSections';
import { howItWorksDefaults } from '../data/pageDefaults';

type ManualStep = (typeof howItWorksDefaults.manualSteps)[number];

const commitments = [
  'Every image edited by a skilled human editor',
  'Multiple internal QC checks on every batch',
  'We follow your exact specifications and style guides',
  'Unlimited revisions until you are satisfied',
  'Consistent results across large-volume orders',
  'Strict confidentiality on all client files',
  'On-time delivery, every time',
  'Direct communication throughout the process',
];

// ─── One step in the scrolling list; reports itself active when centred ──────
function StepRow({
  step,
  index,
  active,
  onActivate,
}: {
  step: ManualStep;
  index: number;
  active: boolean;
  onActivate: (i: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const centred = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => { if (centred) onActivate(index); }, [centred, index, onActivate]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onActivate(index)}
      onMouseEnter={() => onActivate(index)}
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease }}
      aria-current={active ? 'step' : undefined}
      className={`group relative flex w-full gap-5 rounded-[1.5rem] border p-5 text-left transition-all duration-500 sm:gap-6 sm:p-7 ${
        active
          ? 'border-ink/10 bg-white shadow-[0_30px_60px_-35px_rgba(17,19,24,0.35)]'
          : 'border-transparent bg-transparent hover:bg-white/60'
      }`}
    >
      {/* node on the timeline */}
      <span
        className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500 ${
          active ? 'scale-110 border-ink bg-ink text-white' : 'border-hairline bg-white text-ink'
        }`}
      >
        {step.num}
        {active && <span className="absolute inset-0 animate-ping rounded-full border border-ink/30" />}
      </span>
      <span className="min-w-0 flex-1 pt-1">
        <span className="flex items-center justify-between gap-3">
          <span className={`text-lg font-semibold transition-colors sm:text-xl ${active ? 'text-ink' : 'text-slate-500 group-hover:text-ink'}`}>{step.title}</span>
          <ArrowRight size={16} className={`flex-shrink-0 transition-all duration-500 ${active ? 'translate-x-0 text-accent-red opacity-100' : '-translate-x-2 opacity-0'}`} />
        </span>
        <span className="mt-2 block text-sm leading-relaxed text-slate-500">{step.desc}</span>
        <AnimatePresence initial={false}>
          {active && (
            <motion.span
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="block overflow-hidden"
            >
              <span className="mt-4 block border-t border-hairline pt-4 text-[13px] leading-relaxed text-slate-500">{step.detail}</span>
              {/* inline image for small screens (the sticky visual is desktop-only) */}
              <span className="mt-4 block aspect-[16/10] overflow-hidden rounded-xl bg-sand lg:hidden">
                <SmartImg src={step.image} alt={step.alt} className="h-full w-full object-cover" loading="lazy" />
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

// ─── Manual workflow: sticky visual + scroll-synced step list ───────────────
function ManualWorkflow({ steps }: { steps: ManualStep[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const current = steps[active] ?? steps[0];

  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="lux-container">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <LuxHeading
            eyebrow="Manual Editing Workflow · Primary Service"
            title={`Our ${steps.length}-step`}
            highlight="editing process."
            subtitle="A structured, professional workflow designed for consistency, precision and complete transparency at every stage."
          />
          <Reveal>
            <div className="flex w-fit items-center gap-3 rounded-full border border-hairline bg-white px-5 py-3 text-xs font-semibold text-slate-600">
              <span className="tabular-nums text-ink">{String(active + 1).padStart(2, '0')}</span>
              <span className="h-px w-10 bg-hairline">
                <motion.span
                  key={active}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease }}
                  className="block h-px origin-left bg-ink"
                />
              </span>
              <span className="tabular-nums text-slate-400">{String(steps.length).padStart(2, '0')}</span>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Sticky visual (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand shadow-[0_50px_100px_-50px_rgba(17,19,24,0.55)]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease }}
                    className="absolute inset-0"
                  >
                    <SmartImg src={current.image} alt={current.alt} className="h-full w-full object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <span className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <span className="lux-serif text-7xl leading-none text-white/90">{current.num}</span>
                      <p className="mt-3 text-2xl font-semibold text-white">{current.title}</p>
                    </motion.div>
                  </AnimatePresence>
                  <div className="mt-6 flex gap-1.5">
                    {steps.map((s, i) => (
                      <button
                        key={s.num}
                        onClick={() => setActive(i)}
                        aria-label={`Show step ${s.num}`}
                        className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-white' : 'w-4 bg-white/35 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step list with scroll-filled timeline */}
          <div ref={listRef} className="relative lg:col-span-7">
            <span className="absolute bottom-10 left-[2.75rem] top-10 w-px bg-hairline sm:left-[3.25rem]" aria-hidden />
            <motion.span
              aria-hidden
              style={{ scaleY: fill }}
              className="absolute bottom-10 left-[2.75rem] top-10 w-px origin-top bg-gradient-to-b from-ink via-ink to-accent-red sm:left-[3.25rem]"
            />
            <div className="space-y-2">
              {steps.map((step, i) => (
                <StepRow key={step.num} step={step} index={i} active={i === active} onActivate={setActive} />
              ))}
            </div>
            <Reveal className="mt-8 pl-5 sm:pl-7">
              <Link to="/contact#trial" className="lux-btn lux-btn-primary">
                Start with a Free Trial <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI workflow: horizontal track (vertical on mobile) ─────────────────────
function AiWorkflow({ steps }: { steps: Array<{ num: string; title: string; desc: string }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="bg-sand py-16 lg:py-24">
      <div className="lux-container">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <LuxHeading
            eyebrow="AI Service Workflow · Additional Service"
            title="A lighter path for"
            highlight="AI-powered content."
            subtitle="Every AI output is still reviewed and refined by our editors before it reaches you."
          />
          <Reveal>
            <Link to="/services/ai-services" className="lux-btn lux-btn-ghost flex-shrink-0">
              Learn About AI Services <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div ref={ref} className="relative">
          {/* connecting line, drawn when the track enters view */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-hairline md:block" aria-hidden />
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.6, ease }}
            className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-gradient-to-r from-ink to-accent-red md:block"
          />
          <span className="absolute bottom-4 left-7 top-4 w-px bg-hairline md:hidden" aria-hidden />
          <ol className="grid gap-4 md:grid-cols-5 md:gap-5">
            {steps.map((step, i) => (
              <motion.li
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.14, ease }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex gap-5 md:block"
              >
                <span
                  className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border bg-white text-sm font-bold transition-all duration-500 md:mb-6 ${
                    hovered === i ? 'scale-110 border-ink bg-ink text-white' : 'border-hairline text-ink'
                  }`}
                >
                  {i === steps.length - 1 ? <Check size={18} /> : step.num}
                </span>
                <div className={`flex-1 rounded-2xl border p-5 transition-all duration-500 ${hovered === i ? 'border-ink/10 bg-ivory shadow-lg' : 'border-hairline bg-white'}`}>
                  <h4 className="text-base font-semibold text-ink">{step.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function HowItWorks() {
  const { sections } = useSections('howItWorks', howItWorksDefaults);
  const manualSteps = sections.manualSteps?.length ? sections.manualSteps : howItWorksDefaults.manualSteps;
  const aiSteps = sections.aiSteps?.length ? sections.aiSteps : howItWorksDefaults.aiSteps;
  const tools = sections.tools?.length ? sections.tools : howItWorksDefaults.tools;

  return (
    <div className="bg-white">
      <ScrollProgress />
      <PageHero
        crumb="How It Works"
        eyebrow="Our Process"
        title="From brief to"
        highlight="flawless delivery."
        subtitle="A transparent, human-led workflow with multi-level quality control — so every batch arrives on time and on brief."
        images={sections.hero?.images}
        stats={[
          { val: `${manualSteps.length}`, label: 'Step workflow' },
          { val: '24hr', label: 'Standard turnaround' },
          { val: '100%', label: 'Human edited' },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/contact#trial" className="lux-btn lux-btn-primary">
            Start a Free Trial <ArrowRight size={16} />
          </Link>
          <a href="#workflow" className="lux-btn lux-btn-ghost">See the Workflow</a>
        </div>
      </PageHero>

      {/* Assurance strip */}
      <section className="border-y border-hairline bg-white">
        <Stagger className="lux-container grid grid-cols-2 divide-hairline lg:grid-cols-4 lg:divide-x">
          {[
            { icon: Clock, title: 'On-time delivery', sub: '24–48h standard' },
            { icon: ShieldCheck, title: 'Confidential', sub: 'NDA-ready workflow' },
            { icon: RefreshCw, title: 'Unlimited revisions', sub: 'Until it is right' },
            { icon: Sparkles, title: 'Senior QC', sub: 'Every batch reviewed' },
          ].map(({ icon: Icon, title, sub }) => (
            <motion.div key={title} variants={staggerItem} className="flex items-center gap-4 px-2 py-6 sm:px-6">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-hairline bg-ivory text-ink">
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{title}</span>
                <span className="block text-xs text-slate-500">{sub}</span>
              </span>
            </motion.div>
          ))}
        </Stagger>
      </section>

      <div id="workflow" className="scroll-mt-20">
        <ManualWorkflow steps={manualSteps} />
      </div>

      {/* Tools */}
      <section className="bg-white py-16 lg:py-24">
        <div className="lux-container">
          <LuxHeading
            eyebrow="Tools We Use"
            title="Industry-leading"
            highlight="software."
            subtitle="Professional tools that ensure the best possible results for your images."
            align="center"
            className="mb-12"
          />
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {tools.map((tool: { name: string; role: string }) => (
              <motion.div key={tool.name} variants={staggerItem} className="lux-card group p-5 text-center sm:p-6">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-ivory transition-all duration-500 group-hover:-translate-y-1 group-hover:border-ink group-hover:bg-ink">
                  <span className="lux-serif text-2xl text-ink transition-colors duration-500 group-hover:text-white">{tool.name[0]}</span>
                </span>
                <p className="text-sm font-semibold text-ink">{tool.name}</p>
                <p className="mt-1 text-xs text-slate-500">{tool.role}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <AiWorkflow steps={aiSteps} />

      {/* Quality commitment */}
      <section className="bg-ivory py-16 lg:py-24">
        <div className="lux-container">
          <Reveal>
            <div className="grid gap-10 rounded-[2rem] border border-hairline bg-white p-6 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:p-14">
              <div className="lg:col-span-5">
                <span className="lux-eyebrow mb-5">Our Promise</span>
                <h3 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                  Our quality <span className="lux-serif text-accent-red">commitment.</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">
                  Eight standards we hold ourselves to on every single project, regardless of size.
                </p>
              </div>
              <Stagger className="grid gap-3 sm:grid-cols-2 lg:col-span-7" gap={0.05}>
                {commitments.map((point) => (
                  <motion.div key={point} variants={staggerItem} className="flex items-start gap-3 rounded-xl bg-ivory p-4">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span className="text-sm text-slate-600">{point}</span>
                  </motion.div>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title="See the process" highlight="in action." subtitle="Send a few sample images and experience the full workflow — free, with no obligation." />
    </div>
  );
}
