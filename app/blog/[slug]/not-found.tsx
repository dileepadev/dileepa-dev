import { NotFoundPage, NotFoundVisual } from "@/components/ui";

export default function PostNotFound() {
  return (
    <NotFoundPage
      path="/blog/404"
      heading="That post is not here"
      back={{ href: "/blog", label: "See every post" }}
      aside={<NotFoundVisual />}
    >
      The link may be out of date. Posts are never renamed once published, so a
      slug that does not resolve was most likely mistyped or truncated on its
      way here.
    </NotFoundPage>
  );
}
