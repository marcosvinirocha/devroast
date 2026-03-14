import Link from "next/link";
import { Suspense } from "react";
import { trpc } from "@/trpc";
import { LeaderboardRow } from "./LeaderboardRow";
import { LeaderboardSkeleton } from "./LeaderboardSkeleton";

function LeaderboardFetcher() {
  const { data: leaderboardData } = trpc.leaderboard.getShameTop3.useQuery();
  const { data: metrics } = trpc.metrics.getRoastStats.useQuery({
    status: "completed",
  });

  const total = metrics?.totalRoasts ?? 0;

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <>
        <div className="border border-border-primary overflow-x-auto">
          <div className="flex items-center px-4 md:px-5 py-3 bg-bg-surface border-b border-border-primary min-w-[500px]">
            <div className="w-10 md:w-[50px] text-[12px] font-mono font-medium text-text-tertiary">
              #
            </div>
            <div className="w-14 md:w-[70px] text-[12px] font-mono font-medium text-text-tertiary">
              score
            </div>
            <div className="flex-1 text-[12px] font-mono font-medium text-text-tertiary">
              code
            </div>
            <div className="w-20 md:w-[100px] text-[12px] font-mono font-medium text-text-tertiary">
              lang
            </div>
          </div>
          <div className="flex items-center justify-center py-8 text-[12px] font-mono text-text-tertiary">
            No roasts yet. Be the first!
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="border border-border-primary overflow-x-auto">
        <div className="flex items-center px-4 md:px-5 py-3 bg-bg-surface border-b border-border-primary min-w-[500px]">
          <div className="w-10 md:w-[50px] text-[12px] font-mono font-medium text-text-tertiary">
            #
          </div>
          <div className="w-14 md:w-[70px] text-[12px] font-mono font-medium text-text-tertiary">
            score
          </div>
          <div className="flex-1 text-[12px] font-mono font-medium text-text-tertiary">
            code
          </div>
          <div className="w-20 md:w-[100px] text-[12px] font-mono font-medium text-text-tertiary">
            lang
          </div>
        </div>
        {leaderboardData.map((item, idx) => (
          <LeaderboardRow
            key={item.id}
            id={item.id}
            rank={idx + 1}
            code={item.code}
            language={item.language}
            score={item.score ?? 0}
          />
        ))}
      </div>
      <div className="flex justify-center py-4 text-[12px] font-mono text-text-tertiary">
        showing top 3 of {total.toLocaleString()} ·{" "}
        <Link
          href="/leaderboard"
          className="hover:text-text-primary transition-colors"
        >
          view full leaderboard &gt;&gt;
        </Link>
      </div>
    </>
  );
}

export function Leaderboard() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardFetcher />
    </Suspense>
  );
}
