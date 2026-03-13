import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
  base: "w-full border border-border-primary bg-transparent p-5",
  variants: {
    variant: {
      default: "",
      analysis: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const headerVariants = tv({
  base: "flex items-center gap-2",
});

const titleVariants = tv({
  base: "font-mono text-[13px] text-text-primary",
});

const descriptionVariants = tv({
  base: "font-mono text-xs text-text-secondary leading-relaxed w-full",
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cardVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={headerVariants({ className })} ref={ref} {...props} />
    );
  },
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return <h3 className={titleVariants({ className })} ref={ref} {...props} />;
  },
);

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p className={descriptionVariants({ className })} ref={ref} {...props} />
  );
});

CardDescription.displayName = "CardDescription";
