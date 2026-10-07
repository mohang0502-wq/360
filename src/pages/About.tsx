import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { bannerImages } from '../data/images';
import { useSections } from '../hooks/useSections';

const aboutFallback = {
  hero: { title: 'About Us' },
  story: {
    eyebrow: 'Who We Are',
    headingLine1: 'Your Partner in',
    headingHighlight: 'Image Perfection',
    paragraph1:
      '360° Retouching is a professional image editing company delivering high-quality manual retouching and image editing services to clients worldwide. We combine human expertise with modern technology to bring out the best in every image.',
    paragraph2:
      'Founded by a team of passionate retouchers and visual creatives, our company was built on the belief that every image deserves expert human attention. We are not an automated service — our work is done by skilled editors who understand light, color, form, and brand requirements.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    stats: [
      { val: '10+', label: 'Years Experience' },
      { val: '120+', label: 'Happy Clients' },
      { val: '25M+', label: 'Images Retouched' },
      { val: '100%', label: 'Client Satisfaction' },
    ],
  },
  team: [
    { name: 'Rohit Sharma', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { name: 'Ananya Patel', role: 'Operations Head', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: 'Vikram Singh', role: 'Lead Retoucher', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
    { name: 'Neha Varma', role: 'QC Specialist', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
    { name: 'Arjun Das', role: 'Client Success Manager', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
  ],
  testimonials: [
    {
      name: 'Rohit Sharma',
      role: 'E-commerce Manager, IndiaMart',
      quote: 'The quality, communication and turnaround time are outstanding. 360° Retouching is our go-to partner for all image editing needs.',
      rating: 5,
    },
    {
      name: 'Priya Mehta',
      role: 'Creative Director, Fashion Studio',
      quote: "We've worked with many retouching services but 360° Retouching stands out for their attention to detail and consistency.",
      rating: 5,
    },
  ],
  statsBanner: [
    { val: '250+', label: 'Projects Completed' },
    { val: '120+', label: 'Happy Clients' },
    { val: '10K+', label: 'Images Retouched Daily' },
    { val: '4.9/5', label: 'Average Rating' },
  ],
};

export default function About() {
  const { sections } = useSections('about', aboutFallback);
  const hero = sections.hero;
  const story = sections.story;
  const teamMembers = sections.team;
  const testimonials = sections.testimonials;
  const statsBanner = sections.statsBanner;
  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img src={bannerImages.about} alt="About" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/70">About Us</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">{hero.title}</h1>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">{story.eyebrow}</span>
              <h2 className="text-3xl font-extrabold text-slate-primary mb-4">
                {story.headingLine1}<br />
                <span className="text-accent-red">{story.headingHighlight}</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {story.paragraph1}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {story.paragraph2}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {story.stats.map((s: { val: string; label: string }) => (
                  <div key={s.label} className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-2xl font-extrabold text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={story.image}
                alt="Our team at work"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Our Team"
            title="Experts Behind "
            highlight="Your Images"
            subtitle="Our skilled retouchers, designers and AI specialists work dedicatedly to deliver outstanding results every time."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member: { name: string; role: string; img: string }) => (
              <div key={member.name} className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{member.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="Our Approach"
                title="Human-Led "
                highlight="Production"
                centered={false}
              />
              <div className="space-y-4">
                {[
                  {
                    title: 'Manual Editing First',
                    desc: 'Every image is edited by a skilled human editor. We do not rely on automated batch processing for our core work.',
                  },
                  {
                    title: 'Client Specification Adherence',
                    desc: 'We follow your exact requirements — style guides, reference images, naming conventions, and file format requirements.',
                  },
                  {
                    title: 'Multi-Level Quality Control',
                    desc: 'Images go through multiple internal QC rounds before delivery. Senior editors review every batch.',
                  },
                  {
                    title: 'Consistent Communication',
                    desc: 'Regular updates throughout the project. Direct access to your account manager for any questions.',
                  },
                  {
                    title: 'Long-Term Partnerships',
                    desc: 'We invest in understanding your brand standards and build consistent editing style over time.',
                  },
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
            <div>
              <SectionHeader
                eyebrow="Quality Process"
                title="How We Ensure "
                highlight="Quality"
                centered={false}
              />
              <div className="space-y-3">
                {[
                  '01 · Editor receives job with full brief and references',
                  '02 · Initial edit completed against specifications',
                  '03 · First internal QC review by senior editor',
                  '04 · Corrections applied based on QC feedback',
                  '05 · Final QC check for consistency and completeness',
                  '06 · Delivery to client with revision window',
                  '07 · Any client feedback addressed promptly',
                ].map((step) => (
                  <div key={step} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Testimonials"
            title="What Our Clients "
            highlight="Say"
            subtitle="Placeholder testimonials — to be replaced with verified client reviews."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {testimonials.map((t: { name: string; role: string; quote: string; rating: number }) => (
              <div key={t.name} className="bg-white rounded-xl p-6 border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center italic">
            * Testimonial content is placeholder text and will be replaced with verified client reviews.
          </p>
        </div>
      </section>

      {/* Stats banner */}
      <section className="py-12 bg-slate-primary">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statsBanner.map((s: { val: string; label: string }) => (
              <div key={s.label} className="text-center py-4">
                <div className="text-3xl font-extrabold text-white">{s.val}</div>
                <div className="text-xs text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-extrabold text-slate-primary mb-3">Ready to Work Together?</h3>
          <p className="text-sm text-slate-500 mb-6">Start with a free sample edit and see the quality for yourself.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/contact#trial"
              className="inline-flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Get a Free Trial <ArrowRight size={15} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-800 px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}