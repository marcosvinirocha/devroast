import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { Metrics } from "./Metrics";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-5xl mx-auto px-5 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[32px] font-bold text-accent-green">
              {">"}
            </span>
            <h1 className="text-[28px] font-bold text-text-primary font-mono">
              shame_leaderboard
            </h1>
          </div>
          <p className="text-[14px] text-text-secondary font-mono mb-4">
            {"// the most roasted code on the internet"}
          </p>
          <Metrics />
        </div>

        <Leaderboard />
      </div>
    </div>
  );
}
