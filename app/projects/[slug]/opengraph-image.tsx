import { api } from "@/lib/api";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { humanise } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project on dileepa.dev";

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
  const projects = await api.getProjects({ limit: 100 });
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await api.getProject(slug);

  return ogCard({
    path: `/projects/${slug}`,
    label: "Project",
    title: project?.name ?? slug,
    meta: project?.status ? humanise(project.status) : undefined,
  });
}
