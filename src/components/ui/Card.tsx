import React from 'react';
import { cn } from '../../utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'outline';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', hoverEffect = false, children, ...props }, ref) => {
    const variants = {
      default: "bg-[var(--bg-card)] border-[var(--border-color)]",
      glass: "bg-[var(--glass-bg)] border-[var(--glass-border)] backdrop-blur-md",
      outline: "bg-transparent border-[var(--border-color)]"
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl border p-6 transition-all duration-300",
          variants[variant],
          hoverEffect && "hover:translate-y-[-4px] hover:shadow-xl hover:shadow-[var(--shadow-color)] hover:border-[var(--primary)]",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
