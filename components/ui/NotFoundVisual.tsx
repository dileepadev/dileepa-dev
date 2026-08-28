"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const RADAR_FRAMES = [
  `
   .---.     [ RADAR: ACTIVE ]
  /  |  \\    FREQ: 2.40 GHz
 |   o   |   STATUS: 404_NOT_FOUND
  \\     /    BEARING: 000.0° N
   '---'     TRACE: NULL_PTR
`,
  `
   .---.     [ RADAR: ACTIVE ]
  /   / \\    FREQ: 2.40 GHz
 |   o   |   STATUS: 404_NOT_FOUND
  \\     /    BEARING: 045.0° NE
   '---'     TRACE: ROUTE_UNRESOLVED
`,
  `
   .---.     [ RADAR: ACTIVE ]
  /     \\    FREQ: 2.40 GHz
 |   o---|   STATUS: 404_NOT_FOUND
  \\     /    BEARING: 090.0° E
   '---'     TRACE: HOST_UNREACHABLE
`,
  `
   .---.     [ RADAR: ACTIVE ]
  /     \\    FREQ: 2.40 GHz
 |   o   |   STATUS: 404_NOT_FOUND
  \\   \\ /    BEARING: 135.0° SE
   '---'     TRACE: ZERO_PACKETS
`,
  `
   .---.     [ RADAR: ACTIVE ]
  /     \\    FREQ: 2.40 GHz
 |   o   |   STATUS: 404_NOT_FOUND
  \\  |  /    BEARING: 180.0° S
   '---'     TRACE: SCANNING_DEEP
`,
  `
   .---.     [ RADAR: ACTIVE ]
  /     \\    FREQ: 2.40 GHz
 |   o   |   STATUS: 404_NOT_FOUND
  \\ /   /    BEARING: 225.0° SW
   '---'     TRACE: SECTOR_EMPTY
`,
  `
   .---.     [ RADAR: ACTIVE ]
  /     \\    FREQ: 2.40 GHz
 |--o   |    STATUS: 404_NOT_FOUND
  \\     /    BEARING: 270.0° W
   '---'     TRACE: PACKET_TIMEOUT
`,
  `
   .---.     [ RADAR: ACTIVE ]
  / \\   \\    FREQ: 2.40 GHz
 |   o   |   STATUS: 404_NOT_FOUND
  \\     /    BEARING: 315.0° NW
   '---'     TRACE: RE_TRYING...
`,
];

const ASCII_404_BANNER = `
  _  _    ___  _  _  
 | || |  / _ \\| || | 
 | || |_| | | | || |_
 |__   _| | | |__   _|
    |_|  \\___/   |_|  
`;

const ASCII_RAMP = " .:-=+*#%@";

