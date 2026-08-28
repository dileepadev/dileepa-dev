import { NotFoundPage, NotFoundVisual } from "@/components/ui";

export default function NotFound() {
  return (
    <NotFoundPage
      heading="That page is not here"
      back={{ href: "/sitemap", label: "Explore the sitemap" }}
      aside={<NotFoundVisual />}
    >
      The link may be out of date, or the page may have moved. Every page and
      resource across the site is reachable from the sitemap.
    </NotFoundPage>
  );
}
