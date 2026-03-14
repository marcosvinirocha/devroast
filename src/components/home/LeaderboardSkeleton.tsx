function LeaderboardSkeletonRow() {
  return (
    <div className="flex items-center gap-3 md:gap-6 px-4 md:px-5 py-3 md:py-4 border-b border-border-primary animate-pulse">
      <div className="w-8 md:w-10">
        <div className="h-3 md:h-4 bg-bg-surface rounded w-6" />
      </div>
      <div className="w-12 md:w-[70px]">
        <div className="h-3 md:h-4 bg-bg-surface rounded w-8" />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="h-3 bg-bg-surface rounded w-full" />
        <div className="h-3 bg-bg-surface rounded w-3/4" />
      </div>
      <div className="hidden md:block md:w-[100px]">
        <div className="h-3 bg-bg-surface rounded w-12" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="border border-border-primary overflow-x-auto">
      <div className="flex items-center px-4 md:px-5 py-3 bg-bg-surface border-b border-border-primary min-w-[500px]">
        <div className="w-8 md:w-10 text-[12px] font-mono font-medium text-text-tertiary">
          #
        </div>
        <div className="w-12 md:w-[70px] text-[12px] font-mono font-medium text-text-tertiary">
          score
        </div>
        <div className="flex-1 text-[12px] font-mono font-medium text-text-tertiary">
          code
        </div>
        <div className="hidden md:block md:w-[100px] text-[12px] font-mono font-medium text-text-tertiary">
          lang
        </div>
      </div>
      <LeaderboardSkeletonRow />
      <LeaderboardSkeletonRow />
      <LeaderboardSkeletonRow />
    </div>
  );
}
