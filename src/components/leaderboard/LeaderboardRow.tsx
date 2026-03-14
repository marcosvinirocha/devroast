"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import Link from "next/link";
import { useState } from "react";

interface LeaderboardRowProps {
  id: string;
  rank: number;
  score: number;
  code: string;
  codeHtml: string;
  language: string;
  createdAt: string;
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LeaderboardRow({
  id,
  rank,
  score,
  code,
  codeHtml,
  language,
  createdAt,
}: LeaderboardRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const codeLines = code.split("\n");
  const previewLines = codeLines.slice(0, 3);
  const expandedLines = codeLines.slice(0, 8);
  const hasMore = codeLines.length > 3;

  return (
    <Link href={`/roast/${id}`} className="block">
      <div className="border border-border-primary bg-bg-surface rounded-md overflow-hidden hover:border-border-secondary transition-colors">
        <div className="h-12 flex items-center justify-between px-5 border-b border-border-primary">
          <div className="flex items-center gap-4">
            <span className="text-[14px] font-bold text-accent-red font-mono">
              #{rank}
            </span>
            <span className="text-[14px] text-text-primary font-mono">
              anonymous
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-text-tertiary font-mono">
              {formatDate(createdAt)}
            </span>
            <span className="text-[14px] font-bold text-accent-red font-mono">
              {score.toFixed(1)}/10
            </span>
          </div>
        </div>

        <CollapsiblePrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
          <div className="px-5 py-4">
            <div className="flex flex-col gap-0.5 font-mono text-[12px] text-text-primary">
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
                  className="px-5 pb-4 bg-bg-input font-mono text-[12px]"
                  /* biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML */
                  dangerouslySetInnerHTML={{ __html: codeHtml }}
                />
              </CollapsiblePrimitive.Content>
            </>
          )}
        </CollapsiblePrimitive.Root>
      </div>
    </Link>
  );
}
