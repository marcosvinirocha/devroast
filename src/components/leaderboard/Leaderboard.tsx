"use client";

import { Suspense } from "react";
import { trpc } from "@/trpc";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardSkeleton } from "./LeaderboardSkeleton";

function LeaderboardContent() {
  const { data: leaderboardData } = trpc.leaderboard.getAll.useQuery({
    limit: 20,
  });
  const { data: metrics } = trpc.metrics.getRoastStats.useQuery({
    status: "completed",
  });

  const total = metrics?.totalRoasts ?? 0;
  const avgScore = metrics?.avgScore ?? 0;

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-center py-10 text-[14px] text-text-tertiary font-mono">
          No roasts yet. Be the first!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {leaderboardData.map((item) => (
        <LeaderboardRow
          key={item.id}
          id={item.id}
          rank={item.rank}
          score={item.score}
          code={item.code}
          codeHtml={item.codeHtml}
          language={item.language}
          createdAt={item.createdAt}
        />
      ))}
    </div>
  );
}

export function Leaderboard() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  );
}
