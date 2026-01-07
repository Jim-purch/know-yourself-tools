import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {

    const variants = {
      primary: "bg-[var(--primary)] text-[var(--bg-main)] hover:bg-[var(--primary-hover)] shadow-lg shadow-[var(--primary)]/20 border-transparent",
      secondary: "bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--glass-bg)] border-[var(--border-color)] hover:border-[var(--primary)]",
      ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)] border-transparent",
      outline: "bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10",
      danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 border",
          "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-main)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
