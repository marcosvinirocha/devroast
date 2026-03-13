import { type ButtonHTMLAttributes, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:pointer-events-none disabled:opacity-50 font-mono",
  variants: {
    variant: {
      default: "bg-accent-green text-bg-page enabled:hover:bg-border-focus",
      secondary:
        "border border-border-primary bg-transparent text-text-primary enabled:hover:bg-border-primary",
      link: "border border-border-primary bg-transparent text-text-secondary enabled:hover:text-text-primary",
      ghost:
        "bg-transparent text-text-primary enabled:hover:bg-border-secondary",
      destructive: "bg-red-accent text-white enabled:hover:bg-[#DC2626]",
    },
    size: {
      sm: "h-8 px-3 text-xs py-2",
      default: "h-[34px] px-6 py-2.5 text-[13px]",
      lg: "h-12 px-8 text-base",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
