import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ManualEditing from './pages/ManualEditing';
import AIServices from './pages/AIServices';
import Portfolio from './pages/Portfolio';
import PortfolioManual from './pages/PortfolioManual';
import PortfolioAI from './pages/PortfolioAI';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { isLoggedIn } from './services/cmsService';
import { useSite } from './hooks/useSite';

function SiteMetadata() {
  const site = useSite();

  useEffect(() => {
    document.title = `${site.site_name} — ${site.tagline}`;
    if (site.favicon_url) {
      let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = site.favicon_url;
    }
  }, [site.site_name, site.tagline, site.favicon_url]);

  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteMetadata />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/manual-editing" element={<ManualEditing />} />
                <Route path="/services/ai-services" element={<AIServices />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/manual-editing" element={<PortfolioManual />} />
                <Route path="/portfolio/ai-services" element={<PortfolioAI />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
