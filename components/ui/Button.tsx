import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

/**
 * `.btn` and its two variants are defined once in `globals.css`, at the
 * reference's values. The component names them rather than restating them in
 * utilities: the contact form renders a bare `<button class="btn btn--primary">`
 * and the hero renders this, and the two have to be the same button.
 *
 * `inline-block` rather than `inline-flex`: the reference's buttons are
 * text-only, and a flex box centres a label that padding and `line-height: 1`
 * have already placed.
 */
const base = "btn inline-block";

const variants: Record<Variant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
};

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export function LinkButton({
  children,
  href,
  variant = "primary",
  external,
  ariaLabel,
  className,
}: LinkButtonProps) {
  const classes = cn(base, variants[variant], className);
  const isExternal = external ?? href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={classes}>
      {children}
    </Link>
  );
}
