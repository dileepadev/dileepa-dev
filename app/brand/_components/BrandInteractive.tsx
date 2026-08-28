"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group relative flex flex-col justify-between p-3.5 rounded-sm border text-left transition-all duration-150 cursor-pointer w-full",
        "border-border-strong bg-bg hover:border-brand hover:bg-surface-hover focus:outline-none focus-visible:ring-1 focus-visible:ring-brand",
      )}
      aria-label={`Copy hex code for ${name} (${hex})`}
    >
      {/* Color tile representation */}
      <div
        className="w-full h-12 rounded-xs border mb-3 flex items-center justify-between px-2.5 transition-transform duration-150 group-hover:scale-[1.02]"
        style={{
          backgroundColor: bgHex || hex,
          borderColor: borderHex || "var(--border)",
          color: textHex || "#ffffff",
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
          <span className="font-mono text-xs font-medium text-fg">
            {hex}
          </span>
          {contrastBadge && (
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.2 rounded text-[0.625rem] font-mono",
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
        <div className="font-mono text-[0.6875rem] text-fg-muted truncate">
          {token}
        </div>
        <p className="text-[0.75rem] text-fg-muted line-clamp-2 leading-relaxed">
          {role}
        </p>
        {contrast && (
          <div className="text-[0.6875rem] font-mono text-fg-muted/80">
            {contrast}
          </div>
        )}
      </div>

      {copied && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-brand text-bg text-[0.625rem] font-mono font-medium shadow-xs">
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
