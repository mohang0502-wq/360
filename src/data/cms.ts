export type CmsImage = {
  src: string;
  alt: string;
};

export type CmsBeforeAfterItem = {
  before: string;
  after: string;
  caption: string;
  category: string;
};

export type CmsContent = {
  site: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      beforeImage: string;
      afterImage: string;
      beforeLabel: string;
      afterLabel: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    trust: {
      title: string;
      items: Array<{
        stat: string;
        label: string;
        sub: string;
        img: string;
      }>;
    };
    coreServices: Array<{
      title: string;
      description: string;
      image: string;
      icon: string;
    }>;
    showcase: CmsBeforeAfterItem[];
  };
  services: {
    manual: {
      title: string;
      description: string;
      image: string;
      items: string[];
      showcase: CmsBeforeAfterItem[];
      serviceCards: Array<{
        title: string;
        description: string;
        image: string;
        applications: string[];
        icon: string;
      }>;
    };
    ai: {
      title: string;
      description: string;
      image: string;
      items: string[];
      showcase: CmsBeforeAfterItem[];
      serviceCards: Array<{
        title: string;
        description: string;
        details: string;
        image: string;
        use: string[];
        icon: string;
      }>;
    };
  };
  portfolio: {
    manualGallery: CmsBeforeAfterItem[];
    aiGallery: CmsBeforeAfterItem[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    plans: Array<{
      name: string;
      tagline: string;
      priceNote: string;
      price: string;
      unit: string;
      note: string;
      cta: string;
      ctaLink: string;
      highlight: boolean;
      features: string[];
      missing: string[];
    }>;
    notes: Array<{ title: string; desc: string }>;
    ctaTitle: string;
    ctaDescription: string;
  };
  contact: {
    pageTitle: string;
    subtitle: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
    quickInfo: Array<{ label: string; sub: string }>;
    faqs: Array<{ q: string; a: string }>;
    serviceOptions: string[];
    trialOptions: Array<{ title: string; desc: string; link: string }>;
  };
};

