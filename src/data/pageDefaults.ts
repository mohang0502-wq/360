// Central registry of default content for every CMS-managed page section.
//
// Pages render these as fallbacks (via useSections) until the admin saves a
// section; the admin "Page Sections" editor lists every section declared here
// — even ones never saved — so every image and block of copy on the public
// site has an edit path without touching code.
//
// Image convention: any key matching /image|img|src|photo|.../ is rendered as
// an upload field in the CMS. Galleries use arrays of { src, alt } so admins can
// add, remove, reorder and caption images.
import { defaultCmsContent } from './cms';
import { bannerImages, serviceImages } from './images';

export type CmsImageItem = { src: string; alt: string };

/* ---------------------------------- home ---------------------------------- */

export const homeDefaults = {
  ...defaultCmsContent.home,
  heroGallery: {
    detailImage: { src: serviceImages.highEndRetouching, alt: 'High-end retouching detail' },
    detailLabel: 'High-end retouch',
    avatars: [
      { src: serviceImages.fashion, alt: 'Fashion client' },
      { src: serviceImages.jewelry, alt: 'Jewelry client' },
      { src: serviceImages.productRetouching, alt: 'Product client' },
      { src: serviceImages.furniture, alt: 'Furniture client' },
    ] as CmsImageItem[],
  },
  statement: {
    eyebrow: 'The 360° Difference',
    image: '',
    imageAlt: 'Retouched imagery',
    thumbnails: [
      { src: serviceImages.jewelry, alt: 'Jewelry retouching' },
      { src: serviceImages.productRetouching, alt: 'Product retouching' },
      { src: serviceImages.furniture, alt: 'Furniture editing' },
    ] as CmsImageItem[],
  },
  portfolioCategories: {
    items: [
      { label: 'Fashion', count: '120+', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80', alt: 'Fashion editing' },
      { label: 'Jewelry', count: '80+', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', alt: 'Jewelry editing' },
      { label: 'Product', count: '150+', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80', alt: 'Product editing' },
      { label: 'Furniture', count: '70+', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80', alt: 'Furniture editing' },
      { label: 'eCommerce', count: '200+', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', alt: 'eCommerce editing' },
      { label: 'Retouching', count: '90+', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', alt: 'Retouching' },
    ],
  },
  aiServices: {
    items: [
      { label: 'AI Model Generation', desc: 'Realistic on-brand models', image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80', alt: 'AI generated model' },
      { label: 'AI Product Photography', desc: 'Studio shots from existing assets', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', alt: 'AI product photography' },
      { label: 'AI Background Creation', desc: 'Any environment you imagine', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', alt: 'AI background' },
      { label: 'AI Lifestyle Images', desc: 'Lifestyle scenes for campaigns', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', alt: 'AI lifestyle scene' },
      { label: 'AI Fashion Models', desc: 'Virtual models for apparel', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', alt: 'AI fashion model' },
    ],
  },
};

/* ------------------------------ hero collages ------------------------------ */

const heroImages = (main: string, second: string, third: string, label: string) => ({
  images: [
    { src: main, alt: `${label} — main image` },
    { src: second, alt: `${label} — detail` },
    { src: third, alt: `${label} — detail` },
  ] as CmsImageItem[],
});

export const servicesDefaults = {
  ...defaultCmsContent.services,
  hero: heroImages(bannerImages.services, serviceImages.jewelry, serviceImages.productRetouching, 'Services'),
  pillarThumbnails: {
    manual: { src: serviceImages.jewelry, alt: 'Manual editing sample' },
    ai: { src: serviceImages.fashion, alt: 'AI service sample' },
  },
};

export const portfolioDefaults = {
  hero: heroImages(bannerImages.portfolio, serviceImages.highEndRetouching, serviceImages.fashion, 'Portfolio'),
  entryCards: {
    manualImage: bannerImages.about,
    manualAlt: 'Manual editing gallery',
    aiImage: bannerImages.services,
    aiAlt: 'AI services gallery',
  },
};

export const contactDefaults = {
  main: defaultCmsContent.contact,
  hero: heroImages(bannerImages.contact, serviceImages.fashion, serviceImages.furniture, 'Contact'),
};

export const pricingDefaults = {
  main: defaultCmsContent.pricing,
};

/* --------------------------------- about ---------------------------------- */

const aboutBase = {
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
export const aboutDefaults = {
  ...aboutBase,
  hero: { ...aboutBase.hero, ...heroImages(bannerImages.about, serviceImages.colorCorrection, serviceImages.jewelry, 'About') },
};

/* ------------------------------ how it works ------------------------------- */

export const howItWorksDefaults = {
  hero: heroImages(bannerImages.howItWorks, serviceImages.clippingPath, serviceImages.colorCorrection, 'How it works'),
  manualSteps: [
    {
      num: '01',
      title: 'Send Images',
      desc: 'Upload your images and share editing instructions, reference files, and any brand style guides.',
      detail: 'Supported formats: JPEG, PNG, TIFF, PSD, RAW, ZIP. Use the upload form on our website, email, or share a cloud storage link.',
      image: serviceImages.productRetouching,
      alt: 'Product images ready for editing',
    },
    {
      num: '02',
      title: 'Review',
      desc: 'Our team reviews your submission and confirms requirements carefully before starting.',
      detail: 'We confirm turnaround time, ask any clarifying questions, and plan the editing approach based on your specifications.',
      image: serviceImages.clippingPath,
      alt: 'Reviewing the brief',
    },
    {
      num: '03',
      title: 'Manual Editing',
      desc: 'Expert editors start manual editing with precision. Every image is worked on by a skilled human editor.',
      detail: 'No automated batch processing. Each image receives dedicated attention using professional editing tools and techniques.',
      image: serviceImages.highEndRetouching,
      alt: 'Manual retouching in progress',
    },
    {
      num: '04',
      title: 'Quality Check',
      desc: 'Multiple quality assurance checks are performed before any images reach you.',
      detail: 'Senior editors review every image against your specifications. Consistency across batches is verified before delivery.',
      image: serviceImages.colorCorrection,
      alt: 'Quality check of colour and detail',
    },
    {
      num: '05',
      title: 'Client Review',
      desc: 'Edited images are delivered for your review. You check them against your requirements.',
      detail: 'We deliver via your preferred method: download link, email, FTP, or cloud storage. Clear instructions accompany each delivery.',
      image: serviceImages.fashion,
      alt: 'Client reviewing edited images',
    },
    {
      num: '06',
      title: 'Revisions',
      desc: 'Request revisions if needed — we revise until you are 100% satisfied.',
      detail: 'Unlimited revisions at no extra cost. Simply provide clear feedback and we will address each point promptly.',
      image: serviceImages.jewelry,
      alt: 'Refining details after feedback',
    },
    {
      num: '07',
      title: 'Final Delivery',
      desc: 'Final approved files are delivered in your required format, on time, every time.',
      detail: 'Final files delivered in any format you require: JPEG, PNG, TIFF, PSD, or layered files. Naming conventions followed.',
      image: serviceImages.furniture,
      alt: 'Final delivered images',
    },
  ],
  aiSteps: [
    { num: '01', title: 'Receive Brief & Assets', desc: 'Share your brief, existing product images, and style requirements.' },
    { num: '02', title: 'AI Generation', desc: 'AI models generate initial outputs based on your brief and requirements.' },
    { num: '03', title: 'Review & Refinement', desc: 'Our team reviews AI outputs and refines them to match your specifications.' },
    { num: '04', title: 'QC Check', desc: 'Quality assurance before anything is delivered to you.' },
    { num: '05', title: 'Final Delivery', desc: 'Finished AI-generated files delivered in your required format.' },
  ],
  tools: [
    { name: 'Adobe Photoshop', role: 'Primary editing' },
    { name: 'Adobe Lightroom Classic', role: 'Color & batch processing' },
    { name: 'Adobe Illustrator', role: 'Vector & clipping paths' },
    { name: 'Capture One Pro', role: 'RAW processing' },
    { name: 'Retouching Panel', role: 'Frequency separation' },
    { name: 'Luminar AI', role: 'AI-assisted editing' },
  ],
};

/* ------------------------- secondary page banners ------------------------- */

export const manualEditingDefaults = {
  banner: { image: bannerImages.services, alt: 'Manual image editing' },
  quality: { image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80', alt: 'Quality editing workspace' },
};
export const aiServicesDefaults = {
  banner: { image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=1400&q=80', alt: 'AI services' },
};
export const portfolioManualDefaults = {
  banner: { image: bannerImages.portfolio, alt: 'Manual editing portfolio' },
};
export const portfolioAiDefaults = {
  banner: { image: bannerImages.portfolio, alt: 'AI services portfolio' },
};

/* -------------------------------- registry -------------------------------- */
// page key (as stored in page_sections.page_key) -> label + default sections.

export const PAGE_REGISTRY: Record<string, { label: string; route: string; defaults: Record<string, any> }> = {
  home: { label: 'Home', route: '/', defaults: homeDefaults },
  services: { label: 'Services', route: '/services', defaults: servicesDefaults },
  manualEditing: { label: 'Manual Editing', route: '/services/manual-editing', defaults: manualEditingDefaults },
  aiServices: { label: 'AI Services', route: '/services/ai-services', defaults: aiServicesDefaults },
  portfolio: { label: 'Portfolio', route: '/portfolio', defaults: portfolioDefaults },
  portfolioManual: { label: 'Portfolio · Manual', route: '/portfolio/manual-editing', defaults: portfolioManualDefaults },
  portfolioAi: { label: 'Portfolio · AI', route: '/portfolio/ai-services', defaults: portfolioAiDefaults },
  howItWorks: { label: 'How It Works', route: '/how-it-works', defaults: howItWorksDefaults },
  pricing: { label: 'Pricing', route: '/pricing', defaults: pricingDefaults },
  about: { label: 'About', route: '/about', defaults: aboutDefaults },
  contact: { label: 'Contact', route: '/contact', defaults: contactDefaults },
};
