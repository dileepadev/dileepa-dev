"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Share2,
  ZoomIn,
  Briefcase,
  Building2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ImageLightbox,
  LinkButton,
  StatusBadge,
} from "@/components/ui";
import type { About, Experience } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { SOCIAL_ICONS } from "@/lib/social-icons";

interface ProfilePhoto {
  id: string;
  title: string;
  filename: string;
  src: string;
  format: string;
  size: string;
  description: string;
  isTransparent?: boolean;
}

const PROFILE_PHOTOS: ProfilePhoto[] = [
  {
    id: "transparent",
    title: "Transparent cutout",
    filename: "dileepa-bandara-transparent.png",
    src: "/profile/v2-transparent.png",
    format: "PNG (lossless)",
    size: "2.1 MB",
    description:
      "Cutout with transparent background. Recommended for conference flyers, event banners, and slide presentations.",
    isTransparent: true,
  },
  {
    id: "webp",
    title: "Square portrait (WebP)",
    filename: "dileepa-bandara-headshot.webp",
    src: "/profile/v2.webp",
    format: "WebP (optimized)",
    size: "75 KB",
    description:
      "Web-optimized headshot. Recommended for event schedules, digital speaker profiles, and mobile applications.",
  },
  {
    id: "png",
    title: "Square portrait (PNG)",
    filename: "dileepa-bandara-portrait.png",
    src: "/profile/v2.png",
    format: "PNG (lossless)",
    size: "1.2 MB",
    description:
      "Uncompressed full-color portrait. Recommended for high-resolution print agendas and digital signage.",
  },
  {
    id: "jpg",
    title: "Square portrait (JPEG)",
    filename: "dileepa-bandara-portrait.jpg",
    src: "/profile/v2.jpg",
    format: "JPEG (standard)",
    size: "75 KB",
    description:
      "Standard format portrait for maximum compatibility across content management systems.",
  },
];

const SPEAKING_TOPICS = [
  {
    title: "Building production AI agents & multi-agent frameworks",
    summary:
      "Architecting autonomous agent systems, multi-agent orchestration, tool routing, and designing evaluation loops that hold up under real-world traffic.",
  },
  {
    title: "Production LLM pipelines & evaluation harnesses",
    summary:
      "Tracing, debugging, and benchmarking LLM applications. Moving from experimental prompts to reliable systems with measurable performance.",
  },
  {
    title: "Azure AI Foundry & enterprise AI architecture",
    summary:
      "Leveraging managed AI platforms for enterprise security, model governance, data isolation, and scalable agent deployment.",
  },
  {
    title: "Open source AI engineering & community building",
    summary:
      "Practical strategies for creating developer tooling, building transparent software, and cultivating high-impact engineering communities.",
  },
];

const SHORT_BIO =
  "Dileepa Bandara is an AI engineer building agentic systems, production LLM pipelines, and the developer communities around them. He speaks and leads technical workshops on AI architectures, multi-agent orchestration, and cloud infrastructure.";

const FULL_BIO =
  "Dileepa Bandara is an AI systems engineer with experience building agentic applications, production evaluation harnesses, and scalable cloud solutions. A community builder and active technical speaker, Dileepa has delivered numerous talks and hands-on workshops across developer meetups, conferences, and open-source groups. He focuses on practical AI engineering — moving beyond basic prototypes to resilient, observable production systems. Dileepa writes about AI architecture on dileepa.dev and maintains open-source tools for developers.";

interface ProfileClientProps {
  about: About | null;
  experiences: Experience[];
}

