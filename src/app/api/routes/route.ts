import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/db";
import { resolveCityCoords } from "@/lib/matching";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json([
    {
      id: 1,
      transporter_id: session.id,
      truck_id: 1,
      from_city: "Mumbai",
      to_city: "Pune",
      from_lat: 19.076,
      from_lng: 72.8777,
      to_lat: 18.5204,
      to_lng: 73.8567,
      distance_km: 148,
      capacity_available: 3500,
      departure_time: new Date(Date.now() + 86400000).toISOString(),
      status: "open",
      created_at: new Date().toISOString(),
      vehicle_number: "MH12AB1234",
      vehicle_type: "Container Truck",
    },
  ]);
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    truck_id,
    from_city,
    to_city,
    distance_km,
    capacity_available,
    departure_time,
  } = body;

  if (!truck_id || !from_city || !to_city || !distance_km || !capacity_available || !departure_time) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const fromCoords = resolveCityCoords(from_city);
  const toCoords = resolveCityCoords(to_city);

  const route = {
    id: Date.now(),
    transporter_id: session.id,
    truck_id: Number(truck_id),
    from_city,
    to_city,
    from_lat: fromCoords.lat,
    from_lng: fromCoords.lng,
    to_lat: toCoords.lat,
    to_lng: toCoords.lng,
    distance_km: Number(distance_km),
    capacity_available: Number(capacity_available),
    departure_time,
    status: "open",
    created_at: new Date().toISOString(),
  };

  await logActivity(session.id, "route_create", `Route ${from_city} to ${to_city} created`);

  return NextResponse.json({
    route,
    matches: [],
  }, { status: 201 });
}
