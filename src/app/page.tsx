"use client";

import Link from "next/link";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Leaderboard } from "@/components/home/Leaderboard";
import { Metrics } from "@/components/home/Metrics";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

// TODO: handle tax calculation
// TODO: handle currency conversion
}`;

export default function Home() {
  const [code, setCode] = useState(sampleCode);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const hasCode = code.trim().length > 0 && !limitExceeded;

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-[960px] mx-auto px-4 md:px-10 pt-8 md:pt-10 flex flex-col gap-6 md:gap-8">
        <section className="flex flex-col gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-2xl md:text-3xl lg:text-[36px] font-bold font-mono text-accent-green">
                $
              </span>
              <span className="text-2xl md:text-3xl lg:text-[36px] font-bold font-mono text-text-primary">
                paste your code. get roasted.
              </span>
            </div>
          </div>
          <span className="text-sm md:text-[14px] font-mono text-text-secondary">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </span>
        </section>

        <section>
          <CodeEditor
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onLimitExceeded={(exceeded) => setLimitExceeded(exceeded)}
            className="w-full max-w-[780px]"
          />
        </section>

        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-[780px]">
          <Toggle label="roast mode" />
          <Button variant="default" disabled={!hasCode}>
            $ roast_my_code
          </Button>
        </section>

        <section>
          <Metrics />
        </section>

        <section className="h-10 md:h-[60px]" />

        <section className="flex flex-col gap-4 md:gap-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold font-mono text-accent-green">
                {"//"}
              </span>
              <span className="text-[14px] font-bold font-mono text-text-primary">
                shame_leaderboard
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="text-[12px] font-mono text-text-secondary enabled:hover:text-text-primary transition-colors cursor-pointer border border-border-primary bg-transparent px-3 py-1.5"
            >
              $ view_all &gt;&gt;
            </Link>
          </div>

          <span className="text-[13px] font-mono text-text-tertiary">
            {"// the worst code on the internet, ranked by shame"}
          </span>

          <Leaderboard />
        </section>

        <section className="h-10 md:h-[60px]" />
      </div>
    </div>
  );
}
