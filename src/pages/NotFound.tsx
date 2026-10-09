import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — 360° Retouching';
  }, []);

  return (
    <section className="lux-glow relative overflow-hidden">
      <div className="lux-grid-lines pointer-events-none absolute inset-0" />
      <div className="lux-container relative flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <span className="lux-serif text-8xl leading-none text-accent-red sm:text-9xl">404</span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">This page could not be found.</h1>
        <p className="mt-4 max-w-md text-base text-slate-500">
          The link may be outdated, or the page may have moved. Try one of these instead.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="lux-btn lux-btn-primary">
            Back to Home <ArrowRight size={16} />
          </Link>
          <Link to="/portfolio" className="lux-btn lux-btn-ghost">View Portfolio</Link>
          <Link to="/contact" className="lux-btn lux-btn-ghost">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
