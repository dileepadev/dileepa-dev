import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  default: 'bg-bg-tertiary text-text-secondary',
  primary: 'bg-accent-blue/10 text-accent-blue',
  secondary: 'bg-accent-blue/10 text-accent-blue',
  success: 'bg-accent-blue/10 text-accent-blue',
  warning: 'bg-accent-blue/10 text-accent-blue',
  error: 'bg-red-500/10 text-red-500',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  return (
    <span 
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
