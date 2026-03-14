import { tv } from "tailwind-variants";
import { codeToHtml } from "@/lib/shiki";
import { CodeHeader } from "./code-block";

const codeBlockVariants = tv({
  base: "w-full border border-border-primary bg-bg-input overflow-hidden",
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

const dotVariants = tv({
  base: "h-2.5 w-2.5 rounded-full",
  variants: {
    color: {
      red: "bg-[#EF4444]",
      amber: "bg-[#F59E0B]",
      green: "bg-[#10B981]",
    },
  },
});

export interface CodeBlockServerProps {
  code: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  showHeader?: boolean;
  className?: string;
}

export async function CodeBlockServer({
  code,
  language = "javascript",
  fileName,
  showLineNumbers = true,
  showHeader = true,
  className,
}: CodeBlockServerProps) {
  const html = await codeToHtml(code, language);
  const lines = code.split("\n");

  return (
    <div className={codeBlockVariants({ className })}>
      {showHeader && (
        <CodeHeader fileName={fileName}>
          <span className={dotVariants({ color: "red" })} />
          <span className={dotVariants({ color: "amber" })} />
          <span className={dotVariants({ color: "green" })} />
        </CodeHeader>
      )}
      <div className={codeBodyVariants()}>
        {showLineNumbers && (
          <div className={lineNumbersVariants()}>
            {lines.map((line, i) => {
              const lineKey = `${i}-${line.slice(0, 10)}`;
              return <span key={lineKey}>{i + 1}</span>;
            })}
          </div>
        )}
        <div
          className={codeContentVariants()}
          /* biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML */
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
