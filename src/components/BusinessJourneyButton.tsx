"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BusinessJourneyButton() {
  const pathname = usePathname();

  if (!pathname.startsWith("/business")) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-[9999] flex gap-2">
      <Link
        href="/business/select-journey"
        className="rounded-full bg-green-600 px-4 py-2 text-white"
      >
        Select Journey
      </Link>

      <Link
        href="/business/review"
        className="rounded-full bg-sage-800 px-4 py-2 text-white"
      >
        Review
      </Link>
    </div>
  );
}
