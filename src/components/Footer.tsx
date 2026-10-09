import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { useSite } from '../hooks/useSite';

export default function Footer() {
  const site = useSite();
  const socialLinks = [
    { label: 'Facebook', url: site.facebook, Icon: FaFacebookF },
    { label: 'Instagram', url: site.instagram, Icon: FaInstagram },
    { label: 'LinkedIn', url: site.linkedin, Icon: FaLinkedinIn },
    { label: 'YouTube', url: site.youtube, Icon: FaYoutube },
  ].filter((link) => /^https?:\/\/./i.test(link.url || '')); // skip empty or "#" placeholders

  return (
    <footer className="bg-slate-primary text-white">
      <div className="max-w-8xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="360° Retouching home">
              <img
                src={site.logo_url || '/images/360.png'}
                alt={site.site_name}
                className="h-[125px] brightness-[6] invert-0 w-auto mb-2 object-contain max-w-[120px]"
              />
            </Link>
            
            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              Professional photo retouching and image editing services for e-commerce brands, studios, and creative agencies worldwide. Manual expertise with AI-powered options.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label} title={link.label} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors text-white/70">
                  <link.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/portfolio', label: 'Portfolio' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/80 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Manual Services */}
          <div>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-4">Manual Services</h4>
            <ul className="space-y-2.5">
              {[
                'Clipping Path',
                'Background Removal',
                'Product Retouching',
                'High-End Retouching',
                'Ghost Mannequin',
                'Jewelry Retouching',
                'Fashion Retouching',
                'Furniture Editing',
                'Color Correction',
                'Shadow & Reflection',
              ].map((s) => (
                <li key={s}>
                  <Link to="/services/manual-editing" className="text-sm text-white/80 hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Services + Contact */}
          <div>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-4">AI Services</h4>
            <ul className="space-y-2.5 mb-6">
              {[
                'AI Model Generation',
                'AI Product Photography',
                'AI Background Creation',
                'AI Lifestyle Images',
                'AI Fashion Models',
              ].map((s) => (
                <li key={s}>
                  <Link to="/services/ai-services" className="text-sm text-white/80 hover:text-white transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <Phone size={13} className="text-white/90 mt-0.5 flex-shrink-0" />
                <a href={`tel:${site.phone}`} className="text-sm text-white/80 hover:text-white transition-colors">{site.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={13} className="text-white/90 mt-0.5 flex-shrink-0" />
                <a href={`mailto:${site.email}`} className="min-w-0 text-sm text-white/80 hover:text-white transition-colors [overflow-wrap:anywhere]">{site.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="text-white/90 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">{site.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs text-white/90">© 2026 <a href="https://www.shineaspire.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-700 transition-colors">Shine Aspire</a>. All rights reserved.</p>
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>
    </footer>
  );
}