export function ProfileClient({ about, experiences }: ProfileClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<ProfilePhoto | null>(null);

  const currentRole = experiences[0]?.title || about?.title || "AI Engineer";
  const currentCompany =
    experiences[0]?.company || "AI Systems & Engineering";
  const location = about?.location || "Sri Lanka";

  const handleCopy = useCallback((key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handleShare = useCallback(
    async (photo: ProfilePhoto) => {
      const fullUrl = `${window.location.origin}${photo.src}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Dileepa Bandara — ${photo.title}`,
            text: `Download official headshot: ${photo.title}`,
            url: fullUrl,
          });
          return;
        } catch {
          // Fallback to clipboard
        }
      }
      handleCopy(photo.id, fullUrl);
    },
    [handleCopy],
  );

  const links = about?.links;
  const socials = SOCIAL_ICONS.map((icon) => ({
    ...icon,
    href: links?.[icon.key],
  })).filter((icon): icon is typeof icon & { href: string } =>
    Boolean(icon.href),
  );

  return (
    <div className="space-y-16">
      {/* Speaker Identity Summary Card */}
      <div className="p-6 sm:p-8 rounded-lg border border-border-strong bg-bg-surface">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg border border-border-strong overflow-hidden bg-bg shrink-0">
              <Image
                src="/profile/v2.webp"
                alt="Dileepa Bandara"
                width={112}
                height={112}
                className="object-cover w-full h-full"
                priority
              />
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-fg">
                  Dileepa Bandara
                </h2>
                {about?.status ? (
                  <StatusBadge>{about.status}</StatusBadge>
                ) : (
                  <Badge variant="filled">Available for speaking</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-small text-fg font-medium flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-brand shrink-0" />
                  <span>{currentRole}</span>
                </span>
                <span className="text-border-strong">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-fg-muted shrink-0" />
                  <span>{currentCompany}</span>
                </span>
                <span className="text-border-strong">·</span>
                <span className="inline-flex items-center gap-1 text-fg-muted font-normal">
                  <MapPin className="h-3.5 w-3.5 text-fg-muted shrink-0" />
                  <span>{location}</span>
                </span>
              </div>

              <p className="text-small text-fg-muted pt-1">
                Pronunciation: <span className="font-mono text-fg">di-lee-pa ban-da-ra</span> · Pronouns: <span className="font-mono text-fg">He / Him</span>
              </p>
            </div>
          </div>

          {/* Direct Organizer Contact Actions */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <LinkButton href={`mailto:${SITE_CONFIG.email}`} variant="primary">
              <Mail className="h-4 w-4" />
              <span>Email speaker</span>
            </LinkButton>
            <Button
              variant="secondary"
              onClick={() => handleCopy("email", SITE_CONFIG.email)}
            >
              {copiedKey === "email" ? (
                <>
                  <Check className="h-4 w-4 text-brand" />
                  <span>Copied email!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy email</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bios Section with One-Click Copy */}
      <div className="space-y-6">
        <div>
          <div className="section-label">Copyable copy</div>
          <h2>Speaker biographies</h2>
          <p className="mt-2 text-fg-muted">
            Pre-approved biographies in two lengths for event schedules, introduction notes, and speaker listings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Short Bio */}
          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-brand uppercase tracking-wider">
                  Short bio (~50 words)
                </span>
                <span className="font-mono text-xs text-fg-muted">
                  For announcements &amp; social flyers
                </span>
              </div>
              <p className="text-fg text-small leading-relaxed">
                {SHORT_BIO}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-border-strong/60 flex items-center justify-between">
              <span className="font-mono text-xs text-fg-muted">
                Word count: ~40 words
              </span>
              <Button
                variant="secondary"
                onClick={() => handleCopy("short-bio", SHORT_BIO)}
              >
                {copiedKey === "short-bio" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-brand" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy short bio</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Full Bio */}
          <Card className="flex flex-col justify-between p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-brand uppercase tracking-wider">
                  Standard bio (~100 words)
                </span>
                <span className="font-mono text-xs text-fg-muted">
                  For conference agendas &amp; programs
                </span>
              </div>
              <p className="text-fg text-small leading-relaxed">
                {FULL_BIO}
              </p>
            </div>

            <div className="pt-5 mt-4 border-t border-border-strong/60 flex items-center justify-between">
              <span className="font-mono text-xs text-fg-muted">
                Word count: ~90 words
              </span>
              <Button
                variant="secondary"
                onClick={() => handleCopy("full-bio", FULL_BIO)}
              >
                {copiedKey === "full-bio" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-brand" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy standard bio</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Headshots & Media Photos Section */}
      <div className="space-y-6">
        <div>
          <div className="section-label">Media kit</div>
          <h2>Official headshots &amp; portraits</h2>
          <p className="mt-2 text-fg-muted">
            High-resolution assets for print and digital media. Hover over any photo to inspect details, click to view in full screen, download in your preferred format, or copy the direct asset URL.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROFILE_PHOTOS.map((photo) => (
            <div
              key={photo.id}
              className="rounded-lg border border-border-strong bg-bg-surface overflow-hidden flex flex-col justify-between shadow-xs transition-colors hover:border-brand/50"
            >
              {/* Photo Viewport with Hover Zoom */}
              <div
                className="group relative aspect-square w-full cursor-zoom-in overflow-hidden bg-bg"
                onClick={() => setLightboxPhoto(photo)}
              >
                <div
                  className={
                    photo.isTransparent
                      ? "absolute inset-0 bg-[repeating-conic-gradient(var(--border-strong)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px] opacity-15"
                      : undefined
                  }
                />
                <Image
                  src={photo.src}
                  alt={`Dileepa Bandara — ${photo.title}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />

                {/* Hover Zoom Overlay */}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg text-fg font-mono text-xs font-medium shadow-md">
                    <ZoomIn className="h-3.5 w-3.5 text-brand" />
                    <span>Click to zoom</span>
                  </div>
                </div>

                {/* Format Pill */}
                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono font-medium bg-bg/90 backdrop-blur-sm text-fg border border-border-strong">
                    {photo.format}
                  </span>
                </div>
              </div>

              {/* Photo Information & Actions */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-bold text-fg">
                      {photo.title}
                    </h3>
                    <span className="font-mono text-[0.6875rem] text-fg-muted shrink-0">
                      {photo.size}
                    </span>
                  </div>
                  <p className="text-xs text-fg-muted line-clamp-2">
                    {photo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-strong/60 flex items-center gap-2">
                  <a
                    href={photo.src}
                    download={photo.filename}
                    className="btn btn--primary flex-1 !h-8 text-xs inline-flex items-center justify-center gap-1.5"
                    title={`Download ${photo.title}`}
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" />
                    <span>Download</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleShare(photo)}
                    className="btn btn--secondary !h-8 !px-2.5 text-xs inline-flex items-center justify-center gap-1"
                    title="Share or copy direct link"
                    aria-label={`Share ${photo.title}`}
                  >
                    {copiedKey === photo.id ? (
                      <Check className="h-3.5 w-3.5 text-brand" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speaking Topics Section */}
      <div className="space-y-6">
        <div>
          <div className="section-label">Sessions &amp; talks</div>
          <h2>Keynote topics &amp; workshops</h2>
          <p className="mt-2 text-fg-muted">
            Popular technical talk themes and hands-on workshops Dileepa regularly delivers for engineering conferences and meetups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SPEAKING_TOPICS.map((topic, index) => (
            <Card key={index} className="p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand/10 text-brand border border-brand/30 inline-flex items-center justify-center font-mono text-xs font-bold">
                    0{index + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-fg">
                    {topic.title}
                  </h3>
                </div>
                <p className="text-small text-fg-muted pl-8">
                  {topic.summary}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Socials and Links for Organizers */}
      <div className="p-6 sm:p-8 rounded-lg border border-border-strong bg-bg-surface">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-fg">
              Connect &amp; verify credentials
            </h2>
            <p className="text-small text-fg-muted max-w-xl">
              Official profiles, code repositories, recorded walkthroughs, and bio links to cite in your event material.
            </p>
          </div>

          {socials.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-strong bg-bg hover:border-brand hover:text-brand text-fg-muted transition-colors font-mono text-xs"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Image Lightbox */}
      {lightboxPhoto && (
        <ImageLightbox
          src={lightboxPhoto.src}
          alt={`Dileepa Bandara — ${lightboxPhoto.title}`}
          isOpen={Boolean(lightboxPhoto)}
          onClose={() => setLightboxPhoto(null)}
        />
      )}
    </div>
  );
}
