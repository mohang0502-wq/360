import { useEffect, useState } from 'react';
import { getSite, type SiteSettings } from '../services/cmsService';

export const defaultSite: SiteSettings = {
  site_name: '360° Retouching',
  tagline: 'Quality · Precision · Perfection',
  phone: '+91 98765 43210',
  email: 'info@360retouching.com',
  whatsapp: 'https://wa.me/919876543210',
  address: '123, Creative Hub, 5th Floor, MG Road, Chennai - 600001, India',
  logo_url: '/images/360.png',
};

export function useSite() {
  const [site, setSite] = useState<SiteSettings>(defaultSite);

  useEffect(() => {
    let cancelled = false;
    getSite().then((value) => {
      if (!cancelled) setSite({ ...defaultSite, ...value });
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return site;
}
// The WhatsApp setting may hold a full link (https://wa.me/…) or just a phone
// number ("+91 98765 43210"). Always produce a working wa.me link.
export function whatsappHref(value: string | null | undefined): string {
  const v = (value || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  const digits = v.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}
