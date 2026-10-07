import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, HelpCircle, Scissors } from 'lucide-react';
import { useSite } from '../hooks/useSite';

const serviceLinks = [
  { to: '/services/manual-editing', label: 'Manual Image Editing', desc: 'Expert hand-crafted editing' },
  { to: '/services/ai-services', label: 'AI Services', desc: 'AI-powered content creation' },
];

const portfolioLinks = [
  { to: '/portfolio/manual-editing', label: 'Manual Editing Demo', desc: 'Before & after gallery' },
  { to: '/portfolio/ai-services', label: 'AI Services Demo', desc: 'AI-generated results' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const location = useLocation();
  const site = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setPortfolioOpen(false);
  }, [location.pathname]);

  const navLinkClass = (path: string) =>
    `text-sm font-semibold transition-colors ${
      location.pathname.startsWith(path)
        ? 'text-slate-900'
        : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Top bar */}
      <div className="bg-slate-primary text-white text-xs py-2 hidden lg:block">
        <div className="max-w-8xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 text-white/70">
            <span>Premium Retouching Service</span>
            <span>·</span>
            <span>24/7 Support</span>
            <span>·</span>
            <span>Fast Turnaround</span>
            <span>·</span>
            <span>100% Satisfaction</span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <a href={`tel:${site.phone}`} className="hover:text-white transition-colors">{site.phone}</a>
            <span>·</span>
            <a href={`mailto:${site.email}`} className="hover:text-white transition-colors">{site.email}</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'} border-b border-slate-100`}>
        <div className="max-w-8xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="360° Retouching home">
              <img
                src={site.logo_url || '/images/360.png'}
                alt={site.site_name}
                className="h-[62px] w-auto object-contain max-w-[120px]"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className={`px-3 py-2 rounded-md ${navLinkClass('/__home')}`}>Home</Link>

              {/* Services dropdown */}
              <div className="nav-item relative px-1">
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${navLinkClass('/services')}`}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`nav-dropdown ${servicesOpen ? '!opacity-100 !visible !translate-y-0' : ''}`}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link to="/services" className="block px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">All Services</Link>
                  {serviceLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800">{l.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{l.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Portfolio dropdown */}
              <div className="nav-item relative px-1">
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${navLinkClass('/portfolio')}`}
                  onMouseEnter={() => setPortfolioOpen(true)}
                  onMouseLeave={() => setPortfolioOpen(false)}
                >
                  Portfolio <ChevronDown size={14} className={`transition-transform ${portfolioOpen ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`nav-dropdown ${portfolioOpen ? '!opacity-100 !visible !translate-y-0' : ''}`}
                  onMouseEnter={() => setPortfolioOpen(true)}
                  onMouseLeave={() => setPortfolioOpen(false)}
                >
                  <Link to="/portfolio" className="block px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">All Work</Link>
                  {portfolioLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="flex flex-col px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800">{l.label}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{l.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/how-it-works" className={`px-3 py-2 rounded-md ${navLinkClass('/how-it-works')}`}>How It Works</Link>
              <Link to="/pricing" className={`px-3 py-2 rounded-md ${navLinkClass('/pricing')}`}>Pricing</Link>
              <Link to="/about" className={`px-3 py-2 rounded-md ${navLinkClass('/about')}`}>About</Link>
              <Link to="/contact" className={`px-3 py-2 rounded-md ${navLinkClass('/contact')}`}>Contact</Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/contact#faq" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">
                <HelpCircle size={15} /> FAQ
              </Link>
              <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors">
                <User size={15} /> Login
              </a>
              <Link to="/contact" className="text-sm font-bold text-slate-700 border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg transition-colors">
                Request a Quote
              </Link>
              <Link to="/contact#trial" className="text-sm font-bold text-white bg-accent-red hover:bg-accent-red-hover px-4 py-2 rounded-lg transition-colors">
                Get a Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="max-w-8xl mx-auto px-6 py-4 space-y-1">
              <Link to="/" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Home</Link>
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Services</div>
              <Link to="/services" className="block px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">All Services</Link>
              <Link to="/services/manual-editing" className="block px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Manual Image Editing</Link>
              <Link to="/services/ai-services" className="block px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">AI Services</Link>
              <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio</div>
              <Link to="/portfolio" className="block px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">All Work</Link>
              <Link to="/portfolio/manual-editing" className="block px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Manual Editing Demo</Link>
              <Link to="/portfolio/ai-services" className="block px-6 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">AI Services Demo</Link>
              <Link to="/how-it-works" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">How It Works</Link>
              <Link to="/pricing" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Pricing</Link>
              <Link to="/about" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">About Us</Link>
              <Link to="/contact" className="block px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg">Contact</Link>
              <div className="pt-3 flex flex-col gap-2">
                <Link to="/contact" className="w-full text-center text-sm font-bold text-slate-700 border border-slate-200 px-4 py-3 rounded-lg">
                  Request a Quote
                </Link>
                <Link to="/contact#trial" className="w-full text-center text-sm font-bold text-white bg-accent-red px-4 py-3 rounded-lg">
                  Get a Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
