"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, Mail, RotateCcw, Terminal, User } from "lucide-react";
import { cn } from "@/lib/utils";

const OSCILLOSCOPE_FRAMES = [
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~~/\\_/\\~~~~~~ │
 └────────────────┘
 HEARTBEAT: INTERRUPT`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~~~\\_/\\_/~~~~ │
 └────────────────┘
 HEARTBEAT: RESAMPLING`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~~~~~~\\_/\\_~~ │
 └────────────────┘
 HEARTBEAT: DAMPED_WAVE`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~/\\_/\\_~~~~~~ │
 └────────────────┘
 HEARTBEAT: PROBE_SENT`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~~~~/\\_/\\~~~~ │
 └────────────────┘
 HEARTBEAT: VOLTAGE_OFF`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~~~~~~/\\_/\\~~ │
 └────────────────┘
 HEARTBEAT: HOLDING_RUN`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ \\_/\\_~~~~~~~~~ │
 └────────────────┘
 HEARTBEAT: DRAIN_CYCLE`,
  ` [ CIRCUIT: FAULT ]
 SYSTEM: SSR_RENDER_PIPELINE
 ┌────────────────┐
 │ ~~~\\_/\\_/\\~~~~ │
 └────────────────┘
 HEARTBEAT: RE-ARMED`,
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
  const [activeTab, setActiveTab] = useState<"terminal" | "operator">("terminal");
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

  return (
    <div className="rounded-lg border border-border-strong bg-bg-surface overflow-hidden shadow-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-bg border-b border-border-strong text-xs font-mono">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block shrink-0" />
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block shrink-0" />
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block shrink-0" />
          <span className="ml-2 text-fg-muted truncate">circuit://500.fault.dileepa.dev</span>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded border border-border-strong overflow-hidden text-[0.6875rem] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={cn(
              "px-2 py-0.5 transition-colors cursor-pointer inline-flex items-center gap-1",
              activeTab === "terminal"
                ? "bg-brand text-bg font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            <Terminal className="h-3 w-3" />
            <span>Telemetry</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("operator")}
            className={cn(
              "px-2 py-0.5 transition-colors cursor-pointer border-l border-border-strong inline-flex items-center gap-1",
              activeTab === "operator"
                ? "bg-brand text-bg font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            <User className="h-3 w-3" />
            <span>Engineer</span>
          </button>
        </div>
      </div>

      {/* Main Viewport (Fixed Equal Box Sizes to Prevent Shift) */}
      {activeTab === "terminal" ? (
        <div className="min-h-[390px] sm:h-[390px] p-4 sm:p-5 font-mono text-xs flex flex-col justify-between gap-3">
          <div className="space-y-3">
            {/* ASCII 500 Banner */}
            <div className="p-2.5 rounded bg-bg border border-border-strong/70 text-brand select-none overflow-hidden">
              <pre className="text-[0.625rem] sm:text-xs leading-[1.15] font-bold whitespace-pre">
                {ASCII_500_BANNER}
              </pre>
            </div>

            {/* Animated Circuit Oscilloscope */}
            <div className="p-2.5 rounded bg-bg border border-border-strong/70 overflow-hidden relative">
              <pre className="text-[0.6875rem] leading-[1.3] text-fg select-none whitespace-pre">
                {OSCILLOSCOPE_FRAMES[frameIndex]}
              </pre>

              {isResetting && (
                <div className="absolute inset-0 bg-brand/15 flex items-center justify-center pointer-events-none transition-opacity">
                  <span className="text-brand font-bold text-xs animate-pulse">
                    (( RE-INITIALIZING PIPELINE ))
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            {/* Status Telemetry */}
            <div className="text-[0.6875rem] text-fg-muted space-y-1 pt-2 border-t border-border-strong/40">
              <div className="flex items-center justify-between">
                <span>FAULT DOMAIN:</span>
                <span className="text-fg font-medium">SSR_RENDER_PIPELINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CIRCUIT STATE:</span>
                <span className="text-brand font-medium">BREAKER_TRIPPED</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DIGEST:</span>
                <span className="text-fg font-mono truncate max-w-[170px]">
                  {error.digest || "0x500_ERR_GENERIC"}
                </span>
              </div>
            </div>

            {/* Interactive Recovery Controls */}
            <div className="mt-3 pt-2.5 border-t border-border-strong/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5 text-brand border-brand/30 hover:border-brand"
              >
                <RotateCcw className={cn("h-3 w-3", isResetting && "animate-spin")} />
                <span>{isResetting ? "Rebooting..." : "Reboot node"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyTrace}
                className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5"
              >
                {copiedTrace ? (
                  <>
                    <Check className="h-3 w-3 text-brand" />
                    <span className="text-brand">Copied trace</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-fg-muted" />
                    <span>Copy report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[390px] sm:h-[390px] p-4 sm:p-5 font-mono text-xs flex flex-col justify-between gap-3">
          <div className="flex items-center gap-4">
            {/* Operator Photo / ASCII Viewport */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded border border-border-strong overflow-hidden bg-bg shrink-0">
              {isAsciiPhotoActive && asciiPortrait.length > 0 ? (
                <div className="w-full h-full p-1 bg-black text-brand text-[4px] leading-[3.6px] font-mono select-none overflow-hidden flex items-center justify-center">
                  <pre className="font-mono">{asciiPortrait.join("\n")}</pre>
                </div>
              ) : (
                <>
                  <Image
                    src="/profile/v2.webp"
                    alt="System Engineer Dileepa Bandara"
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover"
                  />
                  {/* Subtle Scanlines & HUD overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(35, 184, 136, 0.4) 2px, rgba(35, 184, 136, 0.4) 4px)",
                    }}
                  />
                  <div className="absolute top-1 left-1 text-[8px] font-mono text-brand bg-bg/80 px-1 rounded-xs">
                    ENG-01
                  </div>
                </>
              )}
            </div>

            {/* Operator Telemetry Details */}
            <div className="space-y-1.5 text-fg min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-[0.625rem] text-brand uppercase font-bold tracking-wider">
                  Engineer On Standby
                </span>
              </div>
              <div className="font-bold text-sm text-fg truncate">
                Dileepa Bandara
              </div>
              <div className="text-[0.6875rem] text-fg-muted font-mono truncate">
                contact@dileepa.dev
              </div>
              <div className="text-[0.6875rem] text-fg-muted font-mono">
                CALLSIGN: //DILEEPADEV
              </div>
            </div>
          </div>

          <div>
            {/* System Status Metrics */}
            <div className="text-[0.6875rem] text-fg-muted space-y-1 pt-2 border-t border-border-strong/40">
              <div className="flex items-center justify-between">
                <span>INCIDENT POSTING:</span>
                <span className="text-fg font-medium">OPEN (AWAITING INPUT)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RESPONSE PROTOCOL:</span>
                <span className="text-brand font-medium">DIRECT EMAIL</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RECOVERY RATE:</span>
                <span className="text-fg">99.8% (AUTO-RETRY)</span>
              </div>
            </div>

            {/* Actions: Mailto & ASCII Toggle */}
            <div className="mt-3 pt-2.5 border-t border-border-strong/60 flex items-center justify-between gap-2">
              <a
                href={`mailto:contact@dileepa.dev?subject=500%20Page%20Error%20Report&body=Hi%20Dileepa,%0A%0AI%20encountered%20an%20error%20on%20the%20site:%0ADigest:%20${error.digest || "none"}`}
                className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5 text-brand border-brand/30 hover:border-brand"
              >
                <Mail className="h-3 w-3" />
                <span>Email report</span>
              </a>

              <button
                type="button"
                onClick={() => setIsAsciiPhotoActive((prev) => !prev)}
                className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5"
              >
                <span>{isAsciiPhotoActive ? "Standard photo" : "ASCII mode"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
