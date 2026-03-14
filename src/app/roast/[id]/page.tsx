import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlockServer } from "@/components/ui/code-block-server";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

const STATIC_ROAST_DATA = {
  score: 3.5,
  verdict: "needs_serious_help",
  quote:
    "this code looks like it was written during a power outage... in 2005.",
  language: "javascript",
  lines: 7,
  code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
  issues: [
    {
      title: "Use of var instead of let/const",
      description:
        "The var keyword has function scope and is hoisted, leading to unexpected behavior.",
      severity: "warning",
    },
    {
      title: "Missing error handling",
      description: "No validation for null/undefined items in the array.",
      severity: "critical",
    },
    {
      title: "Inefficient loop",
      description:
        "Consider using reduce() or forEach() for better readability.",
      severity: "warning",
    },
    {
      title: "Magic numbers",
      description:
        "Hardcoded values should be constants with descriptive names.",
      severity: "warning",
    },
  ],
  improvedCode: [
    {
      type: "context" as const,
      prefix: " ",
      content: "const calculateTotal = (items) => {",
    },
    {
      type: "added" as const,
      prefix: "+",
      content: "  if (!Array.isArray(items)) return 0;",
    },
    {
      type: "added" as const,
      prefix: "+",
      content: "  return items.reduce((sum, item) => {",
    },
    {
      type: "added" as const,
      prefix: "+",
      content: "    const price = item?.price ?? 0;",
    },
    { type: "added" as const, prefix: "+", content: "    return sum + price;" },
    { type: "added" as const, prefix: "+", content: "  }, 0);" },
    { type: "context" as const, prefix: " ", content: "};" },
  ],
};

export default function RoastResultPage() {
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
          <ScoreRing score={STATIC_ROAST_DATA.score} />

          <div className="flex flex-col gap-4 flex-1">
            <Badge variant="critical">
              verdict: {STATIC_ROAST_DATA.verdict}
            </Badge>
            <p className="text-[20px] text-text-primary font-mono leading-relaxed">
              &quot;{STATIC_ROAST_DATA.quote}&quot;
            </p>
            <div className="flex items-center gap-4 text-[12px] text-text-tertiary font-mono">
              <span>lang: {STATIC_ROAST_DATA.language}</span>
              <span>·</span>
              <span>{STATIC_ROAST_DATA.lines} lines</span>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                share
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
          <CodeBlockServer
            code={STATIC_ROAST_DATA.code}
            language={STATIC_ROAST_DATA.language}
            showHeader={false}
          />
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

          <div className="grid grid-cols-2 gap-5">
            {STATIC_ROAST_DATA.issues.map((issue) => (
              <div
                key={issue.title}
                className="flex flex-col gap-3 p-5 border border-border-primary bg-bg-surface"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-red" />
                  <span className="text-[13px] font-medium text-text-primary font-mono">
                    {issue.title}
                  </span>
                </div>
                <p className="text-[13px] text-text-secondary font-mono">
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
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

          <div className="border border-border-primary bg-bg-input overflow-hidden">
            <div className="h-10 flex items-center px-4 border-b border-border-primary">
              <span className="font-mono text-[12px] text-text-secondary">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <div className="flex flex-col">
              {STATIC_ROAST_DATA.improvedCode.map((line) => (
                <DiffLine
                  key={line.content.slice(0, 15)}
                  type={line.type}
                  prefix={line.prefix}
                >
                  {line.content}
                </DiffLine>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
