import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-bg-elevated border border-border-light relative overflow-hidden group',
  elevated: 'bg-bg-elevated shadow-lg border border-border-light relative overflow-hidden group',
  outlined: 'border-2 border-border-medium bg-transparent relative overflow-hidden group',
  ghost: 'bg-transparent',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = false,
  padding = 'md'
}: CardProps) {
  return (
    <div 
      className={cn(
        'rounded-xl transition-all duration-500',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-xl hover:scale-[1.01] hover:border-accent-blue/30',
        className
      )}
    >
        {/* Glow Effect */}
      {hover && (
        <div className="absolute inset-0 -z-10 bg-linear-to-tr from-accent-blue/0 via-accent-blue/0 to-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, className, as: Component = 'h3' }: CardTitleProps) {
  return (
    <Component className={cn('text-xl font-bold text-text-primary', className)}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-text-secondary', className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-border-light', className)}>
      {children}
    </div>
  );
}
