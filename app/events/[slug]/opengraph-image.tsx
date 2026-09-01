import { api } from "@/lib/api";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { formatDate } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Event on dileepa.dev";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await api.getEvent(slug);

  return ogCard({
    label: "Event",
    title: event?.title ?? slug,
    meta: event?.startAt ? formatDate(event.startAt) : undefined,
  });
}
