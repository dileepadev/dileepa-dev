"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  name: string;
  token: string;
  hex: string;
  role: string;
  contrast?: string;
  contrastBadge?: string;
  bgHex?: string;
  borderHex?: string;
  textHex?: string;
}

export function ColorSwatch({
  name,
  token,
  hex,
  role,
  contrast,
  contrastBadge,
  bgHex,
  borderHex,
  textHex,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  // No `aria-label` on the button. An override there replaces the visible
  // text with a string that does not contain it, which is the "Label in Name"
  // failure (WCAG 2.5.3): someone saying "Emerald Bright" hits a control named
  // "Copy hex code for…". The name is built from the swatch's own content
  // instead, with the action appended after it by the `sr-only` span below.
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group relative flex flex-col justify-between p-3.5 rounded-sm border text-left transition-all duration-150 cursor-pointer w-full",
        "border-border-strong bg-bg hover:border-brand hover:bg-surface-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-brand",
      )}
    >
      {/* Color tile representation */}
      <div
        className="w-full h-12 rounded-xs border mb-3 flex items-center justify-between px-2.5 transition-transform duration-150 group-hover:scale-[1.02]"
        style={{
          backgroundColor: bgHex || hex,
          borderColor: borderHex || "var(--border)",
          color: textHex || "var(--fg)",
        }}
      >
        <span className="font-mono text-xs font-medium drop-shadow-xs">
          {name}
        </span>
        <span
          className={cn(
            "p-1 rounded bg-bg/80 text-fg text-xs backdrop-blur-xs transition-opacity duration-150",
            copied ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-medium text-fg">{hex}</span>
          {contrastBadge && (
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.2 rounded text-label font-mono",
                contrastBadge.includes("AAA")
                  ? "bg-brand/15 text-brand border border-brand/30"
                  : contrastBadge.includes("AA")
                    ? "bg-bg-surface text-fg border border-border-strong"
                    : "bg-error/15 text-error border border-error/30",
              )}
            >
              {contrastBadge}
            </span>
          )}
        </div>
        <div className="font-mono text-label text-fg-muted truncate">
          {token}
        </div>
        <p className="text-small text-fg-muted line-clamp-2 leading-relaxed">
          {role}
        </p>
        {contrast && (
          <div className="text-label font-mono text-fg-muted">{contrast}</div>
        )}
      </div>

      <span className="sr-only">Copy hex code</span>

      {copied && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-brand-fill text-on-brand text-label font-mono font-medium shadow-xs">
          Copied
        </div>
      )}
    </button>
  );
}

export function CopySnippetButton({
  text,
  label = "Copy snippet",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  // No `aria-label` on the button. An override there replaces the visible
  // text with a string that does not contain it, which is the "Label in Name"
  // failure (WCAG 2.5.3): someone saying "Emerald Bright" hits a control named
  // "Copy hex code for…". The name is built from the swatch's own content
  // instead, with the action appended after it by the `sr-only` span below.
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm font-mono text-xs text-fg-muted border border-border-strong bg-bg-surface hover:text-brand hover:border-brand transition-colors cursor-pointer",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          <span className="text-brand">Copied to clipboard</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function SocialCardPreview() {
  const [platform, setPlatform] = useState<"twitter" | "linkedin">("twitter");
  const [variant, setVariant] = useState<"standard" | "detailed">("standard");
  const [copied, setCopied] = useState(false);

  const currentImage = variant === "standard" ? "/og.png" : "/og2.png";
  const currentFilename =
    variant === "standard"
      ? "dileepa-dev-og.png"
      : "dileepa-dev-og-detailed.png";
  const dimensions = variant === "standard" ? "1200 × 630 px" : "1600 × 900 px";
  const ratio =
    variant === "standard" ? "1.91:1 (standard)" : "16:9 (widescreen)";

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(`https://dileepa.dev${currentImage}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="rounded-lg border border-border-strong bg-bg-surface overflow-hidden shadow-xs">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-bg border-b border-border-strong text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-fg font-medium">Social card simulator</span>
          <span className="text-border-strong select-none">/</span>
          <div className="flex items-center rounded border border-border-strong overflow-hidden text-label">
            <button
              type="button"
              onClick={() => setVariant("standard")}
              className={cn(
                "px-2 py-0.5 transition-colors cursor-pointer",
                variant === "standard"
                  ? "bg-brand-fill text-on-brand font-medium"
                  : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
              )}
            >
              Default (1200×630)
            </button>
            <button
              type="button"
              onClick={() => setVariant("detailed")}
              className={cn(
                "px-2 py-0.5 transition-colors cursor-pointer border-l border-border-strong",
                variant === "detailed"
                  ? "bg-brand-fill text-on-brand font-medium"
                  : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
              )}
            >
              Detailed (1600×900)
            </button>
          </div>
        </div>

        <div className="flex items-center rounded border border-border-strong overflow-hidden text-label">
          <button
            type="button"
            onClick={() => setPlatform("twitter")}
            className={cn(
              "px-2.5 py-1 transition-colors cursor-pointer",
              platform === "twitter"
                ? "bg-brand-fill text-on-brand font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            Twitter / X
          </button>
          <button
            type="button"
            onClick={() => setPlatform("linkedin")}
            className={cn(
              "px-2.5 py-1 transition-colors cursor-pointer border-l border-border-strong",
              platform === "linkedin"
                ? "bg-brand-fill text-on-brand font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            LinkedIn / Slack
          </button>
        </div>
      </div>

      {/* Preview container */}
      <div className="p-4 sm:p-6 bg-bg flex justify-center">
        <div className="w-full max-w-xl rounded-xl border border-border-strong bg-bg-surface overflow-hidden shadow-md">
          {/* OG Image */}
          <div
            className={cn(
              "relative w-full bg-bg overflow-hidden",
              variant === "standard" ? "aspect-[1200/630]" : "aspect-[16/9]",
            )}
          >
            <Image
              key={currentImage}
              src={currentImage}
              alt="Dileepa Bandara Open Graph preview"
              width={variant === "standard" ? 1200 : 1600}
              height={variant === "standard" ? 630 : 900}
              className="w-full h-full object-cover"
              preload
            />
          </div>

          {/* Social feed metadata preview */}
          {platform === "twitter" ? (
            <div className="p-3.5 bg-bg-surface border-t border-border-strong space-y-1">
              <div className="font-mono text-label text-fg-muted">
                dileepa.dev
              </div>
              <div className="font-medium text-sm text-fg truncate">
                {SITE_CONFIG.title}
              </div>
              <p className="text-xs text-fg-muted line-clamp-1">
                {SITE_CONFIG.metaDescription}
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-bg-surface border-t border-border-strong space-y-0.5">
              <div className="font-bold text-sm text-fg truncate">
                {SITE_CONFIG.title}
              </div>
              <div className="font-mono text-xs text-fg-muted">
                dileepa.dev · 2 min read
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 py-3 bg-bg-surface border-t border-border-strong flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-fg-muted">
          <span>Dimensions: {dimensions}</span>
          <span>·</span>
          <span>Ratio: {ratio}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={currentImage}
            download={currentFilename}
            className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5"
          >
            Download image
          </a>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5"
          >
            {copied ? "Copied URL!" : "Copy image URL"}
          </button>
        </div>
      </div>
    </div>
  );
}
