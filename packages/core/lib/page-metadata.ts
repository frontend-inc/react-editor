import { Data } from "../types";

/**
 * Framework-agnostic SEO output shape. Mirrors the subset of Next.js's
 * Metadata type that most page builders care about — title, description,
 * Open Graph, canonical. Consumers can feed this directly into Next's
 * generateMetadata or adapt it for other frameworks.
 */
export type PageMetadata = {
  title?: string;
  description?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{ url: string }>;
  };
  alternates?: {
    canonical?: string;
  };
};

/**
 * Extracts SEO fields from a page's Root props. The convention: authors add
 * `title`, `description`, `ogTitle`, `ogDescription`, `ogImage`, `canonical`
 * fields to their root config. This helper maps them into a metadata shape
 * you can return from Next's generateMetadata (or equivalent).
 *
 *   export async function generateMetadata({ params }) {
 *     const data = await loadPage(params.slug);
 *     return pageMetadata(data);
 *   }
 *
 * Returns an empty object when no fields are set — safe to call on any
 * data, including missing-page fallbacks.
 */
export function pageMetadata(data: Data | undefined | null): PageMetadata {
  const root = (data?.root as any)?.props ?? {};
  const out: PageMetadata = {};

  if (root.title) out.title = root.title;
  if (root.description) out.description = root.description;

  const ogTitle = root.ogTitle ?? root.title;
  const ogDescription = root.ogDescription ?? root.description;
  const ogImage: string | undefined = root.ogImage;

  if (ogTitle || ogDescription || ogImage) {
    out.openGraph = {};
    if (ogTitle) out.openGraph.title = ogTitle;
    if (ogDescription) out.openGraph.description = ogDescription;
    if (ogImage) out.openGraph.images = [{ url: ogImage }];
  }

  if (root.canonical) {
    out.alternates = { canonical: root.canonical };
  }

  return out;
}
