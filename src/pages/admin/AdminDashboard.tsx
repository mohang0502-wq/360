import { useEffect, useState } from 'react';
import {
  FileText, Grid2x2, Image as ImageIcon, LayoutGrid, LogOut, Mail,
  Lock, Plus, Save, Tag, Trash2, Upload, X, ChevronDown, Eye, Pencil,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  isLoggedIn, logout, getSite, updateSite, changePassword, getPageSections, saveSection,
  getCategories, createCategory, updateCategory, deleteCategory,
  getPortfolio, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  getServices, createService, updateService, deleteService,
  getMedia, uploadImage, deleteMedia, deleteSection, getContactSubmissions, updateContactSubmission,
  uploadImageWithProgress, validateImageFile, IMAGE_UPLOAD_RULES,
  type SiteSettings, type Category, type PortfolioItem, type ServiceItem, type PageSection, type ContactSubmission,
} from '../../services/cmsService';
import { PAGE_REGISTRY } from '../../data/pageDefaults';

const TABS = [
  { key: 'site', label: 'Settings', icon: LayoutGrid },
  { key: 'sections', label: 'Page Sections', icon: FileText },
  { key: 'categories', label: 'Categories', icon: Tag },
  { key: 'portfolio', label: 'Portfolio', icon: ImageIcon },
  { key: 'services', label: 'Services', icon: Grid2x2 },
  { key: 'media', label: 'Media Library', icon: ImageIcon },
  { key: 'inquiries', label: 'Inquiries', icon: Mail },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('site');
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) navigate('/admin/login');
  }, [navigate]);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex flex-col lg:flex-row">
        <aside className="relative w-full shrink-0 bg-slate-900 text-white lg:min-h-screen lg:w-64">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 lg:px-5 lg:py-5">
            <img src="/images/360.png" alt="360° Retouching" className="h-10 w-auto lg:h-auto" />
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 lg:hidden">
              <LogOut size={16} /> Logout
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-2 lg:block lg:p-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition lg:mb-1 lg:w-full lg:gap-3 ${
                    activeTab === tab.key ? 'bg-white text-slate-900' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          <div className="absolute bottom-0 hidden w-64 border-t border-slate-800 p-3 lg:block">
            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800">
              <LogOut size={17} /> Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {toast && (
            <div className="fixed right-6 top-6 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
              {toast}
            </div>
          )}
          {activeTab === 'site' && <SiteSettingsTab notify={notify} />}
          {activeTab === 'sections' && <SectionsTab notify={notify} />}
          {activeTab === 'categories' && <CategoriesTab notify={notify} />}
          {activeTab === 'portfolio' && <PortfolioTab notify={notify} />}
          {activeTab === 'services' && <ServicesTab notify={notify} />}
          {activeTab === 'media' && <MediaTab notify={notify} />}
          {activeTab === 'inquiries' && <InquiriesTab notify={notify} />}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------- shared bits -------------------------------- */

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {title && <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>}
      {children}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, textarea, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {textarea ? (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
      )}
    </div>
  );
}

// Recommended sizes shown next to image fields, matched on the field path.
function imageHint(path: string): string {
  const p = path.toLowerCase();
  if (/hero\.images\.0|banner|statement|beforeimage|afterimage/.test(p)) return 'Recommended 1600×1200px or larger · landscape';
  if (/hero\.images/.test(p)) return 'Recommended 800×1000px · portrait';
  if (/avatar/.test(p)) return 'Recommended 200×200px · square';
  if (/team|thumbnail|portfoliocategories|aiservices|detailimage/.test(p)) return 'Recommended 900×1200px · portrait';
  return 'Recommended 1200×900px · JPG or WebP under 1 MB';
}

