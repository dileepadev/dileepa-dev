import { NotFoundPage } from "@/components/ui";

export default function EventNotFound() {
  return (
    <NotFoundPage
      heading="That event is not here"
      back={{ href: "/events", label: "See every event" }}
    >
      The link may be out of date, or the event may have been unpublished.
    </NotFoundPage>
  );
}
