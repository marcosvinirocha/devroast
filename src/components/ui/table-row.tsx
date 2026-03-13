import { forwardRef, type HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tableRowVariants = tv({
  base: "flex w-full items-center gap-6 border-b border-border-primary px-5 py-4",
});

const rankCellVariants = tv({
  base: "w-10 font-mono text-xs text-text-tertiary",
});

const scoreCellVariants = tv({
  base: "w-[60px] font-mono text-[13px] font-bold",
  variants: {
    variant: {
      good: "text-accent-green",
      warning: "text-accent-amber",
      bad: "text-accent-red",
    },
  },
  defaultVariants: {
    variant: "bad",
  },
});

const codeCellVariants = tv({
  base: "flex-1 font-mono text-xs text-text-secondary truncate",
});

const langCellVariants = tv({
  base: "w-[100px] font-mono text-xs text-text-tertiary",
});

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {}

export interface TableRankCellProps extends HTMLAttributes<HTMLDivElement> {}

export interface TableScoreCellProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scoreCellVariants> {}

export interface TableCodeCellProps extends HTMLAttributes<HTMLDivElement> {}

export interface TableLangCellProps extends HTMLAttributes<HTMLDivElement> {}

export const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={tableRowVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

TableRow.displayName = "TableRow";

export const TableRankCell = forwardRef<HTMLDivElement, TableRankCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={rankCellVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

TableRankCell.displayName = "TableRankCell";

export const TableScoreCell = forwardRef<HTMLDivElement, TableScoreCellProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        className={scoreCellVariants({ variant, className })}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TableScoreCell.displayName = "TableScoreCell";

export const TableCodeCell = forwardRef<HTMLDivElement, TableCodeCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={codeCellVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

TableCodeCell.displayName = "TableCodeCell";

export const TableLangCell = forwardRef<HTMLDivElement, TableLangCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={langCellVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

TableLangCell.displayName = "TableLangCell";
