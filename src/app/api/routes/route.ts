import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = readStore();
  return NextResponse.json(store.journeys || []);
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Only transporter can create journey" }, { status: 401 });
  }

  const body = await req.json();
  const store = readStore();

  const journey = {
    id: Date.now(),
    transporter_id: session.id,
    transporter_company: session.company_name || "Transporter",
    from_city: body.from_city || body.start || "Mumbai",
    to_city: body.to_city || body.end || "Pune",
    capacity_available: Number(body.capacity_available || body.capacity || 1000),
    costing: Number(body.costing || body.cost || body.price || 10000),
    distance_km: Number(body.distance_km || 150),
    departure_time: body.departure_time || new Date().toISOString(),
    vehicle_number: body.vehicle_number || "MH12AB1234",
    vehicle_type: body.vehicle_type || "Truck",
    status: "open",
    created_at: new Date().toISOString(),
    fuel_saved: 18.5,
    co2_saved: 49.6,
  };

  store.journeys.unshift(journey);
  writeStore(store);

  return NextResponse.json({
    success: true,
    journey,
    route: journey,
    message: "Journey created successfully",
  }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const store = readStore();

  const journey = store.journeys.find((j: any) => Number(j.id) === Number(body.id));

  if (!journey) {
    return NextResponse.json({ error: "Journey not found" }, { status: 404 });
  }

  journey.status = body.status || "booked";
  journey.booked_by = session.id;
  journey.booked_by_company = session.company_name || "Business";

  store.bookings.unshift({
    id: Date.now(),
    journey_id: journey.id,
    business_id: session.id,
    business_company: session.company_name || "Business",
    transporter_id: journey.transporter_id,
    transporter_company: journey.transporter_company,
    from_city: journey.from_city,
    to_city: journey.to_city,
    costing: journey.costing,
    status: journey.status,
    created_at: new Date().toISOString(),
  });

  store.stats.trips_matched += 1;
  store.stats.empty_trips_avoided += 1;
  store.stats.fuel_saved += Number(journey.fuel_saved || 18.5);
  store.stats.co2_reduced += Number(journey.co2_saved || 49.6);

  writeStore(store);

  return NextResponse.json({
    success: true,
    journey,
    stats: store.stats,
  });
}
