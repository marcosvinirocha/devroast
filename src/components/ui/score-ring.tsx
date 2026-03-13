import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const SCORE_RING_SIZE = 180;
const STROKE_WIDTH = 4;

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  maxScore?: number;
}

export const ScoreRingRoot = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, maxScore = 10, children, ...props }, ref) => {
    const percentage = (score / maxScore) * 100;
    const arcDegrees = (percentage / 100) * 360;

    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          className,
        )}
        ref={ref}
        style={{ width: SCORE_RING_SIZE, height: SCORE_RING_SIZE }}
        {...props}
      >
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "50%",
            background: `conic-gradient(
              from 225deg,
              var(--accent-green) 0deg,
              var(--accent-amber) calc(${arcDegrees}deg * 0.35),
              transparent calc(${arcDegrees}deg * 0.36),
              transparent ${arcDegrees}deg
            )`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "50%",
            background: `radial-gradient(
              transparent ${SCORE_RING_SIZE / 2 - STROKE_WIDTH - 2}px,
              black ${SCORE_RING_SIZE / 2 - STROKE_WIDTH}px
            )`,
          }}
        />
        <div className="absolute inset-0 rounded-full border-[4px] border-border-primary" />
        {children}
      </div>
    );
  },
);
ScoreRingRoot.displayName = "ScoreRingRoot";

export interface ScoreRingContentProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  maxScore?: number;
}

export const ScoreRingContent = forwardRef<
  HTMLDivElement,
  ScoreRingContentProps
>(({ className, score, maxScore = 10, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center gap-0.5 z-10", className)}
      {...props}
    >
      <span className="font-mono text-5xl font-bold leading-none text-text-primary">
        {score}
      </span>
      <span className="font-mono text-base leading-none text-text-tertiary">
        /{maxScore}
      </span>
    </div>
  );
});
ScoreRingContent.displayName = "ScoreRingContent";

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, maxScore = 10, ...props }, ref) => {
    return (
      <ScoreRingRoot
        ref={ref}
        className={className}
        score={score}
        maxScore={maxScore}
        {...props}
      >
        <ScoreRingContent score={score} maxScore={maxScore} />
      </ScoreRingRoot>
    );
  },
);
ScoreRing.displayName = "ScoreRing";
