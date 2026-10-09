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
  category_name?: string | null;
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
// A stored token only counts while its JWT expiry is in the future.
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
      clearToken();
      return false;
    }
    return true;
  } catch {
    clearToken();
    return false;
  }
};

// Expired/invalid session on an authenticated call: drop the token and send the
// admin back to the login screen instead of failing every request silently.
function handleUnauthorized(path: string) {
  if (!getToken() || path === '/api/admin/login') return;
  clearToken();
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/admin/login')) {
    window.location.assign('/admin/login?expired=1');
  }
}

/* ------------------------------ image URLs -------------------------------- */
// Two classes of stored image URL were breaking on the public site:
//  1. Uploads saved with the uploader's API host baked in, e.g.
//     "http://localhost:4000/uploads/x.jpg" — dead on every other machine/domain.
//  2. Public asset paths with "%26" (an encoded "&"), e.g.
//     "/images/Fashion%20%26%20Lifestyle/..." — Vite (and some static hosts)
//     don't decode it and answer with index.html instead of the image.
// Storage form is host-less ("/uploads/x.jpg") with a literal "&"; the display
// form prefixes uploads with the current API_BASE.
const UPLOAD_RE = /^(?:https?:\/\/[^/]+)?(\/uploads\/[^?#\s]+)$/i;
const LOCAL_ASSET_RE = /^\/(?:images|generated-images)\//i;

export function toStoredImageUrl(value: string): string {
  const upload = value.match(UPLOAD_RE);
  if (upload) return upload[1];
  if (LOCAL_ASSET_RE.test(value)) return value.replace(/%26/gi, '&');
  return value;
}

export function resolveImageUrl(value: string | null | undefined): string {
  if (!value) return '';
  const stored = toStoredImageUrl(value);
  return stored.startsWith('/uploads/') ? `${API_BASE}${stored}` : stored;
}

function mapStrings(value: any, fn: (s: string) => string): any {
  if (typeof value === 'string') return fn(value);
  if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn));
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = mapStrings(v, fn);
    return out;
  }
  return value;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  // Persist image URLs host-less so content survives domain/env changes.
  let body = options.body;
  if (typeof body === 'string') {
    try { body = JSON.stringify(mapStrings(JSON.parse(body), toStoredImageUrl)); } catch { /* not JSON */ }
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, body, headers });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) handleUnauthorized(path);
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return mapStrings(data, (s) => (UPLOAD_RE.test(s) || LOCAL_ASSET_RE.test(s) ? resolveImageUrl(s) : s)) as T;
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
  return { id: data.id, url: data.url };
}

export const IMAGE_UPLOAD_RULES = {
  maxBytes: 10 * 1024 * 1024,
  types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'],
  accept: '.jpg,.jpeg,.png,.webp,.avif,.gif,.svg',
};

// Returns an error message, or '' when the file is acceptable. The server
// re-validates (type + extension + size) — this is only for fast feedback.
export function validateImageFile(file: File): string {
  if (!IMAGE_UPLOAD_RULES.types.includes(file.type)) return 'Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF or SVG.';
  if (file.size > IMAGE_UPLOAD_RULES.maxBytes) return `File is ${(file.size / 1048576).toFixed(1)} MB — the maximum is 10 MB.`;
  return '';
}

// Upload with progress reporting (fetch has no upload progress events).
export function uploadImageWithProgress(file: File, alt = '', onProgress?: (pct: number) => void): Promise<{ id: number; url: string }> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('image', file);
    form.append('alt', alt);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/upload`);
    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      let data: any = {};
      try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status === 401) handleUnauthorized('/api/upload');
      if (xhr.status >= 200 && xhr.status < 300) resolve({ id: data.id, url: resolveImageUrl(data.url) });
      else reject(new Error(data.message || `Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error('Network error while uploading. Is the API running?'));
    xhr.send(form);
  });
}

export async function replaceImage(mediaId: number, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('image', file);
  const data = await request<{ ok: boolean; url: string }>(`/api/media/${mediaId}/replace`, {
    method: 'PUT',
    body: form,
  });
  return { url: data.url };
}

export const getMedia = () => request<any[]>('/api/media');
export const deleteMedia = (id: number, force = false) =>
  request<{ ok: boolean }>(`/api/media/${id}${force ? '?force=1' : ''}`, { method: 'DELETE' });

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
