"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Globe, RefreshCw, ShieldCheck } from "lucide-react";
import { useCopy } from "./useCopy";
import { cn } from "@/lib/utils";
import { TerminalCard, TerminalPanel, TerminalReadout } from "./TerminalCard";
import { ToggleGroup } from "./ToggleGroup";

/**
 * The 503 page's terminal window: an uplink probe that can check the API and
 * reload when it is back, and a view of the pages that still work without
 * it. The frame, panels and readout are `TerminalCard`'s, shared with the
 * 404 and 500 pages.
 */

/** Drops the blank first and last lines the template literals carry. */
const art = (text: string) => text.replace(/^\n+|\n+$/g, "");

/** The uplink probe's trace and packet state, one entry per animation frame. */
const UPLINK_FRAMES = [
  { trace: ">>----x-------", packet: "SYN_SENT (TIMEOUT)" },
  { trace: "---->>--x-----", packet: "NO_ROUTE_HOST" },
  { trace: "------>>x-----", packet: "ECONNREFUSED" },
  { trace: "--------x<<<<-", packet: "RETRY_BACKOFF" },
  { trace: ">>----x-------", packet: "PROBING_FALLBACK" },
  { trace: "---->>----x---", packet: "CIRCUIT_OPEN" },
  { trace: "------>>--x---", packet: "GATEWAY_STANDBY" },
  { trace: "-------->>x---", packet: "NEXT_CYCLE_IN_3s" },
];

const ASCII_503_BANNER = `
  ____   ___  _____ 
 | ___| / _ \\|___ / 
 |___ \\| | | | |_ \\ 
  ___) | |_| |___) |
 |____/ \\___/|____/ 
`;

export function ApiOfflineVisual({
  targetHost = "api.dileepa.dev",
}: {
  targetHost?: string;
} = {}) {
  const [activeTab, setActiveTab] = useState<"uplink" | "cached">("uplink");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);
  const { copied: copiedStatus, copy } = useCopy();

  // Cycle ASCII uplink animation
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % UPLINK_FRAMES.length);
    }, 240);
    return () => clearInterval(timer);
  }, []);

  const handleProbeApi = async () => {
    setIsProbing(true);
    setProbeResult(null);

    try {
      const res = await fetch("/api/proxy/health", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        setProbeResult("CONNECTED! Reloading...");
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 1200);
      } else {
        setProbeResult(`STATUS ${res.status}: UNREACHABLE`);
      }
    } catch {
      setProbeResult("PROBE FAILED: TIMEOUT");
    } finally {
      setIsProbing(false);
      setTimeout(() => setProbeResult(null), 4000);
    }
  };

  const handleCopyStatus = async () => {
    const report = [
      `[dileepa.dev API Health Status]`,
      `Target: ${targetHost}`,
      `Status: 503 Service Unavailable / Connection Disconnected`,
      `Timestamp: ${new Date().toISOString()}`,
      `Frontend: dileepa.dev (Static Shell Active)`,
      `Fallback: Degraded Cache Mode`,
    ].join("\n");

    await copy(report);
  };

  const frame = UPLINK_FRAMES[frameIndex];

  return (
    <TerminalCard
      address={`uplink://${targetHost}/status`}
      tabs={
        <ToggleGroup
          label="View"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: "uplink", label: "Uplink" },
            { value: "cached", label: "Available pages" },
          ]}
        />
      }
    >
      {activeTab === "uplink" ? (
        <>
          <TerminalPanel className="terminal-banner">
            <pre aria-hidden="true">{art(ASCII_503_BANNER)}</pre>
          </TerminalPanel>

          <TerminalPanel>
            <pre aria-hidden="true">
              {`[ UPLINK PROBE ]\nTARGET: ${targetHost}`}
            </pre>
            <div className="terminal-trace">
              <pre aria-hidden="true">{frame.trace}</pre>
            </div>
            <pre aria-hidden="true">{`PACKET: ${frame.packet}`}</pre>
            {isProbing && (
              <div className="terminal-flash animate-pulse">
                (( HEALTH CHECK BEAM ))
              </div>
            )}
          </TerminalPanel>

          <TerminalReadout
            rows={[
              { label: "GATEWAY", value: targetHost },
              { label: "STATE", value: "503_DISCONNECTED", strong: true },
              { label: "PROBE", value: probeResult || "AWAITING USER PROBE" },
            ]}
          />

          <div className="terminal-actions">
            <button
              type="button"
              onClick={handleProbeApi}
              disabled={isProbing}
              className="btn btn--secondary btn--sm"
            >
              <RefreshCw className={cn(isProbing && "animate-spin")} />
              <span>{isProbing ? "Probing..." : "Probe gateway"}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyStatus}
              className="btn btn--secondary btn--sm"
            >
              {copiedStatus ? (
                <Check className="copy-tick" />
              ) : (
                <Copy className="copy-icon" />
              )}
              <span>{copiedStatus ? "Copied" : "Copy report"}</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-fg">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span className="font-medium text-small">
              Static resilience active
            </span>
          </div>
          <p>
            While the live API is disconnected, the platform keeps serving the
            pages and content pre-rendered from Git:
          </p>

          <ul className="space-y-2">
            {[
              { title: "Brand & design reference", path: "/brand" },
              { title: "Speaker media kit & bios", path: "/profile" },
              { title: "Visual sitemap & directory", path: "/sitemap" },
              { title: "Legal & terms of service", path: "/privacy" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="terminal-panel flex items-center justify-between gap-3 py-2.5! text-fg transition-colors hover:text-fg-muted"
                >
                  <span className="min-w-0">{item.title}</span>
                  <span className="chip shrink-0">Static</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="terminal-actions mt-auto pt-3 border-t border-border-hairline">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <span>Canonical platform</span>
            </span>
            <a
              href="mailto:contact@dileepa.dev?subject=API%20Outage%20Report"
              className="text-link"
            >
              Report outage
            </a>
          </div>
        </>
      )}
    </TerminalCard>
  );
}
