import { useEffect, useState } from 'react';
import { getPageSections, type PageSection } from '../services/cmsService';

const isPlainObject = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

// Loads every section row for a page (e.g. "home", "about", "contact")
// and returns them keyed by section_key, e.g. sections.hero, sections.trust.
// Falls back to `fallback` while loading / if the API call fails, so a page
// never renders blank before the DB content arrives. Saved object sections are
// merged over their defaults, so fields added later (e.g. new image slots)
// still render their default until an admin saves a value.
export function useSections<T extends Record<string, any>>(page: string, fallback: T) {
  const [sections, setSections] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getPageSections(page)
      .then((rows: PageSection[]) => {
        if (cancelled) return;
        const merged: Record<string, any> = { ...fallback };
        rows.forEach((row) => {
          const base = (fallback as Record<string, any>)[row.section_key];
          merged[row.section_key] = isPlainObject(base) && isPlainObject(row.content_json)
            ? { ...base, ...row.content_json }
            : row.content_json;
        });
        setSections(merged as T);
      })
      .catch(() => {
        // keep fallback content if the API/DB isn't reachable
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  return { sections, loading };
}
