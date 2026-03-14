"use client";

import { Suspense } from "react";
import { trpc } from "@/trpc";

function MetricsContent() {
  const { data: metrics } = trpc.metrics.getRoastStats.useQuery({
    status: "completed",
  });

  const total = metrics?.totalRoasts ?? 0;
  const avgScore = metrics?.avgScore ?? 0;

  return (
    <div className="flex items-center gap-2 text-[12px] text-text-tertiary font-mono">
      <span>{total.toLocaleString()} submissions</span>
      <span>·</span>
      <span>avg score: {avgScore.toFixed(1)}/10</span>
    </div>
  );
}

export function Metrics() {
  return (
    <Suspense
      fallback={
        <div className="h-5 w-48 bg-bg-surface animate-pulse rounded" />
      }
    >
      <MetricsContent />
    </Suspense>
  );
}
