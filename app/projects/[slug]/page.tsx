import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, FileText, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Badge, Chip, Container, LinkButton, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";
import { formatMonth, humanise } from "@/lib/format";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await api.getProjects({ limit: 100 });
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await api.getProject(slug);
  if (!project) return { title: "Project not found" };

  const title = project.seo?.metaTitle || project.name;
  const description = project.seo?.metaDescription || project.tagline;
  const image = project.seo?.ogImage || project.cover?.url;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_CONFIG.url}/projects/${project.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function period(start?: string | null, end?: string | null): string {
  const from = formatMonth(start);
  if (!from) return "";
  return end ? `${from} – ${formatMonth(end)}` : `${from} – present`;
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await api.getProject(slug);
  if (!project) notFound();

  const links = Object.entries(project.links ?? {}).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  return (
    <Section>
      <Container>
        <div className="section-label">
          {humanise(project.status)}
          {project.period?.start &&
            ` · ${period(project.period.start, project.period.end)}`}
        </div>

        <h1>{project.name}</h1>
        {project.tagline && (
          <p className="mt-4 text-h3 text-fg-muted">{project.tagline}</p>
        )}

        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {links.map(([kind, url]) => {
              const lower = kind.toLowerCase();
              const isGithub =
                lower.includes("github") ||
                lower.includes("repo") ||
                lower.includes("source");
              const Icon = isGithub
                ? FaGithub
                : lower.includes("demo") ||
                    lower.includes("live") ||
                    lower.includes("site")
                  ? Globe
                  : lower.includes("doc") || lower.includes("paper")
                    ? FileText
                    : ExternalLink;

              return (
                <LinkButton
                  key={kind}
                  href={url}
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{humanise(kind)}</span>
                </LinkButton>
              );
            })}
          </div>
        )}

        {project.cover && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-lg border border-border-strong bg-bg-surface">
            <Image
              src={project.cover.url}
              alt={project.cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {project.description && (
          <div className="prose mt-10">
            {project.description.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {(project.highlights ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Highlights</h2>
            <ul className="mt-4 space-y-2">
              {(project.highlights ?? []).map((highlight) => (
                <li key={highlight} className="max-w-[68ch] text-fg-muted">
                  {highlight}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(project.metrics ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Numbers</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              {(project.metrics ?? []).map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-border-strong bg-bg-surface p-6"
                >
                  <dt className="font-mono text-small text-fg-muted">
                    {metric.label}
                  </dt>
                  <dd className="mt-2 font-mono text-h2 text-fg">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {(project.stack ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Built with</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(project.stack ?? []).map((tech) => (
                <li key={tech}>
                  <Chip>{tech}</Chip>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(project.gallery ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Gallery</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[...(project.gallery ?? [])]
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <figure key={item.url}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border-strong bg-bg-surface">
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 380px"
                        className="object-cover"
                      />
                    </div>
                    {item.caption && (
                      <figcaption className="mt-2 font-mono text-small text-fg-muted">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
            </div>
          </section>
        )}

        {(project.tags ?? []).length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {(project.tags ?? []).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
