import Link from "next/link";
import { Suspense } from "react";
import { trpc } from "@/trpc";
import { LeaderboardSkeleton } from "./LeaderboardSkeleton";

function LeaderboardFetcher() {
  const { data: leaderboardData } = trpc.leaderboard.getShameTop3.useQuery();

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
          <Link key={item.id} href={`/roast/${item.id}`} className="block">
            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-5 py-4 border-b border-border-primary hover:bg-bg-surface transition-colors cursor-pointer">
              <div className="w-10 md:w-[50px] font-mono text-[12px] text-text-tertiary">
                {idx + 1}
              </div>
              <div className="w-14 md:w-[70px] font-mono text-[12px] font-bold text-accent-red">
                {item.score ?? 0}
              </div>
              <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                {item.code
                  .split("\n")
                  .slice(0, 2)
                  .map((line) => (
                    <span
                      key={line.slice(0, 15)}
                      className="font-mono text-[12px] text-text-primary truncate"
                    >
                      {line}
                    </span>
                  ))}
              </div>
              <div className="w-20 md:w-[100px] font-mono text-[12px] text-text-secondary">
                {item.language}
              </div>
            </div>
          </Link>
        ))}
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
