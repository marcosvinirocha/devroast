"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
}

function AnimatedNumber({ value, decimals = 0 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, value);
      setDisplayValue(Number(current.toFixed(decimals)));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, decimals]);

  return (
    <span>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

interface MetricsContentProps {
  totalRoasts: number;
  avgScore: number;
}

function MetricsContent({ totalRoasts, avgScore }: MetricsContentProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-6 text-[11px] md:text-[12px] font-mono text-text-tertiary">
      <span>
        <AnimatedNumber value={totalRoasts} /> codes roasted
      </span>
      <span>·</span>
      <span>
        avg score: <AnimatedNumber value={avgScore} decimals={1} /> /10
      </span>
    </div>
  );
}

export { MetricsContent, AnimatedNumber };
