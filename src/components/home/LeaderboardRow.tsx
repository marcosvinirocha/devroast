"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { useState } from "react";

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
  const expandedLines = codeLines.slice(0, 8);

  return (
    <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="block border-b border-border-primary hover:bg-bg-surface transition-colors">
        <div className="flex items-center px-4 md:px-5 py-4">
          <div className="w-10 md:w-[50px] font-mono text-[12px] text-text-tertiary">
            {rank}
          </div>
          <div className="w-14 md:w-[70px] font-mono text-[12px] font-bold text-accent-red">
            {score}
          </div>
          <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
            {isOpen
              ? expandedLines.map((line) => (
                  <span
                    key={line.slice(0, 15)}
                    className="font-mono text-[12px] text-text-primary truncate"
                  >
                    {line}
                  </span>
                ))
              : previewLines.map((line) => (
                  <span
                    key={line.slice(0, 15)}
                    className="font-mono text-[12px] text-text-primary truncate"
                  >
                    {line}
                  </span>
                ))}
          </div>
          <div className="flex items-center gap-3">
            <CollapsiblePrimitive.Trigger asChild>
              <button
                type="button"
                className="font-mono text-[11px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                {isOpen ? "collapse" : "show more"}
              </button>
            </CollapsiblePrimitive.Trigger>
            <div className="w-20 md:w-[100px] font-mono text-[12px] text-text-secondary">
              {language}
            </div>
          </div>
        </div>
      </div>
    </CollapsiblePrimitive.Root>
  );
}
