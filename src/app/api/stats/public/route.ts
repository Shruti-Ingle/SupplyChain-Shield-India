import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    id: 1,
    trips_matched: 1247,
    empty_trips_avoided: 892,
    fuel_saved: 45600,
    co2_reduced: 122208,
  });
}