// Media picker: reuse an already-uploaded image instead of uploading a duplicate.
function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [media, setMedia] = useState<any[] | null>(null);
  useEffect(() => { getMedia().then(setMedia).catch(() => setMedia([])); }, []);
  return (
    <Modal title="Choose from Media Library" onClose={onClose}>
      {media === null ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : media.length === 0 ? (
        <p className="text-sm text-slate-400">No uploaded images yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {media.map((m) => (
            <button
              key={m.id}
              onClick={() => { onPick(m.url); onClose(); }}
              className="group overflow-hidden rounded-lg border border-slate-200 text-left hover:border-slate-900"
            >
              <img src={m.url} alt={m.alt_text || ''} className="h-24 w-full object-cover" />
              <p className="truncate px-2 py-1 text-[11px] text-slate-500 group-hover:text-slate-900">{m.original_name || m.filename}</p>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

// Image field: preview, drag-and-drop / click upload with progress, client
// validation, replace, reuse from the media library, and remove (confirmed).
function ImageField({ label, value, onChange, path = '' }: { label: string; value: string; onChange: (url: string) => void; path?: string }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [picking, setPicking] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  useEffect(() => setPreviewFailed(false), [value]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) { setError(problem); return; }
    setError('');
    setProgress(0);
    try {
      const { url } = await uploadImageWithProgress(file, label, setProgress);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setProgress(null);
    }
  };

  const remove = () => {
    if (value && window.confirm('Remove this image from the section? (The file stays in the Media Library.)')) onChange('');
  };

  return (
    <div className="mb-3">
      {label && <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
        className={`flex flex-col gap-3 rounded-xl border-2 border-dashed p-3 transition sm:flex-row sm:items-center ${dragOver ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-white'}`}
      >
        <div className="relative h-28 w-full flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200 sm:h-24 sm:w-32">
          {value && !previewFailed ? (
            <img src={value} alt="" onError={() => setPreviewFailed(true)} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
              <ImageIcon size={20} />
              <span className="text-[10px]">{value ? 'Not reachable' : 'No image'}</span>
            </div>
          )}
          {progress !== null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 text-xs font-semibold text-slate-700">
              {progress}%
              <div className="mt-1 h-1 w-3/4 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Drop an image here, upload, or paste a URL"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
          <div className="flex flex-wrap gap-2">
            <label className="flex cursor-pointer items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
              <Upload size={13} /> {value ? 'Replace' : 'Upload'}
              <input type="file" accept={IMAGE_UPLOAD_RULES.accept} hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
            </label>
            <button type="button" onClick={() => setPicking(true)} className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <ImageIcon size={13} /> Library
            </button>
            {value && (
              <>
                <a href={value} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Eye size={13} /> View
                </a>
                <button type="button" onClick={remove} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                  <Trash2 size={13} /> Remove
                </button>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400">{imageHint(path || label)} · max 10 MB</p>
          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>
      </div>
      {picking && <MediaPicker onPick={onChange} onClose={() => setPicking(false)} />}
    </div>
  );
}

const IMAGE_KEY_RE = /image|img|photo|thumbnail|src|before|after|logo|banner|avatar/i;
const NON_IMAGE_KEY_RE = /alt$|label|caption|title|desc|name/i;
const looksLikeImageValue = (v: string) => v === '' || /^(https?:\/\/|\/|data:image)/i.test(v);
const isImageField = (key: string, val: unknown) =>
  typeof val === 'string' && IMAGE_KEY_RE.test(key) && !NON_IMAGE_KEY_RE.test(key) && looksLikeImageValue(val);

/* --------------------------- generic JSON section editor --------------------------- */
// Renders ANY section's content_json as an editable form: strings, image
// fields, arrays of strings, and arrays/objects nested arbitrarily deep.
// Array items can be added, removed and reordered (image galleries included).

function JsonEditor({ value, onChange, path = '' }: { value: any; onChange: (v: any) => void; path?: string }) {
  if (value === null || value === undefined) {
    return <TextField label="value" value="" onChange={onChange} />;
  }

  if (typeof value === 'string') {
    return <TextField label="" value={value} onChange={onChange} textarea={value.length > 60} />;
  }

  if (typeof value === 'boolean') {
    return (
      <select value={String(value)} onChange={(e) => onChange(e.target.value === 'true')} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (typeof value === 'number') {
    return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />;
  }

  if (Array.isArray(value)) {
    const move = (from: number, to: number) => {
      if (to < 0 || to >= value.length) return;
      const next = [...value];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      onChange(next);
    };
    const blank = (sample: any): any => {
      if (typeof sample === 'string') return '';
      if (Array.isArray(sample)) return [];
      if (sample && typeof sample === 'object') return Object.fromEntries(Object.keys(sample).map((k) => [k, blank(sample[k])]));
      return sample ?? '';
    };
    return (
      <div className="space-y-2 rounded-lg border border-dashed border-slate-300 p-2 sm:p-3">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg bg-slate-50 p-2">
            <span className="mt-2 w-5 flex-shrink-0 text-center text-[11px] font-bold text-slate-400">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <JsonEditor
                path={`${path}.${i}`}
                value={item}
                onChange={(v) => {
                  const next = [...value];
                  next[i] = v;
                  onChange(next);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Move up" className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-900 disabled:opacity-30">
                <ChevronDown size={15} className="rotate-180" />
              </button>
              <button type="button" disabled={i === value.length - 1} onClick={() => move(i, i + 1)} aria-label="Move down" className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-900 disabled:opacity-30">
                <ChevronDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => { if (window.confirm('Remove this item?')) onChange(value.filter((_: any, idx: number) => idx !== i)); }}
                aria-label="Remove item"
                className="rounded p-1 text-slate-400 hover:bg-white hover:text-red-600"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, blank(value[0] ?? '')])}
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <Plus size={14} /> Add item
        </button>
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-3 rounded-lg border border-slate-200 p-2 sm:p-3">
        {Object.entries(value).map(([key, val]) => (
          <div key={key}>
            {isImageField(key, val) ? (
              <ImageField label={key} path={`${path}.${key}`} value={val as string} onChange={(v) => onChange({ ...value, [key]: v })} />
            ) : (
              <div className="mb-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</label>
                <JsonEditor path={`${path}.${key}`} value={val} onChange={(v) => onChange({ ...value, [key]: v })} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// Count image slots in a section so admins can spot image-bearing sections.
function countImages(value: any, key = ''): number {
  if (typeof value === 'string') return isImageField(key, value) ? 1 : 0;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countImages(v, key), 0);
  if (value && typeof value === 'object') return Object.entries(value).reduce((n, [k, v]) => n + countImages(v, k), 0);
  return 0;
}

type EditableSection = { section_key: string; content_json: any; title: string | null; saved: boolean; dirty: boolean };

function SectionsTab({ notify }: { notify: (m: string) => void }) {
  const pageKeys = Object.keys(PAGE_REGISTRY);
  const [page, setPage] = useState(pageKeys[0]);
  const [sections, setSections] = useState<EditableSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [newSectionKey, setNewSectionKey] = useState('');

  // Merge saved rows with registry defaults so every section — saved or not —
  // is editable. Saved object sections are layered over their defaults so new
  // image slots appear even on sections saved before they existed.
  const load = async (pageKey: string) => {
    setLoading(true);
    const defaults = PAGE_REGISTRY[pageKey]?.defaults ?? {};
    let rows: PageSection[] = [];
    try { rows = await getPageSections(pageKey); } catch (err) { notify(err instanceof Error ? err.message : 'Failed to load sections'); }
    const byKey = new Map(rows.map((r) => [r.section_key, r]));
    const keys = [...Object.keys(defaults), ...rows.map((r) => r.section_key).filter((k) => !(k in defaults))];
    setSections(keys.map((key) => {
      const row = byKey.get(key);
      const base = defaults[key];
      const content = row
        ? (base && typeof base === 'object' && !Array.isArray(base) && row.content_json && typeof row.content_json === 'object' && !Array.isArray(row.content_json)
            ? { ...base, ...row.content_json }
            : row.content_json)
        : structuredClone(base);
      return { section_key: key, content_json: content, title: row?.title ?? null, saved: Boolean(row), dirty: false };
    }));
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page]);

  const updateLocal = (sectionKey: string, content: any) => {
    setSections((prev) => prev.map((s) => (s.section_key === sectionKey ? { ...s, content_json: content, dirty: true } : s)));
  };

  const save = async (section: EditableSection) => {
    setSaving(section.section_key);
    try {
      await saveSection(page, section.section_key, section.content_json, section.title || undefined);
      setSections((prev) => prev.map((s) => (s.section_key === section.section_key ? { ...s, saved: true, dirty: false } : s)));
      notify(`Published "${section.section_key}" on ${PAGE_REGISTRY[page]?.label ?? page}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving('');
    }
  };

  const reset = async (section: EditableSection) => {
    if (!window.confirm(`Reset "${section.section_key}" to its default content? Saved changes for this section will be removed.`)) return;
    try {
      await deleteSection(page, section.section_key);
      notify(`Reset "${section.section_key}" to default`);
      load(page);
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Reset failed');
    }
  };

  const addSection = async () => {
    const key = newSectionKey.trim();
    if (!key) return;
    await saveSection(page, key, {});
    setNewSectionKey('');
    load(page);
  };

  const registry = PAGE_REGISTRY[page];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Page Sections</h1>
      <p className="mb-6 text-sm text-slate-500">Every block of copy and every image on the public site, editable here — no code changes needed. Changes go live when you press Publish.</p>

      <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {pageKeys.map((key) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
              page === key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
            }`}
          >
            {PAGE_REGISTRY[key].label}
          </button>
        ))}
      </div>

      {registry && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{sections.length} sections · {sections.reduce((n, s) => n + countImages(s.content_json), 0)} image slots</span>
          <a href={registry.route} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900">
            <Eye size={13} /> View {registry.label} page
          </a>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="space-y-3">
            {sections.map((section) => {
              const images = countImages(section.content_json);
              return (
                <details key={section.section_key} className="group rounded-xl border border-slate-200 bg-white shadow-sm">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm font-bold text-slate-900 sm:px-5">
                    <span className="flex flex-wrap items-center gap-2">
                      {section.section_key}
                      {images > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"><ImageIcon size={11} /> {images}</span>}
                      {!section.saved && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Default content</span>}
                      {section.dirty && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Unpublished changes</span>}
                    </span>
                    <ChevronDown size={17} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-slate-100 p-3 sm:p-5">
                    <JsonEditor path={section.section_key} value={section.content_json} onChange={(v) => updateLocal(section.section_key, v)} />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => save(section)}
                        disabled={saving === section.section_key}
                        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
                      >
                        <Save size={15} /> {saving === section.section_key ? 'Publishing…' : `Publish ${section.section_key}`}
                      </button>
                      {section.saved && section.section_key in (registry?.defaults ?? {}) && (
                        <button onClick={() => reset(section)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                          Reset to default
                        </button>
                      )}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>

          <Card title="Add new section">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={newSectionKey}
                onChange={(e) => setNewSectionKey(e.target.value)}
                placeholder="section key e.g. faq, testimonials"
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              />
              <button onClick={addSection} className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                <Plus size={15} /> Add
              </button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

function SiteSettingsTab({ notify }: { notify: (m: string) => void }) {
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    getSite().then(setSite);
  }, []);

  if (!site) return <p className="text-sm text-slate-400">Loading…</p>;

  const save = async () => {
    await updateSite(site);
    notify('Site settings saved');
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Site Settings</h1>
      <p className="mb-6 text-sm text-slate-500">Global name, tagline and contact details used across the site.</p>
      <Card>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">Branding</h3>
        <TextField label="Site Name" value={site.site_name} onChange={(v) => setSite({ ...site, site_name: v })} />
        <TextField label="Tagline" value={site.tagline} onChange={(v) => setSite({ ...site, tagline: v })} />
        <div className="grid gap-4 md:grid-cols-2">
          <ImageField label="Logo" value={site.logo_url || ''} onChange={(v) => setSite({ ...site, logo_url: v })} />
          <ImageField label="Favicon" value={site.favicon_url || ''} onChange={(v) => setSite({ ...site, favicon_url: v })} />
        </div>
        <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-slate-700">Contact Details</h3>
        <TextField label="Phone" value={site.phone} onChange={(v) => setSite({ ...site, phone: v })} />
        <TextField label="Email" value={site.email} onChange={(v) => setSite({ ...site, email: v })} />
        <TextField label="WhatsApp URL" value={site.whatsapp || ''} onChange={(v) => setSite({ ...site, whatsapp: v })} />
        <TextField label="Address" value={site.address || ''} onChange={(v) => setSite({ ...site, address: v })} textarea />
        <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-slate-700">Social Media Links</h3>
        <div className="grid gap-x-4 md:grid-cols-2">
          <TextField label="Facebook URL" value={site.facebook || ''} onChange={(v) => setSite({ ...site, facebook: v })} />
          <TextField label="Instagram URL" value={site.instagram || ''} onChange={(v) => setSite({ ...site, instagram: v })} />
          <TextField label="LinkedIn URL" value={site.linkedin || ''} onChange={(v) => setSite({ ...site, linkedin: v })} />
          <TextField label="YouTube URL" value={site.youtube || ''} onChange={(v) => setSite({ ...site, youtube: v })} />
        </div>
        <button onClick={save} className="mt-2 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          <Save size={15} /> Save
        </button>
      </Card>
      <Card title="Update admin password">
        <div className="grid gap-x-4 md:grid-cols-3">
          <TextField label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} />
          <TextField label="New Password" type="password" value={newPassword} onChange={setNewPassword} />
          <TextField label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
        </div>
        <button
          onClick={async () => {
            if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
              notify('Enter all passwords and make sure the new passwords match');
              return;
            }
            try {
              await changePassword(currentPassword, newPassword);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              notify('Admin password updated');
            } catch (error) {
              notify(error instanceof Error ? error.message : 'Failed to update password');
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Lock size={15} /> Update password
        </button>
      </Card>
    </div>
  );
}

function CategoriesTab({ notify }: { notify: (m: string) => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [group, setGroup] = useState<'portfolio' | 'service'>('portfolio');
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const refresh = () => getCategories().then(setCategories);
  useEffect(() => { refresh(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await createCategory({ group_type: group, name: name.trim(), slug, parent_id: parentId, sort_order: categories.length });
    setName('');
    setParentId(null);
    setModalOpen(false);
    refresh();
    notify('Category added');
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setParentId(category.parent_id || null);
    setModalOpen(true);
  };

  const saveCategory = async () => {
    if (!name.trim()) return;
    if (editingCategory) {
      await updateCategory(editingCategory.id, { ...editingCategory, name: name.trim() });
      notify('Category updated');
    } else {
      await add();
      return;
    }
    setEditingCategory(null);
    setName('');
    setParentId(null);
    setModalOpen(false);
    refresh();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this category? Items using it will become uncategorized.')) return;
    await deleteCategory(id);
    refresh();
    notify('Category deleted');
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Categories</h1>
      <p className="mb-6 text-sm text-slate-500">Used by Portfolio and Services. Add as many as you need — no code changes.</p>

      <button onClick={() => { setEditingCategory(null); setName(''); setModalOpen(true); }} className="mb-6 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"><Plus size={15} /> Add category</button>
      {modalOpen && <Modal title={editingCategory ? 'Edit category' : 'Add category'} onClose={() => setModalOpen(false)}><div className="grid gap-2 md:grid-cols-4"><select disabled={Boolean(editingCategory)} value={editingCategory?.group_type || group} onChange={(e) => setGroup(e.target.value as any)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option value="portfolio">Portfolio</option><option value="service">Service</option></select><select value={parentId || ''} onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option value="">Main category</option>{categories.filter((c) => c.group_type === group && !c.parent_id && c.id !== editingCategory?.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" /><button onClick={saveCategory} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save</button></div></Modal>}

      {(['portfolio', 'service'] as const).map((g) => (
        <Card key={g} title={`${g === 'portfolio' ? 'Portfolio' : 'Service'} categories`}>
          <div className="divide-y divide-slate-100">
            {categories.filter((c) => c.group_type === g).map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 py-2">
                <span className={`flex-1 text-sm font-semibold text-slate-800 ${cat.parent_id ? 'pl-6 text-slate-600' : ''}`}>{cat.parent_id ? `↳ ${cat.name}` : cat.name}</span>
                <span className="text-xs text-slate-400">{cat.slug}</span>
                <button onClick={() => openEdit(cat)} title="Edit" className="rounded-md border border-slate-300 p-1.5 text-slate-600 hover:bg-slate-50"><Pencil size={14} /></button>
                <button onClick={() => remove(cat.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
            {categories.filter((c) => c.group_type === g).length === 0 && <p className="py-2 text-sm text-slate-400">No categories yet.</p>}
          </div>
        </Card>
      ))}
    </div>
  );
}

function PortfolioTab({ notify }: { notify: (m: string) => void }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<PortfolioItem>>({ type: 'manual', caption: '', before_image: '', after_image: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => getPortfolio().then(setItems);
  useEffect(() => { refresh(); getCategories('portfolio').then(setCategories); }, []);

  const resetForm = () => {
    setForm({ type: 'manual', caption: '', before_image: '', after_image: '' });
    setEditingId(null);
    setModalOpen(false);
  };

  const save = async () => {
    if (!form.caption || !form.before_image || !form.after_image) return notify('Caption, before & after images required');
    if (editingId) {
      await updatePortfolioItem(editingId, form);
      notify('Portfolio item updated');
    } else {
      await createPortfolioItem(form as Omit<PortfolioItem, 'id' | 'category_name'>);
      notify('Portfolio item added');
    }
    resetForm();
    refresh();
  };

  const edit = (item: PortfolioItem) => {
    setForm(item);
    setEditingId(item.id);
    setModalOpen(true);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this portfolio item?')) return;
    await deletePortfolioItem(id);
    refresh();
    notify('Portfolio item deleted');
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Portfolio</h1>
      <p className="mb-6 text-sm text-slate-500">Before/after gallery items, tagged to a category.</p>
      <button onClick={() => { resetForm(); setModalOpen(true); }} className="mb-6 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"><Plus size={15} /> Add portfolio item</button>

      {modalOpen && <Modal title={editingId ? 'Edit portfolio item' : 'Add portfolio item'} onClose={() => setModalOpen(false)}><Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="manual">Manual</option>
              <option value="ai">AI</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
            <select value={form.category_id ?? ''} onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <TextField label="Caption" value={form.caption || ''} onChange={(v) => setForm({ ...form, caption: v })} />
        <ImageField label="Before Image" value={form.before_image || ''} onChange={(v) => setForm({ ...form, before_image: v })} />
        <ImageField label="After Image" value={form.after_image || ''} onChange={(v) => setForm({ ...form, after_image: v })} />
        <div className="mt-2 flex gap-2">
          <button onClick={save} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            <Save size={15} /> {editingId ? 'Update' : 'Add item'}
          </button>
          {editingId && <button onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>}
        </div>
      </Card></Modal>}

      <Card title={`All items (${items.length})`}>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="py-3">Preview</th><th>Caption</th><th>Type</th><th>Category</th><th className="text-right">Actions</th></tr></thead><tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0">
              <td className="py-3"><div className="flex gap-1">
                <img src={item.before_image} className="h-20 w-1/2 rounded object-cover" />
                <img src={item.after_image} className="h-20 w-1/2 rounded object-cover" />
              </div></td><td className="font-semibold text-slate-800">{item.caption}</td><td className="capitalize text-slate-500">{item.type}</td><td className="text-slate-500">{item.category_name || 'Uncategorized'}</td><td><div className="flex justify-end gap-2"><button onClick={() => edit(item)} title="View / edit" className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"><Pencil size={14} /></button><button onClick={() => remove(item.id)} title="Delete" className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button></div></td>
            </tr>
          ))}
        </tbody></table></div>
      </Card>
    </div>
  );
}

function ServicesTab({ notify }: { notify: (m: string) => void }) {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<ServiceItem> & { itemsText?: string }>({ type: 'manual', title: '', description: '', image_url: '', itemsText: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = () => getServices().then(setItems);
  useEffect(() => { refresh(); getCategories('service').then(setCategories); }, []);

  const resetForm = () => {
    setForm({ type: 'manual', title: '', description: '', image_url: '', itemsText: '' });
    setEditingId(null);
    setModalOpen(false);
  };

  const save = async () => {
    if (!form.title) return notify('Title is required');
    const payload = {
      type: form.type,
      category_id: form.category_id ?? null,
      title: form.title,
      description: form.description || '',
      image_url: form.image_url || '',
      items: (form.itemsText || '').split('\n').map((s) => s.trim()).filter(Boolean),
    };
    if (editingId) {
      await updateService(editingId, payload as any);
      notify('Service updated');
    } else {
      await createService(payload as any);
      notify('Service added');
    }
    resetForm();
    refresh();
  };

  const edit = (item: ServiceItem) => {
    setForm({ ...item, itemsText: (item.items_json || []).join('\n') });
    setEditingId(item.id);
    setModalOpen(true);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await deleteService(id);
    refresh();
    notify('Service deleted');
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Services</h1>
      <p className="mb-6 text-sm text-slate-500">Manual & AI service cards shown on the Services pages.</p>
      <button onClick={() => { resetForm(); setModalOpen(true); }} className="mb-6 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"><Plus size={15} /> Add service</button>

      {modalOpen && <Modal title={editingId ? 'Edit service' : 'Add service'} onClose={() => setModalOpen(false)}><Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="manual">Manual</option>
              <option value="ai">AI</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
            <select value={form.category_id ?? ''} onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <TextField label="Title" value={form.title || ''} onChange={(v) => setForm({ ...form, title: v })} />
        <TextField label="Description" value={form.description || ''} onChange={(v) => setForm({ ...form, description: v })} textarea />
        <ImageField label="Image" value={form.image_url || ''} onChange={(v) => setForm({ ...form, image_url: v })} />
        <TextField label="Bullet items (one per line)" value={form.itemsText || ''} onChange={(v) => setForm({ ...form, itemsText: v })} textarea />
        <div className="mt-2 flex gap-2">
          <button onClick={save} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
            <Save size={15} /> {editingId ? 'Update' : 'Add service'}
          </button>
          {editingId && <button onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button>}
        </div>
      </Card></Modal>}

      <Card title={`All services (${items.length})`}>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="py-3">Image</th><th>Title</th><th>Type</th><th>Category</th><th className="text-right">Actions</th></tr></thead><tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="py-3">{item.image_url ? <img src={item.image_url} className="h-14 w-14 rounded-lg object-cover" /> : <div className="h-14 w-14 rounded-lg bg-slate-100" />}</td><td className="font-semibold text-slate-800">{item.title}</td><td className="capitalize text-slate-500">{item.type}</td><td className="text-slate-500">{categories.find((c) => c.id === item.category_id)?.name || 'Uncategorized'}</td><td><div className="flex justify-end gap-2"><button onClick={() => edit(item)} title="View / edit" className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"><Pencil size={14} /></button><button onClick={() => remove(item.id)} title="Delete" className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button></div></td></tr>
          ))}
        </tbody></table></div>
      </Card>
    </div>
  );
}

function MediaTab({ notify }: { notify: (m: string) => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const refresh = () => getMedia().then(setMedia);
  useEffect(() => { refresh(); }, []);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    if (problem) { alert(problem); return; }
    setUploading(true);
    try {
      await uploadImage(file);
      refresh();
      notify('Image uploaded');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this image permanently?')) return;
    try {
      await deleteMedia(id);
    } catch (err) {
      // 409: still referenced by a page section, service, portfolio item or settings
      const message = err instanceof Error ? err.message : 'Delete failed';
      const inUse = message.startsWith('Image is still used');
      if (!inUse) { alert(message); return; }
      if (!confirm(`${message}

Delete anyway? Those places will show a placeholder until a new image is chosen.`)) return;
      await deleteMedia(id, true);
    }
    refresh();
    notify('Image deleted');
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Media Library</h1>
      <p className="mb-6 text-sm text-slate-500">Every image uploaded from anywhere in the admin panel shows up here.</p>

      <Card>
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          <Upload size={15} /> {uploading ? 'Uploading…' : 'Upload image'}
          <input type="file" accept={IMAGE_UPLOAD_RULES.accept} hidden onChange={(e) => { handleUpload(e.target.files?.[0]); e.target.value = ''; }} />
        </label>
      </Card>

      <Card title={`${media.length} images`}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {media.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-lg ring-1 ring-slate-200">
              <img src={m.url} alt={m.alt_text || ''} className="h-24 w-full object-cover" />
              <button onClick={() => remove(m.id)} aria-label="Delete image" className="absolute right-1 top-1 rounded-full bg-red-600 p-1.5 text-white shadow md:hidden md:group-hover:block">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InquiriesTab({ notify }: { notify: (m: string) => void }) {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [status, setStatus] = useState<ContactSubmission['status']>('new');
  const [notes, setNotes] = useState('');

  const refresh = () => getContactSubmissions().then(setItems).catch(() => notify('Unable to load enquiries'));
  useEffect(() => { refresh(); }, []);

  const open = (item: ContactSubmission) => {
    setSelected(item);
    setStatus(item.status);
    setNotes(item.admin_notes || '');
  };

  const save = async () => {
    if (!selected) return;
    await updateContactSubmission(selected.id, { status, admin_notes: notes });
    notify('Enquiry updated');
    setSelected(null);
    refresh();
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold text-slate-900">Inquiries</h1>
      <p className="mb-6 text-sm text-slate-500">Messages submitted through the website, with status and internal notes.</p>
      <Card title={`All enquiries (${items.length})`}>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400"><th className="py-3">Name</th><th>Email</th><th>Service</th><th>Status</th><th>Date</th><th className="text-right">Actions</th></tr></thead><tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0"><td className="py-3 font-semibold text-slate-800">{item.name}</td><td className="text-slate-500">{item.email}</td><td className="text-slate-500">{item.service || '-'}</td><td><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.status === 'new' ? 'bg-amber-100 text-amber-700' : item.status === 'replied' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.status}</span></td><td className="text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td><td><div className="flex justify-end"><button onClick={() => open(item)} title="View / edit" className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"><Eye size={14} /></button></div></td></tr>
          ))}
          {!items.length && <tr><td colSpan={6} className="py-12 text-center text-sm text-slate-400">No enquiries yet.</td></tr>}
        </tbody></table></div>
      </Card>
      {selected && <Modal title={`Enquiry from ${selected.name}`} onClose={() => setSelected(null)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p><a className="text-sm text-slate-800 underline" href={`mailto:${selected.email}`}>{selected.email}</a></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p><p className="text-sm text-slate-800">{selected.phone || '-'}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company</p><p className="text-sm text-slate-800">{selected.company || '-'}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Service</p><p className="text-sm text-slate-800">{selected.service || '-'}</p></div>
        </div>
        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{selected.message}</div>
        <div className="mt-5"><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label><select value={status} onChange={(e) => setStatus(e.target.value as ContactSubmission['status'])} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select></div>
        <div className="mt-4"><label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Internal notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" placeholder="Add follow-up notes..." /></div>
        <button onClick={save} className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"><Save size={15} /> Save changes</button>
      </Modal>}
    </div>
  );
}
