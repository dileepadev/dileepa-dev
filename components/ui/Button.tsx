import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

type ButtonAsButton = ButtonBaseProps & 
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
    external?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  external?: boolean;
  children?: ReactNode;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 
    'bg-brand-primary text-white hover:bg-brand-primary/90 dark:bg-accent-blue dark:text-[var(--text-on-accent)] dark:hover:bg-accent-blue/90 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out',
  secondary: 
    'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-border-light hover:scale-105',
  outline: 
    'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white dark:border-accent-blue dark:text-accent-blue dark:hover:bg-accent-blue dark:hover:text-[var(--text-on-accent)] hover:scale-105',
  ghost: 
    'text-text-primary hover:bg-bg-secondary hover:scale-105',
  link: 
    'text-accent-blue hover:text-accent-blue-dark underline-offset-4 hover:underline p-0 hover:scale-105',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  icon: 'h-10 w-10 p-2 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'cursor-pointer inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    variant !== 'link' && sizeClasses[size],
    className
  );

  if ('href' in props && props.href) {
    const { href, external, ...linkProps } = props;
    
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
          {...(linkProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </a>
      );
    }

    return (
      <Link href={href} className={baseClasses}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

type CardButtonVariant = 'primary' | 'secondary' | 'social';

interface CardButtonProps {
  variant?: CardButtonVariant;
  className?: string;
  leftIcon?: ReactNode;
  children?: ReactNode;
  href: string;
  external?: boolean;
}

const cardButtonVariantClasses: Record<CardButtonVariant, string> = {
  primary: 
    'bg-accent-blue text-on-accent hover:bg-accent-blue/90 shadow-md hover:shadow-xl transition-all duration-500 ease-in-out hover:scale-105',
  secondary: 
    'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-on-accent transition-all duration-500 ease-in-out hover:scale-105',
  social: 
    'bg-bg-secondary text-text-secondary hover:bg-accent-blue hover:text-on-accent transition-all duration-500 ease-in-out hover:scale-105',
};

export function CardButton({
  variant = 'primary',
  className,
  children,
  leftIcon,
  href,
  external = false,
  ...props
}: CardButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center gap-3 px-6 py-4 rounded-xl font-medium group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2',
    cardButtonVariantClasses[variant],
    className
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

export function IconButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      size="icon"
      className={cn(
        'rounded-full bg-white/10 text-gray-300 hover:bg-accent-blue hover:text-on-accent hover:scale-105 hover:shadow-xl transition-all duration-500 ease-in-out focus-visible:ring-2 focus-visible:ring-accent-blue',
        className
      )}
      {...props}
    />
  );
}
