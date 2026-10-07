import { useEffect, useState } from 'react';
import { getPageSections, type PageSection } from '../services/cmsService';

// Loads every section row for a page (e.g. "home", "about", "contact")
// and returns them keyed by section_key, e.g. sections.hero, sections.trust.
// Falls back to `fallback` while loading / if the API call fails, so a page
// never renders blank before the DB content arrives.
export function useSections<T extends Record<string, any>>(page: string, fallback: T) {
  const [sections, setSections] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getPageSections(page)
      .then((rows: PageSection[]) => {
        if (cancelled) return;
        const merged = { ...fallback };
        rows.forEach((row) => {
          (merged as any)[row.section_key] = row.content_json;
        });
        setSections(merged);
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
