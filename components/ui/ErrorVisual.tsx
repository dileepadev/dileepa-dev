"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, Mail, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { TerminalCard, TerminalPanel, TerminalReadout } from "./TerminalCard";
import { ToggleGroup } from "./ToggleGroup";

/**
 * The 500 page's terminal window: a fault oscilloscope with recovery
 * controls, and an engineer view with a photo that converts to ASCII. The
 * frame, panels and readout are `TerminalCard`'s, shared with the 404 and 503
 * pages.
 */

/** Drops the blank first and last lines the template literals carry. */
const art = (text: string) => text.replace(/^\n+|\n+$/g, "");

/** The oscilloscope's trace and heartbeat, one entry per animation frame. */
const OSCILLOSCOPE_FRAMES = [
  { wave: "~~~/\\_/\\~~~~~~", heartbeat: "INTERRUPT" },
  { wave: "~~~~\\_/\\_/~~~~", heartbeat: "RESAMPLING" },
  { wave: "~~~~~~~\\_/\\_~~", heartbeat: "DAMPED_WAVE" },
  { wave: "~~/\\_/\\_~~~~~~", heartbeat: "PROBE_SENT" },
  { wave: "~~~~~/\\_/\\~~~~", heartbeat: "VOLTAGE_OFF" },
  { wave: "~~~~~~~/\\_/\\~~", heartbeat: "HOLDING_RUN" },
  { wave: "\\_/\\_~~~~~~~~~", heartbeat: "DRAIN_CYCLE" },
  { wave: "~~~\\_/\\_/\\~~~~", heartbeat: "RE-ARMED" },
];

const ASCII_500_BANNER = `
  ____   ___   ___  
 | ___| / _ \\ / _ \\ 
 |___ \\| | | | | | |
  ___) | |_| | |_| |
 |____/ \\___/ \\___/ 
`;

const ASCII_RAMP = " .:-=+*#%@";

