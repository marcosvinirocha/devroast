import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const codeBlockVariants = tv({
  base: "w-full border border-border-primary bg-bg-input overflow-hidden",
});

const codeHeaderVariants = tv({
  base: "flex items-center gap-3 h-10 px-4 border-b border-border-primary",
});

const codeBodyVariants = tv({
  base: "flex",
});

const lineNumbersVariants = tv({
  base: "flex flex-col gap-1.5 py-3 pr-3 pl-[10px] border-r border-border-primary text-right font-mono text-[13px] text-text-tertiary min-w-[40px]",
});

const codeContentVariants = tv({
  base: "flex flex-col gap-1.5 p-3 font-mono text-[13px]",
});

const codeDotVariants = tv({
  base: "h-2.5 w-2.5 rounded-full",
  variants: {
    color: {
      red: "bg-[#EF4444]",
      amber: "bg-[#F59E0B]",
      green: "bg-[#10B981]",
    },
  },
});

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeBlockRoot = forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={codeBlockVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
CodeBlockRoot.displayName = "CodeBlockRoot";

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <CodeBlockRoot ref={ref} className={className} {...props}>
        {children}
      </CodeBlockRoot>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

export interface CodeHeaderProps extends HTMLAttributes<HTMLDivElement> {
  fileName?: string;
}

export const CodeHeader = forwardRef<HTMLDivElement, CodeHeaderProps>(
  ({ className, fileName, children, ...props }, ref) => {
    return (
      <div className={codeHeaderVariants({ className })} ref={ref} {...props}>
        <span className={codeDotVariants({ color: "red" })} />
        <span className={codeDotVariants({ color: "amber" })} />
        <span className={codeDotVariants({ color: "green" })} />
        {fileName && (
          <span className="ml-auto font-mono text-xs text-text-tertiary">
            {fileName}
          </span>
        )}
        {children}
      </div>
    );
  },
);
CodeHeader.displayName = "CodeHeader";

export interface CodeBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeBody = forwardRef<HTMLDivElement, CodeBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={codeBodyVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
CodeBody.displayName = "CodeBody";

export interface CodeLineNumbersProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeLineNumbers = forwardRef<HTMLDivElement, CodeLineNumbersProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={lineNumbersVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
CodeLineNumbers.displayName = "CodeLineNumbers";

export interface CodeContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeContent = forwardRef<HTMLDivElement, CodeContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={codeContentVariants({ className })} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
CodeContent.displayName = "CodeContent";

export interface CodeLineProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeLine = forwardRef<HTMLDivElement, CodeLineProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={className} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
CodeLine.displayName = "CodeLine";

type CodeDotColor = "red" | "amber" | "green";

export interface CodeDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: CodeDotColor;
}

export const CodeDot = forwardRef<HTMLSpanElement, CodeDotProps>(
  ({ className, color, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={codeDotVariants({ color, className })}
        {...props}
      />
    );
  },
);
CodeDot.displayName = "CodeDot";
