import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, logActivity } from "@/lib/db";
import { resolveCityCoords, findMatchesForShipment } from "@/lib/matching";
import type { Route, Shipment } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "business") {
    const shipments = getDb()
      .prepare("SELECT * FROM shipments WHERE business_id = ? ORDER BY created_at DESC")
      .all(session.id) as Shipment[];
    return NextResponse.json(shipments);
  }

  if (session.role === "admin") {
    const shipments = getDb()
      .prepare("SELECT s.*, u.company_name FROM shipments s JOIN users u ON s.business_id = u.id ORDER BY s.created_at DESC")
      .all();
    return NextResponse.json(shipments);
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "business") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { from_city, to_city, cargo_type, weight, volume, pickup_date, deadline } = body;

  const coords = resolveCityCoords(from_city, to_city);
  if (!coords) {
    return NextResponse.json({ error: "Invalid city. Select from suggestions." }, { status: 400 });
  }

  const result = getDb()
    .prepare(
      `INSERT INTO shipments (business_id, from_city, to_city, from_lat, from_lng, to_lat, to_lng, distance_km, cargo_type, weight, volume, pickup_date, deadline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      session.id,
      coords.from.name,
      coords.to.name,
      coords.from.lat,
      coords.from.lng,
      coords.to.lat,
      coords.to.lng,
      coords.distance,
      cargo_type,
      weight,
      volume || null,
      pickup_date,
      deadline
    );

  const shipmentId = result.lastInsertRowid as number;
  const shipment = getDb().prepare("SELECT * FROM shipments WHERE id = ?").get(shipmentId) as Shipment;

  const routes = getDb()
    .prepare("SELECT * FROM routes WHERE status = 'open'")
    .all() as Route[];

  const matches = findMatchesForShipment(shipment, routes);
  for (const m of matches) {
    getDb()
      .prepare(
        `INSERT OR IGNORE INTO matches (route_id, shipment_id, match_score, estimated_revenue, estimated_cost, fuel_saved, co2_saved)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        m.route.id,
        shipmentId,
        m.match_score,
        m.estimated_revenue,
        m.estimated_cost,
        m.fuel_saved,
        m.co2_saved
      );
  }

  logActivity(session.id, "post_shipment", `Posted shipment ${coords.from.name} → ${coords.to.name}`);
  return NextResponse.json({ id: shipmentId, matches_found: matches.length });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "business") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, status } = await req.json();
  getDb()
    .prepare("UPDATE shipments SET status=? WHERE id=? AND business_id=? AND status='open'")
    .run(status, id, session.id);
  return NextResponse.json({ success: true });
}