interface ErrorVisualProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorVisual({ error, reset }: ErrorVisualProps) {
  const [activeTab, setActiveTab] = useState<"terminal" | "operator">(
    "terminal",
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [copiedTrace, setCopiedTrace] = useState(false);
  const [asciiPortrait, setAsciiPortrait] = useState<string[]>([]);
  const [isAsciiPhotoActive, setIsAsciiPhotoActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cycle oscilloscope waveform
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % OSCILLOSCOPE_FRAMES.length);
    }, 240);
    return () => clearInterval(timer);
  }, []);

  // Convert profile image to real ASCII art on mount
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "/profile/v2.webp";
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cols = 38;
      const rows = 26;
      canvas.width = cols;
      canvas.height = rows;

      ctx.drawImage(img, 0, 0, cols, rows);
      const imgData = ctx.getImageData(0, 0, cols, rows);
      const data = imgData.data;

      const lines: string[] = [];
      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const idx = (y * cols + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          const charIdx = Math.floor((luma / 255) * (ASCII_RAMP.length - 1));
          line += ASCII_RAMP[charIdx] || " ";
        }
        lines.push(line);
      }
      setAsciiPortrait(lines);
    };
  }, []);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 600);
  };

  const handleCopyTrace = async () => {
    const report = [
      `[dileepa.dev 500 Fault Telemetry]`,
      `Digest: ${error.digest || "none"}`,
      `Message: ${error.message || "SSR render fault"}`,
      `Timestamp: ${new Date().toISOString()}`,
      `URL: ${typeof window !== "undefined" ? window.location.href : "unknown"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      setCopiedTrace(true);
      setTimeout(() => setCopiedTrace(false), 2000);
    } catch {
      // ignore
    }
  };

  const frame = OSCILLOSCOPE_FRAMES[frameIndex];

  return (
    <TerminalCard
      address="circuit://500.fault.dileepa.dev"
      tabs={
        <ToggleGroup
          label="View"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "terminal", label: "Telemetry" },
            { value: "operator", label: "Engineer" },
          ]}
        />
      }
    >
      {activeTab === "terminal" ? (
        <>
          <TerminalPanel className="terminal-banner">
            <pre aria-hidden="true">{art(ASCII_500_BANNER)}</pre>
          </TerminalPanel>

          <TerminalPanel>
            <pre aria-hidden="true">
              {"[ CIRCUIT: FAULT ]\nSYSTEM: SSR_RENDER_PIPELINE"}
            </pre>
            <div className="terminal-trace">
              <pre aria-hidden="true">{frame.wave}</pre>
            </div>
            <pre aria-hidden="true">{`HEARTBEAT: ${frame.heartbeat}`}</pre>
            {isResetting && (
              <div className="terminal-flash animate-pulse">
                (( RE-INITIALIZING PIPELINE ))
              </div>
            )}
          </TerminalPanel>

          <TerminalReadout
            rows={[
              { label: "FAULT DOMAIN", value: "SSR_RENDER_PIPELINE" },
              {
                label: "CIRCUIT STATE",
                value: "BREAKER_TRIPPED",
                strong: true,
              },
              { label: "DIGEST", value: error.digest || "0x500_ERR_GENERIC" },
            ]}
          />

          <div className="terminal-actions">
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting}
              className="btn btn--secondary btn--sm"
            >
              <RotateCcw className={cn(isResetting && "animate-spin")} />
              <span>{isResetting ? "Rebooting..." : "Reboot node"}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyTrace}
              className="btn btn--secondary btn--sm"
            >
              {copiedTrace ? <Check /> : <Copy />}
              <span>{copiedTrace ? "Copied trace" : "Copy report"}</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            {/* Engineer photo / ASCII viewport */}
            <div className="relative w-32 h-32 rounded-block overflow-hidden bg-bg-surface shrink-0 flex items-center justify-center">
              {isAsciiPhotoActive && asciiPortrait.length > 0 ? (
                <pre
                  aria-hidden="true"
                  className="text-[4px]! leading-[3.6px]! text-fg"
                >
                  {asciiPortrait.join("\n")}
                </pre>
              ) : (
                <>
                  <Image
                    src="/profile/v2.webp"
                    alt="System Engineer Dileepa Bandara"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                  {/* Subtle scanlines */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--carbon) 2px, var(--carbon) 4px)",
                    }}
                  />
                </>
              )}
            </div>

            {/* Engineer details */}
            <div className="space-y-1.5 min-w-[10rem] flex-1">
              <div className="flex items-center gap-1.5 text-fg">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="font-medium tracking-wider">
                  ENGINEER ON STANDBY
                </span>
              </div>
              <div className="font-medium text-small text-fg">
                Dileepa Bandara
              </div>
              <div>contact@dileepa.dev</div>
              <div>CALLSIGN: //DILEEPADEV</div>
            </div>
          </div>

          <TerminalReadout
            rows={[
              { label: "INCIDENT POSTING", value: "OPEN (AWAITING INPUT)" },
              {
                label: "RESPONSE PROTOCOL",
                value: "DIRECT EMAIL",
                strong: true,
              },
              { label: "RECOVERY RATE", value: "99.8% (AUTO-RETRY)" },
            ]}
          />

          <div className="terminal-actions">
            <a
              href={`mailto:contact@dileepa.dev?subject=500%20Page%20Error%20Report&body=Hi%20Dileepa,%0A%0AI%20encountered%20an%20error%20on%20the%20site:%0ADigest:%20${error.digest || "none"}`}
              className="btn btn--secondary btn--sm"
            >
              <Mail />
              <span>Email report</span>
            </a>
            <button
              type="button"
              onClick={() => setIsAsciiPhotoActive((prev) => !prev)}
              className="btn btn--secondary btn--sm"
            >
              {isAsciiPhotoActive ? "Standard photo" : "ASCII mode"}
            </button>
          </div>
        </>
      )}
    </TerminalCard>
  );
}
