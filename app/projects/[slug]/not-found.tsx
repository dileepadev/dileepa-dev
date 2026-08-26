import { NotFoundPage } from "@/components/ui";

export default function ProjectNotFound() {
  return (
    <NotFoundPage
      heading="That project is not here"
      back={{ href: "/projects", label: "See every project" }}
    >
      The link may be out of date, or the project may have been unpublished.
    </NotFoundPage>
  );
}
