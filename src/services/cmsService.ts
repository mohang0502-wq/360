// Real backend-backed CMS client — every read/write below goes through
// server/api.js -> MySQL. The admin dashboard and useSections() hook use
// this. The static defaultCmsContent below stays as a fallback/back-compat
// export for pages not yet wired to live sections (see loadCmsContent()).
import { defaultCmsContent, type CmsContent } from '../data/cms';

export const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = '360-admin-token';

export type Category = {
  id: number;
  group_type: 'portfolio' | 'service';
  name: string;
  slug: string;
  parent_id?: number | null;
  parent_name?: string | null;
  sort_order: number;
};

export const categoryLabel = (category: Pick<Category, 'name' | 'parent_name'>) =>
  category.parent_name ? `${category.parent_name} / ${category.name}` : category.name;

export type PortfolioItem = {
  id: number;
  type: 'manual' | 'ai';
  category_id: number | null;
  category_name?: string;
  parent_category_name?: string;
  source_path?: string | null;
  caption: string;
  before_image: string;
  after_image: string;
  sort_order: number;
};

export type ServiceItem = {
  id: number;
  type: 'manual' | 'ai';
  category_id: number | null;
  title: string;
  description: string;
  image_url: string;
  items_json: string[];
  sort_order: number;
};

export type PageSection = {
  id: number;
  page_key: string;
  section_key: string;
  title: string | null;
  content_json: any;
  sort_order: number;
};

export type SiteSettings = {
  id?: number;
  site_name: string;
  tagline: string;
  phone: string;
  email: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  logo_url?: string;
  favicon_url?: string;
};

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  service?: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  admin_notes?: string | null;
  created_at: string;
};

/* ------------------------------- auth token ------------------------------ */

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = () => Boolean(getToken());

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data as T;
}

/* --------------------------------- auth ---------------------------------- */

export async function login(username: string, password: string) {
  const data = await request<{ ok: boolean; token: string; user: { username: string; role: string } }>(
    '/api/admin/login',
    { method: 'POST', body: JSON.stringify({ username, password }) }
  );
  setToken(data.token);
  return data.user;
}

export function logout() {
  clearToken();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request<{ ok: boolean }>('/api/admin/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/* ----------------------------- site settings ------------------------------ */

export const getSite = () => request<SiteSettings>('/api/site');
export const updateSite = (site: SiteSettings) =>
  request<{ ok: boolean }>('/api/site', { method: 'PUT', body: JSON.stringify(site) });

export const submitContact = (payload: Omit<ContactSubmission, 'id' | 'status' | 'admin_notes' | 'created_at'>) =>
  request<{ ok: boolean; id: number; mailSent: boolean }>('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
export const getContactSubmissions = () => request<ContactSubmission[]>('/api/contact-submissions');
export const updateContactSubmission = (id: number, payload: Pick<ContactSubmission, 'status' | 'admin_notes'>) =>
  request<{ ok: boolean }>(`/api/contact-submissions/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

/* ------------------------------ page sections ------------------------------ */

export const getAllSections = () => request<PageSection[]>('/api/sections');
export const getPageSections = (page: string) => request<PageSection[]>(`/api/sections/${page}`);
export const saveSection = (page: string, section: string, content: any, title?: string) =>
  request<{ ok: boolean }>(`/api/sections/${page}/${section}`, {
    method: 'PUT',
    body: JSON.stringify({ content, title }),
  });
export const deleteSection = (page: string, section: string) =>
  request<{ ok: boolean }>(`/api/sections/${page}/${section}`, { method: 'DELETE' });

/* -------------------------------- categories -------------------------------- */

export const getCategories = (group?: 'portfolio' | 'service') =>
  request<Category[]>(`/api/categories${group ? `?group=${group}` : ''}`);
export const createCategory = (payload: Omit<Category, 'id'>) =>
  request<{ ok: boolean; id: number }>('/api/categories', { method: 'POST', body: JSON.stringify(payload) });
export const updateCategory = (id: number, payload: Partial<Category>) =>
  request<{ ok: boolean }>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteCategory = (id: number) =>
  request<{ ok: boolean }>(`/api/categories/${id}`, { method: 'DELETE' });

/* --------------------------------- services ---------------------------------- */

export const getServices = (type?: 'manual' | 'ai') =>
  request<ServiceItem[]>(`/api/services${type ? `?type=${type}` : ''}`);
export const createService = (payload: Partial<ServiceItem> & { items?: string[] }) =>
  request<{ ok: boolean; id: number }>('/api/services', { method: 'POST', body: JSON.stringify(payload) });
export const updateService = (id: number, payload: Partial<ServiceItem> & { items?: string[] }) =>
  request<{ ok: boolean }>(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteService = (id: number) =>
  request<{ ok: boolean }>(`/api/services/${id}`, { method: 'DELETE' });

/* -------------------------------- portfolio ----------------------------------- */

export const getPortfolio = (type?: 'manual' | 'ai', categoryId?: number) => {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (categoryId) params.set('category_id', String(categoryId));
  const qs = params.toString();
  return request<PortfolioItem[]>(`/api/portfolio${qs ? `?${qs}` : ''}`);
};
export const createPortfolioItem = (payload: Omit<PortfolioItem, 'id' | 'category_name'>) =>
  request<{ ok: boolean; id: number }>('/api/portfolio', { method: 'POST', body: JSON.stringify(payload) });
export const updatePortfolioItem = (id: number, payload: Partial<PortfolioItem>) =>
  request<{ ok: boolean }>(`/api/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deletePortfolioItem = (id: number) =>
  request<{ ok: boolean }>(`/api/portfolio/${id}`, { method: 'DELETE' });

/* ----------------------------- media / image upload ------------------------------ */

export async function uploadImage(file: File, alt = ''): Promise<{ id: number; url: string }> {
  const form = new FormData();
  form.append('image', file);
  form.append('alt', alt);
  const data = await request<{ ok: boolean; id: number; url: string }>('/api/upload', {
    method: 'POST',
    body: form,
  });
  return { id: data.id, url: `${API_BASE}${data.url}` };
}

export async function replaceImage(mediaId: number, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('image', file);
  const data = await request<{ ok: boolean; url: string }>(`/api/media/${mediaId}/replace`, {
    method: 'PUT',
    body: form,
  });
  return { url: `${API_BASE}${data.url}` };
}

export const getMedia = () => request<any[]>('/api/media');
export const deleteMedia = (id: number) => request<{ ok: boolean }>(`/api/media/${id}`, { method: 'DELETE' });

/* ------------------------- back-compat static fallback ------------------------- */
// Kept so pages not yet migrated to useSections() still compile & render.
// TODO: replace these call sites with useSections('<page>', defaultCmsContent.<page>)
// once each page is wired to live DB content (see src/hooks/useSections.ts).

const STORAGE_KEY = '360-retouching-cms';

export function loadCmsContent(): CmsContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCmsContent;
    return (JSON.parse(raw) as CmsContent) || defaultCmsContent;
  } catch {
    return defaultCmsContent;
  }
}

export function saveCmsContent(content: CmsContent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetCmsContent(): CmsContent {
  localStorage.removeItem(STORAGE_KEY);
  return defaultCmsContent;
}
