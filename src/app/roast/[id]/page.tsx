"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlockServer } from "@/components/ui/code-block-server";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { trpc } from "@/trpc";

function LoadingState() {
  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 bg-bg-surface animate-pulse rounded" />
          <div className="h-5 w-24 bg-bg-surface animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-12">
          <div className="w-[140px] h-[140px] rounded-full bg-bg-surface animate-pulse" />
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-6 w-32 bg-bg-surface animate-pulse rounded" />
            <div className="h-8 w-3/4 bg-bg-surface animate-pulse rounded" />
            <div className="h-4 w-48 bg-bg-surface animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-accent-green">
              {">"}
            </span>
            <span className="text-[18px] font-medium text-text-primary">
              devroast
            </span>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-[20px] font-mono text-accent-red">
            Error: {error}
          </span>
          <Link href="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RoastResultPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, error } = trpc.submissions.getById.useQuery({ id });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState error={error?.message || "Submission not found"} />;
  }

  const { code, codeHtml, language, score, roast, createdAt } = data;

  if (!roast) {
    return <ErrorState error="Roast not found for this submission" />;
  }

  const codeLines = code.split("\n").length;
  const suggestedFixLines = roast.suggestedFix?.split("\n") || [];

  const diffLines: Array<{
    type: "context" | "added";
    prefix: string;
    content: string;
  }> = roast.suggestedFix
    ? suggestedFixLines.map((line: string) => {
        const originalLine = code
          .split("\n")
          .find((ol: string) => ol.trim() === line.trim());
        return {
          type: originalLine ? ("context" as const) : ("added" as const),
          prefix: originalLine ? " " : "+",
          content: line,
        };
      })
    : [];

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[20px] font-bold text-accent-green">
              {">"}
            </span>
            <span className="text-[18px] font-medium text-text-primary">
              devroast
            </span>
          </Link>
          <Link href="/leaderboard">
            <span className="font-mono text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              leaderboard
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-12">
          <ScoreRing score={score} />

          <div className="flex flex-col gap-4 flex-1">
            <Badge variant="critical">
              verdict: {roast.verdict || "needs_review"}
            </Badge>
            <p className="text-[20px] text-text-primary font-mono leading-relaxed">
              &quot;{roast.quote || "No quote available"}&quot;
            </p>
            <div className="flex items-center gap-4 text-[12px] text-text-tertiary font-mono">
              <span>lang: {language}</span>
              <span>·</span>
              <span>{codeLines} lines</span>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" disabled>
                share (coming soon)
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-accent-green font-mono">
              {"//"}
            </span>
            <span className="text-[14px] font-bold text-text-primary font-mono">
              your_submission
            </span>
          </div>
          <CodeBlockServer code={code} language={language} showHeader={false} />
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-accent-green font-mono">
              {"//"}
            </span>
            <span className="text-[14px] font-bold text-text-primary font-mono">
              detailed_analysis
            </span>
          </div>

          {roast.issues && roast.issues.length > 0 ? (
            <div className="grid grid-cols-2 gap-5">
              {roast.issues.map(
                (
                  issue: {
                    title: string;
                    description: string;
                    severity: string;
                  },
                  idx: number,
                ) => (
                  <div
                    key={issue.title}
                    className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          issue.severity === "critical"
                            ? "bg-accent-red"
                            : issue.severity === "warning"
                              ? "bg-accent-amber"
                              : "bg-accent-green"
                        }`}
                      />
                      <span className="text-[13px] font-medium text-text-primary font-mono">
                        {issue.title}
                      </span>
                    </div>
                    <p className="text-[13px] text-text-secondary font-mono">
                      {issue.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="p-5 border border-border-primary bg-bg-surface">
              <p className="text-[13px] text-text-secondary font-mono">
                No specific issues found. The code could still be improved!
              </p>
            </div>
          )}
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-accent-green font-mono">
              {"//"}
            </span>
            <span className="text-[14px] font-bold text-text-primary font-mono">
              suggested_fix
            </span>
          </div>

          {roast.suggestedFix ? (
            <div className="border border-border-primary bg-bg-input overflow-hidden">
              <div className="h-10 flex items-center px-4 border-b border-border-primary">
                <span className="font-mono text-[12px] text-text-secondary">
                  your_code.ts → improved_code.ts
                </span>
              </div>
              <div className="flex flex-col">
                {diffLines.map(
                  (
                    line: {
                      type: "context" | "added";
                      prefix: string;
                      content: string;
                    },
                    idx: number,
                  ) => (
                    <DiffLine
                      key={line.content.slice(0, 15)}
                      type={line.type}
                      prefix={line.prefix}
                    >
                      {line.content}
                    </DiffLine>
                  ),
                )}
              </div>
            </div>
          ) : (
            <div className="p-5 border border-border-primary bg-bg-surface">
              <p className="text-[13px] text-text-secondary font-mono">
                No suggested fix available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
