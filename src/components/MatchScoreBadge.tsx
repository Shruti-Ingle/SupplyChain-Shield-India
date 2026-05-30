"use client";

import { getScoreColor } from "@/lib/matching";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function MatchScoreBadge({ score, size = "md" }: MatchScoreBadgeProps) {
  const sizeClass =
    size === "lg" ? "text-lg px-4 py-2" : size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`inline-flex items-center font-bold rounded-full ${getScoreColor(score)} ${sizeClass}`}>
      {score}% Match
    </span>
  );
}
