import Link from "next/link";
import { PAGES_LIST, type PageSummary } from "@/lib/constants";

/**
 * Where to go next, at the foot of a short page (v2.1.0 draft).
 *
 * /education holds four records, so the page ended a screen in, with the
 * footer riding up under it - a different shape from every index page around
 * it. Rather than pad it, it ends by pointing on: one tile per page, named and
 * described the way `PAGES_LIST` (and the sitemap) describe it, so the copy
 * cannot drift from the page it links to.
 */
export function KeepExploring({ pages }: { pages: PageSummary["key"][] }) {
  const items = pages
    .map((key) => PAGES_LIST.find((page) => page.key === key))
    .filter((page): page is PageSummary => Boolean(page));
  if (items.length === 0) return null;

  return (
    <nav className="keep-exploring" aria-labelledby="keep-exploring-title">
      <h2 id="keep-exploring-title" className="keep-exploring-title">
        Keep exploring
      </h2>
      <ul className="tile-grid tile-grid--3">
        {items.map((page) => (
          <li key={page.key} className="tile-card">
            <div className="tile-meta">
              <span>{page.path}</span>
            </div>
            <h3 className="tile-title">
              <Link href={page.path} className="text-link">
                {page.title}
              </Link>
            </h3>
            <p className="tile-desc">{page.intro}</p>
          </li>
        ))}
      </ul>
    </nav>
  );
}
