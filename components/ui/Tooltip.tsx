"use client";

import { ReactNode, useId } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = "" }: TooltipProps) {
  const id = useId();

  return (
    <div className="relative inline-block">
      <div
        tabIndex={0}
        aria-describedby={id}
        className={`group inline-flex items-center ${className}`}
      >
        {children}
        <span
          id={id}
          role="tooltip"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-20 z-10 w-max max-w-xs rounded-md bg-bg-elevated border border-border-light text-text-primary text-sm px-3 py-4 opacity-0 scale-95 transform transition-all duration-150 ease-out group-hover:opacity-100 group-focus:opacity-100 group-hover:scale-100 group-focus:scale-100"
        >
          {content}
        </span>
      </div>
    </div>
  );
}
