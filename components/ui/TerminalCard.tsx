import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The terminal window the 404, 500 and 503 pages draw beside their message
 * (v2.1.0 draft).
 *
 * One frame for all three, so they cannot drift apart again: a title bar with
 * the address, the view tabs on their own row (beside the address they were
 * squeezed until both truncated), and a body that grows with its content
 * rather than clipping it at a fixed height. Styles live under
 * `.terminal-card` in `globals.css`.
 */
export function TerminalCard({
  address,
  tabs,
  children,
}: {
  address: string;
  tabs?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="terminal-card">
      <div className="terminal-card-bar">
        <span className="terminal-card-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="terminal-card-address">{address}</span>
      </div>
      {tabs && <div className="terminal-card-tabs">{tabs}</div>}
      <div className="terminal-card-body">{children}</div>
    </div>
  );
}

/** One block inside the window - an ASCII banner, a live readout. */
export function TerminalPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("terminal-panel", className)}>{children}</div>;
}

/** Label and value rows, pinned to the bottom of the body. */
export function TerminalReadout({
  rows,
}: {
  rows: { label: string; value: ReactNode; strong?: boolean }[];
}) {
  return (
    <dl className="terminal-readout">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd className={row.strong ? "is-strong" : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
