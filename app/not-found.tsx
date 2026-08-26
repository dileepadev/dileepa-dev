import { NotFoundPage } from "@/components/ui";

export default function NotFound() {
  return (
    <NotFoundPage
      heading="That page is not here"
      back={{ href: "/blog", label: "Read the blog" }}
    >
      The link may be out of date, or the page may have moved. The blog,
      projects and events are all reachable from the navigation.
    </NotFoundPage>
  );
}
