import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    trips_matched: 1247,
    empty_trips_avoided: 892,
    fuel_saved: 45600,
    co2_reduced: 122208,
    green_score: 78,
    role: session.role,
  });
}
