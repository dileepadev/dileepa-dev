import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CardButtonVariant = "primary" | "secondary" | "social";

export interface CardButtonProps {
  variant?: CardButtonVariant;
  className?: string;
  leftIcon?: ReactNode;
  children?: ReactNode;
  href: string;
  external?: boolean;
}

export const cardButtonVariantClasses: Record<CardButtonVariant, string> = {
  primary:
    "bg-accent-blue text-on-accent hover:bg-accent-blue/90 shadow-md hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-105",
  secondary:
    "bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-on-accent transition-all duration-500 ease-in-out hover:scale-105",
  social:
    "bg-bg-secondary text-text-secondary hover:bg-accent-blue hover:text-on-accent transition-all duration-500 ease-in-out hover:scale-105",
};

export function CardButton({
  variant = "primary",
  className,
  children,
  leftIcon,
  href,
  external = false,
  ...props
}: CardButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center gap-3 px-6 py-4 rounded-xl font-medium group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2",
    cardButtonVariantClasses[variant],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClasses} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
    </Link>
  );
}
