"use client";

import {
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";

const codeEditorVariants = tv({
  base: "",
  variants: {},
});

export interface CodeEditorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeEditorVariants> {}

export const CodeEditorRoot = forwardRef<HTMLDivElement, CodeEditorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={codeEditorVariants({ className })}
        style={{ minHeight: 200, height: "auto" }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CodeEditorRoot.displayName = "CodeEditorRoot";

const codeEditorHeaderVariants = tv({
  base: "flex items-center gap-3 h-8 md:h-10 px-3 md:px-4 border-b border-border-primary bg-bg-surface",
});

export interface CodeEditorHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeEditorHeader = forwardRef<
  HTMLDivElement,
  CodeEditorHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={codeEditorHeaderVariants({ className })}
      {...props}
    >
      {children}
    </div>
  );
});
CodeEditorHeader.displayName = "CodeEditorHeader";

const codeEditorDotVariants = tv({
  base: "rounded-full",
  variants: {
    color: {
      red: "bg-[#EF4444]",
      amber: "bg-[#F59E0B]",
      green: "bg-[#10B981]",
    },
  },
});

export interface CodeEditorDotProps
  extends VariantProps<typeof codeEditorDotVariants> {
  className?: string;
}

export const CodeEditorDot = forwardRef<HTMLSpanElement, CodeEditorDotProps>(
  ({ className, color, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={codeEditorDotVariants({ color, className })}
        {...props}
      />
    );
  },
);
CodeEditorDot.displayName = "CodeEditorDot";

const codeEditorBodyVariants = tv({
  base: "flex h-[200px] md:h-[280px] lg:h-[360px] bg-bg-input border border-border-primary border-t-0",
});

export interface CodeEditorBodyProps extends HTMLAttributes<HTMLDivElement> {}

export const CodeEditorBody = forwardRef<HTMLDivElement, CodeEditorBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={codeEditorBodyVariants({ className })}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CodeEditorBody.displayName = "CodeEditorBody";

const codeEditorLineNumbersVariants = tv({
  base: "flex flex-col gap-1.5 py-2 md:py-3 pr-2 md:pr-3 pl-3 md:pl-4 border-r border-border-primary text-right font-mono text-[11px] md:text-[12px] text-text-tertiary min-w-8 md:min-w-12",
});

export interface CodeEditorLineNumbersProps
  extends HTMLAttributes<HTMLDivElement> {
  count: number;
}

export const CodeEditorLineNumbers = forwardRef<
  HTMLDivElement,
  CodeEditorLineNumbersProps
>(({ className, count, ...props }, ref) => {
  const lineKeys = useMemo(() => {
    return Array.from({ length: count }, (_, i) => `ln-${i + 1}`);
  }, [count]);

  return (
    <div
      ref={ref}
      className={codeEditorLineNumbersVariants({ className })}
      {...props}
    >
      {lineKeys.map((key) => (
        <span key={key}>{Number(key.split("-")[1])}</span>
      ))}
    </div>
  );
});
CodeEditorLineNumbers.displayName = "CodeEditorLineNumbers";

const codeEditorContentVariants = tv({
  base: "flex-1 p-3 md:p-4 font-mono text-[11px] md:text-[12px] text-text-primary bg-transparent outline-none resize-none leading-[1.5]",
});

export interface CodeEditorContentProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const CodeEditorContent = forwardRef<
  HTMLTextAreaElement,
  CodeEditorContentProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={codeEditorContentVariants({ className })}
      placeholder="paste your code here..."
      spellCheck={false}
      {...props}
    />
  );
});
CodeEditorContent.displayName = "CodeEditorContent";

interface CodeEditorWithValueProps {
  value?: string;
}

export const CodeEditor = forwardRef<
  HTMLTextAreaElement,
  CodeEditorWithValueProps & Omit<CodeEditorContentProps, "value">
>(({ value: initialValue = "", className, ...props }, ref) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const lineCount = useMemo(() => {
    return value.split("\n").length || 1;
  }, [value]);

  return (
    <CodeEditorRoot className={className}>
      <CodeEditorHeader>
        <CodeEditorDot color="red" className="h-2.5 w-2.5 md:h-3 md:w-3" />
        <CodeEditorDot color="amber" className="h-2.5 w-2.5 md:h-3 md:w-3" />
        <CodeEditorDot color="green" className="h-2.5 w-2.5 md:h-3 md:w-3" />
      </CodeEditorHeader>
      <CodeEditorBody>
        <CodeEditorLineNumbers count={lineCount} />
        <CodeEditorContent
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
      </CodeEditorBody>
    </CodeEditorRoot>
  );
});
CodeEditor.displayName = "CodeEditor";
