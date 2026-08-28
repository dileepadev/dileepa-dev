"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  Radio,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const UPLINK_FRAMES = [
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ >>----x------- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: SYN_SENT (TIMEOUT)`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ ---->>--x----- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: NO_ROUTE_HOST`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ ------>>x----- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: ECONNREFUSED`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ --------x<<<<- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: RETRY_BACKOFF`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ >>----x------- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: PROBING_FALLBACK`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ ---->>----x--- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: CIRCUIT_OPEN`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ ------>>--x--- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: GATEWAY_STANDBY`,
  ` [ UPLINK PROBE ]    TARGET: api.dileepa.dev
 ┌────────────────┐   STATUS: 503_DISCONNECTED
 │ -------->>x--- │   ROUTE: /api/v1/health
 └────────────────┘   PACKET: NEXT_CYCLE_IN_3s`,
];

const ASCII_503_BANNER = `
  ____   ___  _____ 
 | ___| / _ \\|___ / 
 |___ \\| | | | |_ \\ 
  ___) | |_| |___) |
 |____/ \\___/|____/ 
`;

export function ApiOfflineVisual() {
  const [activeTab, setActiveTab] = useState<"uplink" | "cached">("uplink");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

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
      // Test the local API proxy or public health check
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
      `Target: api.dileepa.dev`,
      `Status: 503 Service Unavailable / Connection Disconnected`,
      `Timestamp: ${new Date().toISOString()}`,
      `Frontend: dileepa.dev (Static Shell Active)`,
      `Fallback: Degraded Cache Mode`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(report);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="rounded-lg border border-border-strong bg-bg-surface overflow-hidden shadow-xs">
      {/* Chassis Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-bg border-b border-border-strong text-xs font-mono">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block shrink-0" />
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block shrink-0" />
          <span className="w-2 h-2 rounded-full bg-border-strong inline-block shrink-0" />
          <span className="ml-2 text-fg-muted truncate">uplink://api.dileepa.dev/status</span>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center rounded border border-border-strong overflow-hidden text-[0.6875rem] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("uplink")}
            className={cn(
              "px-2 py-0.5 transition-colors cursor-pointer inline-flex items-center gap-1",
              activeTab === "uplink"
                ? "bg-brand text-bg font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            <Radio className="h-3 w-3" />
            <span>Uplink</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cached")}
            className={cn(
              "px-2 py-0.5 transition-colors cursor-pointer border-l border-border-strong inline-flex items-center gap-1",
              activeTab === "cached"
                ? "bg-brand text-bg font-medium"
                : "bg-bg-surface text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            <ShieldCheck className="h-3 w-3" />
            <span>Available pages</span>
          </button>
        </div>
      </div>

      {/* Main Viewport (Equal Box Size to Prevent Layout Shift) */}
      {activeTab === "uplink" ? (
        <div className="min-h-[390px] sm:h-[390px] p-4 sm:p-5 font-mono text-xs flex flex-col justify-between gap-3">
          <div className="space-y-3">
            {/* Big ASCII 503 Banner */}
            <div className="p-2.5 rounded bg-bg border border-border-strong/70 text-brand select-none overflow-x-auto">
              <pre className="text-[0.625rem] sm:text-xs leading-[1.15] font-bold">
                {ASCII_503_BANNER}
              </pre>
            </div>

            {/* Animated ASCII Network Uplink */}
            <div className="p-2.5 rounded bg-bg border border-border-strong/70 overflow-hidden relative">
              <pre className="text-[0.6875rem] leading-[1.25] text-fg select-none whitespace-pre">
                {UPLINK_FRAMES[frameIndex]}
              </pre>

              {isProbing && (
                <div className="absolute inset-0 bg-brand/15 flex items-center justify-center pointer-events-none transition-opacity">
                  <span className="text-brand font-bold text-xs animate-pulse">
                    (( TRANSMITTING HEALTH CHECK BEAM ))
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            {/* Uplink Telemetry */}
            <div className="text-[0.6875rem] text-fg-muted space-y-1 pt-2 border-t border-border-strong/40">
              <div className="flex items-center justify-between">
                <span>GATEWAY ORIGIN:</span>
                <span className="text-fg font-medium">https://api.dileepa.dev</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CONNECTION STATE:</span>
                <span className="text-brand font-medium">503_DISCONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span>PROBE RESPONSE:</span>
                <span className="text-fg font-medium">
                  {probeResult || "AWAITING USER PROBE"}
                </span>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="mt-3 pt-2.5 border-t border-border-strong/60 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleProbeApi}
                disabled={isProbing}
                className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5 text-brand border-brand/30 hover:border-brand"
              >
                <RefreshCw className={cn("h-3 w-3", isProbing && "animate-spin")} />
                <span>{isProbing ? "Probing..." : "Probe gateway"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyStatus}
                className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1.5"
              >
                {copiedStatus ? (
                  <>
                    <Check className="h-3 w-3 text-brand" />
                    <span className="text-brand">Copied status</span>
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand shrink-0" />
              <span className="font-bold text-fg text-sm">
                Static resilience active
              </span>
            </div>
            <p className="text-[0.75rem] text-fg-muted leading-relaxed">
              While the live API is disconnected, the platform continues to serve
              static pages and content pre-rendered from Git:
            </p>

            <div className="space-y-1.5 pt-1">
              {[
                { title: "Brand & Design Reference", path: "/brand", badge: "Static" },
                { title: "Speaker Media Kit & Bios", path: "/profile", badge: "Static" },
                { title: "Visual Sitemap & Directory", path: "/sitemap", badge: "Static" },
                { title: "Legal & Terms of Service", path: "/privacy", badge: "Static" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex items-center justify-between p-2 rounded bg-bg border border-border-strong/70 hover:border-brand transition-colors text-fg group"
                >
                  <span className="truncate group-hover:text-brand transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[0.625rem] px-1.5 py-0.2 rounded bg-brand/10 text-brand border border-brand/20 shrink-0">
                    {item.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border-strong/40 flex items-center justify-between text-[0.6875rem] text-fg-muted">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-brand" />
              <span>Canonical platform</span>
            </div>
            <a
              href="mailto:contact@dileepa.dev?subject=API%20Outage%20Report"
              className="text-brand hover:underline inline-flex items-center gap-1"
            >
              <span>Report outage</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
