import { NotFoundPage } from "@/components/ui";

export default function PostNotFound() {
  return (
    <NotFoundPage
      heading="That post is not here"
      back={{ href: "/blog", label: "See every post" }}
    >
      The link may be out of date. Posts are never renamed once published, so a
      slug that does not resolve was most likely mistyped or truncated on its
      way here.
    </NotFoundPage>
  );
}
