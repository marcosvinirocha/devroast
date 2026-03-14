function LeaderboardSkeletonRow() {
  return (
    <div className="border border-border-primary bg-bg-surface rounded-md overflow-hidden animate-pulse">
      <div className="h-12 flex items-center justify-between px-5 border-b border-border-primary">
        <div className="flex items-center gap-4">
          <div className="h-4 w-8 bg-bg-input rounded" />
          <div className="h-4 w-24 bg-bg-input rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-bg-input rounded" />
          <div className="h-4 w-10 bg-bg-input rounded" />
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full bg-bg-input rounded" />
          <div className="h-4 w-3/4 bg-bg-input rounded" />
          <div className="h-4 w-1/2 bg-bg-input rounded" />
        </div>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <LeaderboardSkeletonRow />
      <LeaderboardSkeletonRow />
      <LeaderboardSkeletonRow />
      <LeaderboardSkeletonRow />
      <LeaderboardSkeletonRow />
    </div>
  );
}
