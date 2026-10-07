import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useSections } from '../hooks/useSections';

const defaultManualSteps = [
  {
    num: '01',
    title: 'Send Images',
    desc: 'Upload your images and share editing instructions, reference files, and any brand style guides.',
    detail: 'Supported formats: JPEG, PNG, TIFF, PSD, RAW, ZIP. Use the upload form on our website, email, or share a cloud storage link.',
  },
  {
    num: '02',
    title: 'Review',
    desc: 'Our team reviews your submission and confirms requirements carefully before starting.',
    detail: 'We confirm turnaround time, ask any clarifying questions, and plan the editing approach based on your specifications.',
  },
  {
    num: '03',
    title: 'Manual Editing',
    desc: "Expert editors start manual editing with precision. Every image is worked on by a skilled human editor.",
    detail: 'No automated batch processing. Each image receives dedicated attention using professional editing tools and techniques.',
  },
  {
    num: '04',
    title: 'Quality Check',
    desc: 'Multiple quality assurance checks are performed before any images reach you.',
    detail: 'Senior editors review every image against your specifications. Consistency across batches is verified before delivery.',
  },
  {
    num: '05',
    title: 'Client Review',
    desc: 'Edited images are delivered for your review. You check them against your requirements.',
    detail: 'We deliver via your preferred method: download link, email, FTP, or cloud storage. Clear instructions accompany each delivery.',
  },
  {
    num: '06',
    title: 'Revisions',
    desc: 'Request revisions if needed — we revise until you are 100% satisfied.',
    detail: 'Unlimited revisions at no extra cost. Simply provide clear feedback and we will address each point promptly.',
  },
  {
    num: '07',
    title: 'Final Delivery',
    desc: 'Final approved files are delivered in your required format, on time, every time.',
    detail: 'Final files delivered in any format you require: JPEG, PNG, TIFF, PSD, or layered files. Naming conventions followed.',
  },
];

const defaultAiSteps = [
  {
    num: '01',
    title: 'Receive Brief & Assets',
    desc: 'Share your brief, existing product images, and style requirements.',
  },
  {
    num: '02',
    title: 'AI Generation',
    desc: 'AI models generate initial outputs based on your brief and requirements.',
  },
  {
    num: '03',
    title: 'Review & Refinement',
    desc: 'Our team reviews AI outputs and refines them to match your specifications.',
  },
  {
    num: '04',
    title: 'QC Check',
    desc: 'Quality assurance before anything is delivered to you.',
  },
  {
    num: '05',
    title: 'Final Delivery',
    desc: 'Finished AI-generated files delivered in your required format.',
  },
];

const tools = [
  { name: 'Adobe Photoshop', role: 'Primary editing' },
  { name: 'Adobe Lightroom Classic', role: 'Color & batch processing' },
  { name: 'Adobe Illustrator', role: 'Vector & clipping paths' },
  { name: 'Capture One Pro', role: 'RAW processing' },
  { name: 'Retouching Panel', role: 'Frequency separation' },
  { name: 'Luminar AI', role: 'AI-assisted editing' },
];

export default function HowItWorks() {
  const { sections } = useSections('howItWorks', { manualSteps: defaultManualSteps, aiSteps: defaultAiSteps, tools });
  const manualSteps = sections.manualSteps;
  const aiSteps = sections.aiSteps;
  return (
    <div>
      {/* Banner */}
      <div className="relative h-56 bg-slate-primary overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1400&q=80"
          alt="How It Works"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-8xl mx-auto px-6 h-full flex flex-col justify-center">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <Link to="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <span className="text-white/70">How It Works</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-white">How It Works</h1>
        </div>
      </div>

      {/* Manual workflow — primary */}
      <section className="py-20 bg-white">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Primary Service</span>
          </div>
          <SectionHeader
            eyebrow="Manual Editing Workflow"
            title="Our 7-Step Manual "
            highlight="Editing Process"
            subtitle="A structured, professional workflow designed to deliver consistent, high-quality results — on time, every time."
            centered={false}
          />

          <div className="space-y-0">
            {manualSteps.map((step, i) => (
              <div key={step.num} className="flex gap-8 pb-8 relative">
                {/* Vertical line */}
                {i < manualSteps.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-slate-200" />
                )}
                {/* Step circle */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-slate-primary rounded-full flex items-center justify-center">
                    <span className="text-xs font-extrabold text-white">{step.num}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 pt-2 pb-6">
                  <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">{step.desc}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Link
              to="/contact#trial"
              className="inline-flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Start with a Free Trial <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-16 bg-off-white">
        <div className="max-w-8xl mx-auto px-6">
          <SectionHeader
            eyebrow="Tools We Use"
            title="Industry-Leading "
            highlight="Software"
            subtitle="Professional tools to ensure the best results for your images."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool) => (
              <div key={tool.name} className="bg-white rounded-xl p-4 border border-slate-100 text-center card-hover">
                <div className="w-10 h-10 bg-slate-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-lg font-extrabold text-slate-600">{tool.name[0]}</span>
                </div>
                <p className="text-xs font-bold text-slate-800">{tool.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{tool.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI workflow — secondary */}
      <section className="py-20 bg-slate-deep">
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Additional Service</span>
          </div>
          <SectionHeader
            eyebrow="AI Service Workflow"
            title="AI Services "
            highlight="Process"
            subtitle="A simpler workflow for AI-powered content creation — a secondary service option."
            light={true}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl">
            {aiSteps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xs font-extrabold text-white/70">{step.num}</span>
                </div>
                <h4 className="text-xs font-bold text-white/70 mb-1">{step.title}</h4>
                <p className="text-xs text-white/40">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/services/ai-services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white border border-white/20 hover:border-white/40 px-5 py-2.5 rounded-lg transition-colors"
            >
              Learn About AI Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quality note */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Our Quality Commitment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Every image edited by a skilled human editor',
                'Multiple internal QC checks on every batch',
                'We follow your exact specifications and style guides',
                'Unlimited revisions until you are satisfied',
                'Consistent results across large-volume orders',
                'Strict confidentiality on all client files',
                'On-time delivery, every time',
                'Direct communication throughout the process',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle size={14} className="text-slate-400 flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}