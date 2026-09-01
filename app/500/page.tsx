import type { Metadata } from "next";
import { ErrorPage } from "@/components/ui";
import { PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

/**
 * The 500 page at a stable address.
 *
 * `error.tsx` renders only when a render actually fails, so without this there
 * is no way to look at the screen, link to it from the sitemap page, or check
 * it in either theme. It renders the same component the boundary does, with a
 * digest that names itself as the preview - `error.tsx` checks for that string
 * before logging, so opening this page does not write a fake error to the
 * console.
 */
const PREVIEW_ERROR = Object.assign(
  new Error("Sample SSR render pipeline fault for telemetry preview"),
  { digest: "0x500_TELEMETRY_DEMO" },
);

export const metadata: Metadata = pageMetadata({
  title: PAGES.error500.meta.title,
  description: PAGES.error500.meta.description,
  path: "/500",
  noindex: true,
});

export default function Error500PreviewPage() {
  return <ErrorPage error={PREVIEW_ERROR} />;
}