export function NotFoundVisual() {
  const [activeTab, setActiveTab] = useState<"terminal" | "operator">("terminal");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPinging, setIsPinging] = useState(false);
  const [pingCount, setPingCount] = useState(0);
  const [asciiPortrait, setAsciiPortrait] = useState<string[]>([]);
  const [isAsciiPhotoActive, setIsAsciiPhotoActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cycle ASCII radar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % RADAR_FRAMES.length);
    }, 220);
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

  const handlePing = () => {
    setIsPinging(true);
    setPingCount((c) => c + 1);
    setTimeout(() => setIsPinging(false), 900);
  };

  return (
    <div className="rounded-lg border border-border-strong bg-bg-surface overflow-hidden shadow-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-bg border-b border-border-strong text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block" />
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block" />
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block" />
          <span className="ml-2 text-fg-muted">telemetry://404.dileepa.dev</span>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded border border-border-strong overflow-hidden text-[0.6875rem]">
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={cn(
              "px-2 py-0.5 transition-colors cursor-pointer",
              activeTab === "terminal"
                ? "bg-brand text-bg font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            ASCII radar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("operator")}
            className={cn(
              "px-2 py-0.5 transition-colors cursor-pointer border-l border-border-strong",
              activeTab === "operator"
                ? "bg-brand text-bg font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            Operator ID
          </button>
        </div>
      </div>

      {/* Main Terminal Viewport */}
      {activeTab === "terminal" ? (
        <div className="p-4 sm:p-5 font-mono text-xs space-y-4">
          {/* Big ASCII 404 Display */}
          <div className="p-3 rounded bg-bg border border-border-strong/70 text-brand select-none overflow-x-auto">
            <pre className="text-[0.625rem] sm:text-xs leading-[1.15] font-bold">
              {ASCII_404_BANNER}
            </pre>
          </div>

          {/* Animated ASCII Radar */}
          <div className="p-3 rounded bg-bg border border-border-strong/70 overflow-hidden relative">
            <pre className="text-[0.6875rem] leading-[1.25] text-fg select-none whitespace-pre">
              {RADAR_FRAMES[frameIndex]}
            </pre>

            {isPinging && (
              <div className="absolute inset-0 bg-brand/10 flex items-center justify-center pointer-events-none transition-opacity">
                <span className="text-brand font-bold text-xs animate-pulse">
                  (( PING SIGNAL BROADCASTED ))
                </span>
              </div>
            )}
          </div>

          {/* Status Telemetry */}
          <div className="text-[0.6875rem] text-fg-muted space-y-1 pt-1 border-t border-border-strong/40">
            <div className="flex items-center justify-between">
              <span>SCAN TARGET:</span>
              <span className="text-fg font-medium">UNRESOLVED_PATH</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PROBE STATUS:</span>
              <span className="text-brand font-medium">LISTENING (404)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PINGS SENT:</span>
              <span className="text-fg">{pingCount}</span>
            </div>
          </div>

          {/* Interactive Ping Control */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono text-xs font-medium bg-bg border border-border-strong hover:border-brand hover:text-brand transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
              <span>Ping sector</span>
            </button>
            <span className="text-[0.6875rem] text-fg-muted">
              Press to ping lost route
            </span>
          </div>
        </div>
      ) : (
        /* Operator Photo & ASCII Converter View */
        <div className="p-4 sm:p-5 font-mono text-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
            {/* Portrait Frame */}
            <div className="relative w-36 h-36 shrink-0 rounded-sm border border-border-strong overflow-hidden bg-bg flex items-center justify-center">
              {isAsciiPhotoActive && asciiPortrait.length > 0 ? (
                <div className="w-full h-full p-1.5 flex items-center justify-center bg-bg select-none overflow-hidden">
                  <pre className="text-[0.34rem] leading-[0.38rem] text-brand tracking-tighter">
                    {asciiPortrait.join("\n")}
                  </pre>
                </div>
              ) : (
                <>
                  <Image
                    src="/profile/v2.webp"
                    alt="Dileepa Bandara"
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                  {/* Subtle Scanlines */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--carbon) 2px, var(--carbon) 4px)",
                    }}
                  />
                </>
              )}

              {/* Reticle HUD Corners */}
              <span className="absolute top-1 left-1 text-[0.625rem] text-brand font-mono select-none pointer-events-none">
                ┌
              </span>
              <span className="absolute top-1 right-1 text-[0.625rem] text-brand font-mono select-none pointer-events-none">
                ┐
              </span>
              <span className="absolute bottom-1 left-1 text-[0.625rem] text-brand font-mono select-none pointer-events-none">
                └
              </span>
              <span className="absolute bottom-1 right-1 text-[0.625rem] text-brand font-mono select-none pointer-events-none">
                ┘
              </span>
            </div>

            {/* Operator Telemetry Dossier */}
            <div className="space-y-2 flex-1 min-w-0 text-[0.6875rem]">
              <div className="p-2 rounded bg-bg border border-border-strong/70 space-y-1">
                <div className="text-fg font-medium text-xs">
                  Dileepa Bandara
                </div>
                <div className="text-brand">OPERATOR // AI ENGINEER</div>
                <div className="text-fg-muted pt-1 border-t border-border-strong/40">
                  ASSIGNMENT: Route recovery &amp; 404 assistance
                </div>
                <div className="text-fg-muted">STATUS: Active in sector</div>
              </div>

              {/* Mode Toggle Button */}
              <button
                type="button"
                onClick={() => setIsAsciiPhotoActive((v) => !v)}
                className="w-full text-center px-2.5 py-1.5 rounded-sm font-mono text-xs font-medium border border-border-strong bg-bg hover:border-brand hover:text-brand transition-colors cursor-pointer"
              >
                {isAsciiPhotoActive
                  ? "View photo"
                  : "Convert to ASCII"}
              </button>
            </div>
          </div>

          <div className="text-[0.6875rem] text-fg-muted pt-2 border-t border-border-strong/40">
            Official operator portrait. Switch between high-resolution photograph and real-time ASCII matrix rendering.
          </div>
        </div>
      )}
    </div>
  );
}
