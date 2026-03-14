"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import Link from "next/link";
import { useState } from "react";
import { CodeBlockServer } from "@/components/ui/code-block-server";

interface LeaderboardRowProps {
  id: string;
  rank: number;
  code: string;
  language: string;
  score: number;
}

export function LeaderboardRow({
  id,
  rank,
  code,
  language,
  score,
}: LeaderboardRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const codeLines = code.split("\n");
  const previewLines = codeLines.slice(0, 3);

  return (
    <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <CollapsiblePrimitive.Trigger asChild>
        <Link
          href={`/roast/${id}`}
          className="block border-b border-border-primary hover:bg-bg-surface transition-colors cursor-pointer"
        >
          <div className="flex items-center px-4 md:px-5 py-4">
            <div className="w-10 md:w-[50px] font-mono text-[12px] text-text-tertiary">
              {rank}
            </div>
            <div className="w-14 md:w-[70px] font-mono text-[12px] font-bold text-accent-red">
              {score}
            </div>
            <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
              {previewLines.map((line) => (
                <span
                  key={line.slice(0, 15)}
                  className="font-mono text-[12px] text-text-primary truncate"
                >
                  {line}
                </span>
              ))}
              {codeLines.length > 3 && (
                <span className="font-mono text-[11px] text-text-tertiary">
                  {isOpen
                    ? "click to collapse"
                    : `+${codeLines.length - 3} more lines`}
                </span>
              )}
            </div>
            <div className="w-20 md:w-[100px] font-mono text-[12px] text-text-secondary">
              {language}
            </div>
          </div>
        </Link>
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content>
        <div className="border-b border-border-primary bg-bg-input">
          <CodeBlockServer
            code={code}
            language={language}
            showHeader={false}
            showLineNumbers={false}
            className="!border-0"
          />
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}
