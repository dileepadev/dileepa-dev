import { api } from "@/lib/api";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { humanise } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project on dileepa.dev";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await api.getProject(slug);

  return ogCard({
    label: "Project",
    title: project?.name ?? slug,
    meta: project?.status ? humanise(project.status) : undefined,
  });
}
