"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TerminalCard, TerminalPanel, TerminalReadout } from "./TerminalCard";
import { ToggleGroup } from "./ToggleGroup";

/**
 * The 404 page's terminal window: an ASCII radar sweeping for the lost route,
 * and an operator view with a photo that converts to ASCII. The frame, panels
 * and readout are `TerminalCard`'s, shared with the 500 and 503 pages.
 */

/** Drops the blank first and last lines the template literals carry. */
const art = (text: string) => text.replace(/^\n+|\n+$/g, "");

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
  const [activeTab, setActiveTab] = useState<"terminal" | "operator">(
    "terminal",
  );
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
    <TerminalCard
      address="telemetry://404.dileepa.dev"
      tabs={
        <ToggleGroup
          label="View"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "terminal", label: "ASCII radar" },
            { value: "operator", label: "Operator ID" },
          ]}
        />
      }
    >
      {activeTab === "terminal" ? (
        <>
          <TerminalPanel className="terminal-banner">
            <pre aria-hidden="true">{art(ASCII_404_BANNER)}</pre>
          </TerminalPanel>

          <TerminalPanel>
            <pre aria-hidden="true">{art(RADAR_FRAMES[frameIndex])}</pre>
            {isPinging && (
              <div className="terminal-flash animate-pulse">
                (( PING SIGNAL BROADCASTED ))
              </div>
            )}
          </TerminalPanel>

          <TerminalReadout
            rows={[
              { label: "SCAN TARGET", value: "UNRESOLVED_PATH" },
              { label: "PROBE STATUS", value: "LISTENING (404)", strong: true },
              { label: "PINGS SENT", value: pingCount },
            ]}
          />

          <div className="terminal-actions">
            <button
              type="button"
              onClick={handlePing}
              className="btn btn--secondary btn--sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
              <span>Ping sector</span>
            </button>
            <span>Press to ping the lost route</span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-start gap-4">
            {/* Portrait frame */}
            <div className="relative w-32 h-32 shrink-0 rounded-sm border border-border-strong overflow-hidden bg-bg-surface flex items-center justify-center">
              {isAsciiPhotoActive && asciiPortrait.length > 0 ? (
                <pre
                  aria-hidden="true"
                  className="text-[0.3rem]! leading-[0.34rem]! tracking-tighter text-fg"
                >
                  {asciiPortrait.join("\n")}
                </pre>
              ) : (
                <>
                  <Image
                    src="/profile/v2.webp"
                    alt="Dileepa Bandara"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
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

            {/* Operator dossier */}
            <div className="flex-1 min-w-[10rem] space-y-3">
              <TerminalPanel className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-fg">Dileepa Bandara</span>
                  <span className="chip">Active</span>
                </div>
                <div>OPERATOR // AI ENGINEER</div>
                <div className="pt-1 text-fg-muted">CALLSIGN: dileepadev</div>
                <div className="text-fg-muted">MISSION: Route recovery</div>
              </TerminalPanel>
              <button
                type="button"
                onClick={() => setIsAsciiPhotoActive((v) => !v)}
                className="btn btn--secondary btn--sm w-full"
              >
                {isAsciiPhotoActive ? "View photo" : "Convert to ASCII"}
              </button>
            </div>
          </div>

          <TerminalPanel className="space-y-1">
            <div className="text-fg-muted">DIAGNOSTICS LOG</div>
            <div>&gt; SYSTEM: Route index mismatch</div>
            <div className="text-fg-muted">
              &gt; RECOMMENDATION: Explore the sitemap
            </div>
          </TerminalPanel>

          <TerminalReadout
            rows={[
              { label: "OPERATOR ID", value: "V2.0" },
              { label: "STATUS", value: "READY", strong: true },
            ]}
          />
        </>
      )}
    </TerminalCard>
  );
}
