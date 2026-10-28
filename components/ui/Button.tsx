import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

/**
 * `sm` is the action size (v2.1.0 draft): copy, download, share, open,
 * expand - the small controls that sit beside content rather than lead a
 * page. One size for all of them, so a "Copy" on the brand page and a "Copy"
 * on a code block are the same object.
 */
type Size = "md" | "sm";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

/**
 * `.btn` and its two variants are defined once in `globals.css`, at the
 * reference's values. The component names them rather than restating them in
 * utilities: the contact form renders a bare `<button class="btn btn--primary">`
 * and the hero renders this, and the two have to be the same button.
 */
const base = "btn inline-flex items-center justify-center gap-2";

const variants: Record<Variant, string> = {
  primary: "btn--primary",
  secondary: "btn--secondary",
};

/**
 * The class list a button carries, for the few controls that cannot be a
 * `Button` or `LinkButton` - a download `<a>`, a copy button with its own
 * state. Use it rather than restating `btn` classes by hand.
 */
export function buttonClasses({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}): string {
  return cn(base, variants[variant], size === "sm" && "btn--sm", className);
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props}>
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
  size = "md",
  external,
  ariaLabel,
  className,
}: LinkButtonProps) {
  const classes = buttonClasses({ variant, size, className });
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
