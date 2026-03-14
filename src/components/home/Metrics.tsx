import { Suspense } from "react";
import { trpc } from "@/trpc";
import { MetricsContent } from "./MetricsContent";

function MetricsFetcher() {
  const stats = trpc.metrics.getRoastStats.useQuery({ status: "completed" });

  if (stats.isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 md:gap-6 text-[11px] md:text-[12px] font-mono text-text-tertiary">
        <span>--- codes roasted</span>
        <span>·</span>
        <span>avg score: -.- /10</span>
      </div>
    );
  }

  return (
    <MetricsContent
      totalRoasts={stats.data?.totalRoasts ?? 0}
      avgScore={stats.data?.avgScore ?? 0}
    />
  );
}

export function Metrics() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-4 md:gap-6 text-[11px] md:text-[12px] font-mono text-text-tertiary">
          <span>--- codes roasted</span>
          <span>·</span>
          <span>avg score: -.- /10</span>
        </div>
      }
    >
      <MetricsFetcher />
    </Suspense>
  );
}
