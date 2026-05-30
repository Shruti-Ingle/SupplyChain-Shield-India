import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const stats = getDb().prepare("SELECT * FROM platform_stats WHERE id=1").get() as {
    trips_matched: number;
    empty_trips_avoided: number;
    fuel_saved: number;
    co2_reduced: number;
  } | undefined;

  return NextResponse.json(
    stats || {
      trips_matched: 1247,
      empty_trips_avoided: 892,
      fuel_saved: 45600,
      co2_reduced: 122208,
    }
  );
}
