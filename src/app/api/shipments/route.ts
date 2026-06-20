import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const store = readStore();
  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine");

  let shipments = store.shipments || [];

  if (session.role === "business") {
    shipments = shipments.filter((s: any) => Number(s.business_id) === Number(session.id));
  }

  if (session.role === "transporter") {
    if (mine === "1") {
      shipments = shipments.filter((s: any) => Number(s.transporter_id) === Number(session.id));
    } else {
      shipments = shipments.filter((s: any) => s.status === "open");
    }
  }

  return NextResponse.json(shipments);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "business") {
    return NextResponse.json({ error: "Only business can create shipment" }, { status: 401 });
  }

  const body = await req.json();
  const store = readStore();

  const shipment = {
    id: Date.now(),
    business_id: session.id,
    business_company: session.company_name || "Business",
    from_city: body.from_city || body.pickup_location || "Mumbai",
    to_city: body.to_city || body.destination || "Pune",
    cargo_type: body.cargo_type || "General Cargo",
    weight: Number(body.weight || 1),
    volume: body.volume ? Number(body.volume) : null,
    pickup_date: body.pickup_date || new Date().toISOString().slice(0, 10),
    deadline: body.deadline || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    status: "open",
    created_at: new Date().toISOString(),
  };

  store.shipments.unshift(shipment);
  writeStore(store);

  return NextResponse.json({ success: true, shipment }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Only transporter can accept shipment" }, { status: 401 });
  }

  const body = await req.json();
  const store = readStore();

  const shipment = store.shipments.find((s: any) => Number(s.id) === Number(body.id));
  if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });

  shipment.status = "accepted";
  shipment.transporter_id = session.id;
  shipment.transporter_company = session.company_name || "Transporter";
  shipment.accepted_at = new Date().toISOString();

  store.bookings.unshift({
    id: Date.now(),
    shipment_id: shipment.id,
    business_id: shipment.business_id,
    business_company: shipment.business_company,
    transporter_id: session.id,
    transporter_company: shipment.transporter_company,
    from_city: shipment.from_city,
    to_city: shipment.to_city,
    cargo_type: shipment.cargo_type,
    weight: shipment.weight,
    status: "accepted",
    created_at: new Date().toISOString(),
  });

  store.stats.trips_matched += 1;
  store.stats.empty_trips_avoided += 1;
  store.stats.fuel_saved += 18.5;
  store.stats.co2_reduced += 49.6;

  writeStore(store);

  return NextResponse.json({ success: true, shipment, stats: store.stats });
}
