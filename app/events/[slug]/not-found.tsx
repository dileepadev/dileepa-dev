import { NotFoundPage, NotFoundVisual } from "@/components/ui";

export default function EventNotFound() {
  return (
    <NotFoundPage
      path="/events/404"
      heading="That event is not here"
      back={{ href: "/events", label: "See every event" }}
      aside={<NotFoundVisual />}
    >
      The link may be out of date, or the event may have been unpublished.
    </NotFoundPage>
  );
}
