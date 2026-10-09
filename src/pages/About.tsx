import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, Star, Hand, FileCheck2, ShieldCheck, MessagesSquare, Handshake } from 'lucide-react';
import {
  PageHero, Reveal, Stagger, staggerItem, Parallax, ParallaxImage, ClipReveal,
  Counter, LuxHeading, ScrollProgress, Marquee, CtaBand, SmartImg,
} from '../components/Premium';
import { useSections } from '../hooks/useSections';
import { aboutDefaults } from '../data/pageDefaults';

const approach = [
  { icon: Hand, title: 'Manual Editing First', desc: 'Every image is edited by a skilled human editor. We do not rely on automated batch processing for our core work.' },
  { icon: FileCheck2, title: 'Specification Adherence', desc: 'We follow your exact requirements — style guides, reference images, naming conventions, and file format requirements.' },
  { icon: ShieldCheck, title: 'Multi-Level Quality Control', desc: 'Images go through multiple internal QC rounds before delivery. Senior editors review every batch.' },
  { icon: MessagesSquare, title: 'Consistent Communication', desc: 'Regular updates throughout the project. Direct access to your account manager for any questions.' },
  { icon: Handshake, title: 'Long-Term Partnerships', desc: 'We invest in understanding your brand standards and build a consistent editing style over time.' },
];

const qualitySteps = [
  'Editor receives job with full brief and references',
  'Initial edit completed against specifications',
  'First internal QC review by senior editor',
  'Corrections applied based on QC feedback',
  'Final QC check for consistency and completeness',
  'Delivery to client with revision window',
  'Any client feedback addressed promptly',
];

function QualityTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  return (
    <ol ref={ref} className="relative ml-5 space-y-10">
      <span className="absolute -left-px bottom-2 top-2 w-px bg-hairline" />
      <motion.span style={{ scaleY }} className="absolute -left-px bottom-2 top-2 w-px origin-top bg-accent-red" />
      {qualitySteps.map((step, i) => (
        <Reveal as="li" key={step} delay={i * 0.04} className="relative pl-10">
          <span className="absolute -left-[13px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-hairline bg-white text-[10px] font-bold text-ink">
            {String(i + 1).padStart(2, '0')}
          </span>
          <p className="text-base font-medium leading-snug text-ink">{step}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export default function About() {
  const { sections } = useSections('about', aboutDefaults);
  const hero = sections.hero;
  const story = sections.story;
  const teamMembers = sections.team;
  const testimonials = sections.testimonials;
  const statsBanner = sections.statsBanner;

  return (
    <div className="bg-white">
      <ScrollProgress />
      <PageHero
        crumb={hero.title}
        eyebrow={story.eyebrow}
        title={story.headingLine1}
        highlight={story.headingHighlight}
        subtitle="A global image editing studio where human craft meets brand-grade consistency."
        images={hero.images}
        stats={story.stats.slice(1, 4)}
      />

      {/* ── Story ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="lux-container grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-6">
            <ClipReveal className="overflow-hidden rounded-[2rem]">
              <ParallaxImage src={story.image} alt="Our team at work" className="aspect-[4/5] w-full" strength={10} />
            </ClipReveal>
            <Parallax offset={50} className="absolute -bottom-10 -right-4 hidden w-56 sm:block lg:-right-10">
              <div className="rounded-3xl border border-hairline bg-white p-6 shadow-[0_30px_60px_-30px_rgba(17,19,24,0.35)]">
                <span className="lux-serif text-5xl leading-none text-accent-red">
                  <Counter value={story.stats[0]?.val ?? '10+'} />
                </span>
                <p className="mt-2 text-sm font-semibold text-ink">{story.stats[0]?.label ?? 'Years Experience'}</p>
                <p className="mt-1 text-xs text-slate-400">of uncompromising craft</p>
              </div>
            </Parallax>
          </div>
          <div className="lg:col-span-6">
            <Reveal><span className="lux-eyebrow mb-6">Our Story</span></Reveal>
            <Reveal delay={0.1}>
              <p className="text-2xl font-medium leading-[1.4] tracking-[-0.015em] text-ink sm:text-3xl">{story.paragraph1}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-base leading-relaxed text-slate-500">{story.paragraph2}</p>
            </Reveal>
            <Stagger className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline">
              {story.stats.map((s: { val: string; label: string }) => (
                <motion.div key={s.label} variants={staggerItem} className="bg-white p-6">
                  <Counter value={s.val} className="block text-3xl font-semibold tracking-tight text-ink sm:text-4xl" />
                  <span className="mt-1 block text-xs text-slate-500">{s.label}</span>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── Values marquee ────────────────────────────────────────────────── */}
      <section className="border-y border-hairline bg-white py-10">
        <Marquee items={['Precision', 'Consistency', 'Confidentiality', 'Craftsmanship', 'Partnership', 'Punctuality']} />
      </section>

      {/* ── Approach ──────────────────────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <LuxHeading eyebrow="Our Approach" title="Human-led" highlight="production." subtitle="Five principles that shape every image that leaves our studio." className="mb-10" />
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
            {approach.map((item, i) => (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className={`lux-card group p-8 lg:p-10 ${i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}`}
              >
                <div className="mb-10 flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline bg-ivory text-ink transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <item.icon size={22} strokeWidth={1.6} />
                  </span>
                  <span className="lux-serif text-4xl text-slate-200 transition-colors duration-500 group-hover:text-[#C9A96E]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Quality process ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="lux-container grid gap-10 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <LuxHeading
              eyebrow="Quality Process"
              title="How we ensure"
              highlight="quality."
              subtitle="Seven deliberate checkpoints between your brief and your final files — so nothing is left to chance."
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <QualityTimeline />
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="lux-container">
          <LuxHeading
            eyebrow="Our Team"
            title="The experts behind"
            highlight="your images."
            subtitle="Skilled retouchers, designers and AI specialists dedicated to outstanding results every time."
            align="center"
            className="mb-10"
          />
          <Stagger className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {teamMembers.map((member: { name: string; role: string; img: string }) => (
              <motion.div key={member.name} variants={staggerItem} className="group">
                <div className="lux-img-zoom relative mb-5 aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-sand">
                  <SmartImg
                    src={member.img}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-base font-semibold text-ink">{member.name}</h4>
                <p className="mt-0.5 text-xs text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="lux-container">
          <LuxHeading eyebrow="Testimonials" title="What our clients" highlight="say." align="center" className="mb-10" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((t: { name: string; role: string; quote: string; rating: number }, i: number) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <figure className="lux-card flex h-full flex-col p-10">
                  <div className="mb-6 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} size={14} className="fill-[#C9A96E] text-[#C9A96E]" />
                    ))}
                  </div>
                  <blockquote className="lux-serif flex-1 text-2xl leading-[1.35] text-ink sm:text-[1.75rem]">“{t.quote}”</blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-hairline pt-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{t.name[0]}</span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{t.name}</span>
                      <span className="block text-xs text-slate-500">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pb-4">
        <div className="lux-container">
          <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-hairline bg-hairline lg:grid-cols-4">
            {statsBanner.map((s: { val: string; label: string }) => (
              <motion.div key={s.label} variants={staggerItem} className="bg-ivory px-6 py-12 text-center">
                <Counter value={s.val} className="lux-serif block text-5xl text-ink sm:text-6xl" />
                <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{s.label}</span>
              </motion.div>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-accent-red underline-offset-[6px]">
              See our work <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Ready to work" highlight="together?" subtitle="Start with a free sample edit and see the quality for yourself." />
    </div>
  );
}
