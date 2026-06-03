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

  const trips = [
    {
      id: 1,
      match_id: 1,
      route_id: 1,
      shipment_id: 1,
      transporter_id: 1,
      business_id: 1,
      status: status || "in_transit",
      current_lat: 19.076,
      current_lng: 72.8777,
      eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      distance_remaining: 142,
      fuel_saved: 18.5,
      co2_saved: 49.6,
      revenue: 24000,
      cost: 16000,
      created_at: new Date().toISOString(),
      completed_at: null,
      from_city: "Mumbai",
      to_city: "Pune",
      cargo_type: "FMCG Goods",
      vehicle_number: "MH12AB1234",
      company_name: "Green Logistics",
    },
  ];

  return NextResponse.json(trips);
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
      { error: "Trip id and status required" },
      { status: 400 }
    );
  }

  if (status === "delivered") {
    await updatePlatformStats(18.5, 49.6);
  }

  await logActivity(session.id, "trip_update", `Trip ${id} updated to ${status}`);

  return NextResponse.json({
    success: true,
    id,
    status,
  });
}
