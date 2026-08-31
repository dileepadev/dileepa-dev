import { NotFoundPage, NotFoundVisual } from "@/components/ui";

export default function ProjectNotFound() {
  return (
    <NotFoundPage
      path="/projects/404"
      heading="That project is not here"
      back={{ href: "/projects", label: "See every project" }}
      aside={<NotFoundVisual />}
    >
      The link may be out of date, or the project may have been unpublished.
    </NotFoundPage>
  );
}
