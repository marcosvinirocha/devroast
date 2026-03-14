"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { useState } from "react";

interface LeaderboardRowProps {
  id: string;
  rank: number;
  code: string;
  codeHtml: string;
  language: string;
  score: number;
}

function ChevronIcon({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === "up" ? "rotate-180" : ""}
    >
      <title>{direction === "up" ? "Collapse" : "Show more"}</title>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function LeaderboardRow({
  id,
  rank,
  code,
  codeHtml,
  language,
  score,
}: LeaderboardRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const codeLines = code.split("\n");
  const previewLines = codeLines.slice(0, 3);
  const expandedLines = codeLines.slice(0, 8);
  const hasMore = codeLines.length > 3;

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
          <div className="flex-1 flex flex-col gap-0.5 overflow-hidden font-mono text-[12px] text-text-primary">
            {isOpen
              ? expandedLines.map((line) => (
                  <span key={line.slice(0, 15)} className="truncate">
                    {line}
                  </span>
                ))
              : previewLines.map((line) => (
                  <span key={line.slice(0, 15)} className="truncate">
                    {line}
                  </span>
                ))}
          </div>
          <div className="w-20 md:w-[100px] font-mono text-[12px] text-text-secondary">
            {language}
          </div>
        </div>
        {hasMore && (
          <>
            <CollapsiblePrimitive.Trigger asChild>
              <div className="flex justify-center pb-3 cursor-pointer">
                <button
                  type="button"
                  className="flex items-center gap-1 font-mono text-[11px] text-text-secondary hover:text-text-primary transition-colors"
                >
                  <ChevronIcon direction={isOpen ? "up" : "down"} />
                  {isOpen ? "collapse" : "show more"}
                </button>
              </div>
            </CollapsiblePrimitive.Trigger>
            <CollapsiblePrimitive.Content>
              <div
                className="px-4 md:px-5 pb-4 bg-bg-input font-mono text-[12px]"
                /* biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML */
                dangerouslySetInnerHTML={{ __html: codeHtml }}
              />
            </CollapsiblePrimitive.Content>
          </>
        )}
      </div>
    </CollapsiblePrimitive.Root>
  );
}
