import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "base" | "md";
  className?: string;
}

const variantClasses = {
  default: "bg-badge-default text-badge-default",
  primary: "bg-badge-primary text-badge-primary",
  secondary: "bg-badge-secondary text-badge-secondary",
  success: "bg-badge-success text-badge-success",
  warning: "bg-badge-warning text-badge-warning",
  error: "bg-badge-error text-badge-error",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-sm",
  base: "px-3 py-1 text-base",
  md: "px-3 py-1 text-md",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
