import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logActivity, updatePlatformStats } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const matches = [
    {
      id: 1,
      route_id: 1,
      shipment_id: 1,
      match_score: 92,
      estimated_revenue: 24000,
      estimated_cost: 16000,
      fuel_saved: 18.5,
      co2_saved: 49.6,
      status: status || "proposed",
      created_at: new Date().toISOString(),
      from_city: "Mumbai",
      to_city: "Pune",
      cargo_type: "FMCG Goods",
      weight: 1200,
      vehicle_number: "MH12AB1234",
      company_name: "Green Logistics",
      departure_time: new Date(Date.now() + 86400000).toISOString(),
    },
  ];

  return NextResponse.json(matches);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json(
      { error: "Match id and status required" },
      { status: 400 }
    );
  }

  if (status === "accepted") {
    await updatePlatformStats(18.5, 49.6);
  }

  await logActivity(session.id, "match_update", `Match ${id} updated to ${status}`);

  return NextResponse.json({
    success: true,
    id,
    status,
  });
}
