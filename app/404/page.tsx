import NotFound from "@/app/not-found";

/**
 * The 404 page at a stable address.
 *
 * `not-found.tsx` renders on any unmatched path and cannot be linked to; this
 * is the same screen at a URL, so the sitemap page can list it and it can be
 * checked without breaking something first. It renders the same component
 * rather than a copy of it - two 404 screens that drift apart is exactly what
 * this route exists to make visible.
 *
 * **No `metadata` export here, deliberately.** Next reserves the `/404` route
 * name: it serves this page with a real `404` status and renders it through
 * the not-found path, which supplies its own `noindex` and ignores a page-level
 * `metadata`. An export here looks like it works and does nothing. `/500`
 * behaves differently - it also gets its status from the route name, but its
 * metadata is honoured - so the two are not symmetrical and cannot be made so
 * from application code. `PAGES.notFound.meta` still describes this route for
 * the sitemap page's listing.
 */
export default function Page404() {
  return <NotFound />;
}
