import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
  base: "flex w-full gap-2 px-4 py-2 font-mono text-[13px]",
  variants: {
    type: {
      removed: "bg-diff-removed text-text-secondary",
      added: "bg-diff-added text-text-primary",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const prefixVariants = tv({
  base: "w-4 font-mono",
  variants: {
    type: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
});

export interface DiffLineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof diffLineProps> {
  prefix?: string;
}

const diffLineProps = diffLineVariants;

export const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type, prefix, children, ...props }, ref) => {
    return (
      <div
        className={diffLineVariants({ type, className })}
        ref={ref}
        {...props}
      >
        <span className={prefixVariants({ type })}>{prefix}</span>
        <span className="flex-1">{children}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";
