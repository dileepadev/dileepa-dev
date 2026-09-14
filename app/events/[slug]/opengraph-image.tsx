import { api } from "@/lib/api";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { formatDate } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Event on dileepa.dev";

/**
 * The cards are drawn at build time, once per deploy.
 *
 * A metadata route always *attempts* build-time prerendering, but in a dynamic
 * segment it has no list of slugs to prerender for, so without this it bails to
 * on-demand rendering - a Satori layout pass and a resvg PNG encode per
 * request, which is the most CPU-expensive thing this site can be asked for.
 *
 * The same list the page prerenders from, so the cards and the pages cannot
 * disagree about which records exist. `dynamicParams` stays open on the page,
 * so a record added since the last build still renders its card on demand.
 */
export async function generateStaticParams() {
  const events = await api.getEvents({ limit: 200 });
  return events.map((event) => ({ slug: event.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await api.getEvent(slug);

  return ogCard({
    path: `/events/${slug}`,
    label: "Event",
    title: event?.title ?? slug,
    meta: event?.startAt ? formatDate(event.startAt) : undefined,
  });
}