export const defaultCmsContent: CmsContent = {
  site: {
    name: '360° Retouching',
    tagline: 'Quality · Precision · Perfection',
    phone: '+91 98765 43210',
    email: 'info@360retouching.com',
  },
  home: {
    hero: {
      eyebrow: 'Expert Image Editing · Professional Results',
      title: 'Manual Precision for Every Image.',
      subtitle:
        'Professional manual image editing and retouching for e-commerce brands, retailers and studios — with AI services for modern content creation.',
      beforeImage:
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
      afterImage:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
      beforeLabel: 'Before',
      afterLabel: 'After',
      ctaPrimary: 'Get a Free Trial',
      ctaSecondary: 'View Our Work',
    },
    trust: {
      title: 'Trusted Results, Every Time',
      items: [
        {
          stat: '10K+',
          label: 'Images Edited',
          sub: 'Delivered with precision and care',
          img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
        },
        {
          stat: '120+',
          label: 'Happy Clients',
          sub: 'Brands, studios & agencies worldwide',
          img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
        },
        {
          stat: '4.9/5',
          label: 'Average Rating',
          sub: 'Consistently praised for quality',
          img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80',
        },
        {
          stat: '10+',
          label: 'Years Experience',
          sub: 'Decade of manual editing expertise',
          img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        },
      ],
    },
    coreServices: [
      {
        title: 'Clipping Path',
        description: 'Pixel-perfect cutouts with clean edges',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        icon: 'Scissors',
      },
      {
        title: 'Background Removal',
        description: 'Remove or replace backgrounds seamlessly',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
        icon: 'Shield',
      },
      {
        title: 'Product Retouching',
        description: 'Clean, sharp, flawless product images',
        image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80',
        icon: 'Award',
      },
      {
        title: 'High-End Retouching',
        description: 'Natural skin, beauty & magazine quality',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80',
        icon: 'Star',
      },
      {
        title: 'Ghost Mannequin',
        description: 'Neck joint & realistic 3D look',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
        icon: 'Users',
      },
    ],
    showcase: [
      {
        before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
        caption: 'High-End Fashion Retouching',
        category: 'Fashion',
      },
      {
        before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=900&q=80',
        caption: 'Product Photography Edit',
        category: 'Product',
      },
      {
        before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
        caption: 'Furniture & Home Decor',
        category: 'Furniture',
      },
      {
        before: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80',
        caption: 'Jewelry Enhancement',
        category: 'Jewelry',
      },
    ],
  },
  services: {
    manual: {
      title: 'Manual Image Editing',
      description:
        'Expert hand-crafted editing by professional retouchers — human expertise for flawless, natural results.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      items: [
        'Clipping Path',
        'Background Removal',
        'Product Retouching',
        'High-End Retouching',
        'Ghost Mannequin',
        'Jewelry Editing',
        'Fashion Retouching',
        'Furniture Editing',
        'Color Correction',
        'Shadow & Reflection',
      ],
      showcase: [
        {
          before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
          after: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
          caption: 'High-End Fashion Retouching',
          category: 'Fashion',
        },
        {
          before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
          after: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=900&q=80',
          caption: 'Product Photography Edit',
          category: 'Product',
        },
        {
          before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
          after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
          caption: 'Furniture & Home Decor',
          category: 'Furniture',
        },
        {
          before: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80',
          after: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80',
          caption: 'Jewelry Enhancement',
          category: 'Jewelry',
        },
      ],
      serviceCards: [
        {
          title: 'Clipping Path',
          description: 'Perfect cutouts with pixel-perfect edges. We manually trace around every subject to create clean, precise silhouettes suitable for any background.',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
          applications: ['E-commerce product listings', 'Catalog production', 'White background images', 'Composite imagery'],
          icon: 'Scissors',
        },
        {
          title: 'Background Removal / Replacement',
          description: 'Remove or replace backgrounds seamlessly with manual selection tools. From simple products to complex hair and fabric edges.',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80',
          applications: ['White/transparent backgrounds', 'Custom brand backgrounds', 'Lifestyle scene composites', 'Marketplace requirements'],
          icon: 'Shield',
        },
        {
          title: 'Product Retouching',
          description: 'Clean, sharp and flawless product images. Dust removal, scratch repair, color enhancement, and detail perfection for every item.',
          image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80',
          applications: ['E-commerce product pages', 'Print catalogs', 'Brand asset libraries', 'Marketplace listings'],
          icon: 'Award',
        },
        {
          title: 'High-End Retouching',
          description: 'Natural skin beauty and magazine-quality retouch. Frequency separation, dodge and burn, blemish removal, and natural skin texture preservation.',
          image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=80',
          applications: ['Beauty & cosmetics brands', 'Editorial campaigns', 'Portfolio work', 'Magazine submissions'],
          icon: 'Star',
        },
        {
          title: 'Ghost Mannequin',
          description: 'Neck joint and realistic 3D look for apparel. We composite front and back shots to create a natural-looking hollow mannequin effect.',
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
          applications: ['Apparel e-commerce', 'Fashion catalogs', 'Brand lookbooks', 'Clothing retailers'],
          icon: 'Users',
        },
      ],
    },
    ai: {
      title: 'AI Services',
      description:
        'AI-powered solutions for faster content creation and digital transformation.',
      image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=80',
      items: [
        'AI Model Generation',
        'AI Product Photography',
        'AI Background Creation',
        'AI Lifestyle Images',
        'AI Fashion Models',
      ],
      showcase: [
        {
          before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
          after: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=900&q=80',
          caption: 'AI Model Generation',
          category: 'AI Generated',
        },
        {
          before: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
          after: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
          caption: 'AI Background Creation',
          category: 'AI Generated',
        },
      ],
      serviceCards: [
        {
          title: 'AI Model Generation',
          description: 'Create realistic virtual models for your brand and product line. Reduce costs and production time for fashion imagery.',
          details: 'Generate diverse, realistic human models in any pose, outfit, or setting. Useful for fashion brands needing consistent, scalable model imagery without studio costs.',
          image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=600&q=80',
          use: ['Fashion e-commerce', 'Apparel brands', 'Clothing retailers', 'Lookbook production'],
          icon: 'Cpu',
        },
        {
          title: 'AI Product Photography',
          description: 'Generate stunning product photos from existing assets. Create multiple scene variations quickly and cost-effectively.',
          details: 'Transform simple product shots into polished, context-rich photographs. Multiple lighting, angle, and environment options from a single source image.',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
          use: ['E-commerce brands', 'Product startups', 'Marketplace sellers', 'D2C brands'],
          icon: 'Sparkles',
        },
        {
          title: 'AI Background Creation',
          description: 'Generate any background environment you can imagine for your products. From studio whites to lifestyle scenes.',
          details: 'Replace plain or unwanted backgrounds with AI-generated environments that match your brand aesthetic and product category.',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
          use: ['Any e-commerce product', 'Brand consistency', 'Seasonal campaigns', 'Product variations'],
          icon: 'ImageIcon',
        },
      ],
    },
  },
  portfolio: {
    manualGallery: [
      {
        before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80',
        caption: 'High-End Fashion Retouching',
        category: 'Fashion',
      },
      {
        before: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=900&q=80',
        caption: 'Product Photography Edit',
        category: 'Product',
      },
      {
        before: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
        caption: 'Furniture & Home Decor',
        category: 'Furniture',
      },
      {
        before: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80',
        caption: 'Jewelry Enhancement',
        category: 'Jewelry',
      },
    ],
    aiGallery: [
      {
        before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=900&q=80',
        caption: 'AI Model Generation',
        category: 'AI Generated',
      },
      {
        before: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80',
        after: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
        caption: 'AI Background Creation',
        category: 'AI Generated',
      },
    ],
  },
  pricing: {
    eyebrow: 'Simple & Transparent',
    title: 'Affordable Pricing for ',
    highlight: 'Every Need',
    subtitle: 'Choose the best plan that fits your requirements. Need a custom plan? Contact us for a quote.',
    plans: [
      {
        name: 'Per Image',
        tagline: 'For Startups & One-off Projects',
        priceNote: 'From',
        price: '₹4.99',
        unit: 'per image',
        note: 'Price varies by service complexity',
        cta: 'Get Started',
        ctaLink: '/contact',
        highlight: false,
        features: [
          'Clipping Path',
          'Background Removal',
          'Basic Retouching',
          'Color Correction',
          'Standard Delivery',
          '2 Revisions',
        ],
        missing: [
          'High-End Retouching',
          'Ghost Mannequin',
          'Shadow & Reflection',
          'Priority Delivery',
          'Dedicated Account Manager',
        ],
      },
      {
        name: 'Monthly Package',
        tagline: 'For Growing Businesses',
        priceNote: 'From',
        price: '₹8.99',
        unit: 'per image',
        note: 'Save up to 20% vs. per-image rate',
        cta: 'Get Started',
        ctaLink: '/contact',
        highlight: true,
        features: [
          'Everything in Basic',
          'High-End Retouching',
          'Basic Retouching',
          'Color Correction',
          'Shadow & Reflection',
          'Jewelry Retouching',
          'Bulk Discounts',
          'Priority Delivery',
          '3 Revisions',
        ],
        missing: [
          'Dedicated Account Manager',
          'SLA & Priority Support',
          'Custom Integrations',
        ],
      },
      {
        name: 'Enterprise Plan',
        tagline: 'Custom Solutions for Agencies',
        priceNote: '',
        price: 'Custom',
        unit: 'pricing',
        note: 'Tailored to your volume & requirements',
        cta: 'Contact Us',
        ctaLink: '/contact',
        highlight: false,
        features: [
          'Everything in Monthly',
          'Dedicated Account Manager',
          'Custom Workflow',
          'Jewelry Retouching',
          'Bulk Discounts',
          'Priority Delivery',
          'SLA & Priority Support',
          'Unlimited Revisions',
          'Custom Integrations',
        ],
        missing: [],
      },
    ],
    notes: [
      {
        title: 'Manual Editing Pricing',
        desc: 'Manual editing prices are based on service type, image complexity, and volume. Simple clipping paths are priced lower; high-end retouching and specialty services are priced by complexity. Contact us for a custom quote based on your specific requirements.',
      },
      {
        title: 'AI Services Pricing',
        desc: 'AI service pricing is based on service type, number of outputs, and complexity of requirements. Contact us for AI-specific pricing.',
      },
      {
        title: 'Volume Discounts',
        desc: 'Significant volume discounts are available for ongoing projects and monthly retainers. The more you work with us, the better the rate.',
      },
    ],
    ctaTitle: 'Need a Custom Plan?',
    ctaDescription: 'We offer flexible pricing for high volume and long-term projects.',
  },
  contact: {
    pageTitle: 'Contact Us',
    subtitle: 'Have a project in mind? Get in touch with us and we\'ll get back to you within 24 hours.',
    phone: '+91 98765 43210',
    email: 'info@360retouching.com',
    address: '123, Creative Hub, 5th Floor, MG Road, Chennai – 600001, India',
    whatsapp: 'https://wa.me/919876543210',
    quickInfo: [
      { label: 'Quick Response', sub: 'Reply within 24 hours' },
      { label: '100% Secure', sub: 'Your data is safe with us' },
      { label: 'Free Trial', sub: 'Try service risk-free' },
      { label: '24/7 Support', sub: 'We\'re here for you' },
    ],
    faqs: [
      { q: 'What types of images do you edit?', a: 'We edit product, fashion, jewelry, furniture, and any e-commerce imagery. Manual editing for all types; AI services for specific content creation needs.' },
      { q: 'How long does editing take?', a: 'Standard turnaround is 24–48 hours for most projects. Rush delivery is available. Large batches have custom timelines.' },
      { q: 'Do you offer a free trial?', a: 'Yes. Send us 2–5 images and we\'ll provide a free sample edit with no obligation.' },
      { q: 'How many revisions do you provide?', a: 'Unlimited revisions until you are completely satisfied.' },
      { q: 'Is my data secure?', a: 'All client files are handled with strict confidentiality. Never shared or used without explicit permission.' },
      { q: 'What file formats do you accept?', a: 'JPEG, PNG, TIFF, PSD, RAW, ZIP archives. We deliver in any format you require.' },
    ],
    serviceOptions: ['Clipping Path', 'Background Removal', 'Product Retouching', 'High-End Retouching', 'Ghost Mannequin', 'Jewelry Editing', 'Fashion Retouching', 'Furniture Editing', 'Color Correction', 'AI Services', 'Other / Not Sure'],
    trialOptions: [
      { title: 'Per-Image', desc: 'One-off or low-volume projects', link: '/pricing' },
      { title: 'Volume / Monthly', desc: 'Regular ongoing editing needs', link: '/pricing' },
      { title: 'Enterprise / Custom', desc: 'Large-scale or agency requirements', link: '/contact' },
    ],
  },
};


