"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Download } from "lucide-react";
import { buttonClasses, ToggleGroup } from "@/components/ui";
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
  // failure (WCAG 2.5.3): someone saying "Carbon" hits a control named
  // "Copy hex code for…". The name is built from the swatch's own content
  // instead, with the action appended after it by the `sr-only` span below.
  return (
    <button
      type="button"
      onClick={handleCopy}
      // A tile like every card on a panel; the copy affordance is the
      // marker that appears on the colour strip, not a hover fill.
      className="tile group relative flex flex-col justify-between p-4 text-left cursor-pointer w-full"
    >
      {/* Color tile representation */}
      <div
        className="w-full h-12 rounded-block border mb-3 flex items-center justify-between px-2.5"
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
            "p-1 rounded-full bg-bg/80 text-fg text-xs backdrop-blur-xs transition-opacity duration-150",
            copied ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-medium text-fg">{hex}</span>
          {contrastBadge && (
            <span
              className={cn(
                "chip",
                !contrastBadge.includes("AA") && "text-error",
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
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-fill text-on-brand text-label font-mono font-medium">
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
  // failure (WCAG 2.5.3): someone saying "Carbon" hits a control named
  // "Copy hex code for…". The name is built from the swatch's own content
  // instead, with the action appended after it by the `sr-only` span below.
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={buttonClasses({ size: "sm", className })}
    >
      {copied ? (
        <>
          <Check aria-hidden="true" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy aria-hidden="true" />
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
    <div className="tile overflow-hidden">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border-hairline text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-fg font-medium">Social card simulator</span>
          <span className="text-border-strong select-none">/</span>
          <ToggleGroup
            label="Card size"
            value={variant}
            onChange={setVariant}
            options={[
              { value: "standard", label: "1200×630" },
              { value: "detailed", label: "1600×900" },
            ]}
          />
        </div>

        <ToggleGroup
          label="Platform"
          value={platform}
          onChange={setPlatform}
          options={[
            { value: "twitter", label: "X" },
            { value: "linkedin", label: "LinkedIn" },
          ]}
        />
      </div>

      {/* Preview container */}
      <div className="p-4 sm:p-6 flex justify-center">
        <div className="w-full max-w-xl rounded-block border border-border-strong bg-bg-surface overflow-hidden">
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
      <div className="px-4 py-3 border-t border-border-hairline flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-fg-muted">
          <span>Dimensions: {dimensions}</span>
          <span>·</span>
          <span>Ratio: {ratio}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={currentImage}
            download={currentFilename}
            className={buttonClasses({ size: "sm" })}
          >
            <Download aria-hidden="true" />
            Download image
          </a>
          <button
            type="button"
            onClick={handleCopyUrl}
            className={buttonClasses({ size: "sm" })}
          >
            {copied ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy image URL"}
          </button>
        </div>
      </div>
    </div>
  );
}
