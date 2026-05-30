import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, logActivity } from "@/lib/db";
import { resolveCityCoords } from "@/lib/matching";
import { findMatchesForRoute } from "@/lib/matching";
import type { Route, Shipment, Match } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const routes = getDb()
    .prepare("SELECT * FROM routes WHERE transporter_id = ? ORDER BY created_at DESC")
    .all(session.id) as Route[];
  return NextResponse.json(routes);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { from_city, to_city, capacity_available, departure_time, truck_id } = body;

  const coords = resolveCityCoords(from_city, to_city);
  if (!coords) {
    return NextResponse.json({ error: "Invalid city. Select from suggestions." }, { status: 400 });
  }

  const result = getDb()
    .prepare(
      `INSERT INTO routes (transporter_id, truck_id, from_city, to_city, from_lat, from_lng, to_lat, to_lng, distance_km, capacity_available, departure_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      session.id,
      truck_id,
      coords.from.name,
      coords.to.name,
      coords.from.lat,
      coords.from.lng,
      coords.to.lat,
      coords.to.lng,
      coords.distance,
      capacity_available,
      departure_time
    );

  const routeId = result.lastInsertRowid as number;
  const route = getDb().prepare("SELECT * FROM routes WHERE id = ?").get(routeId) as Route;

  const shipments = getDb()
    .prepare("SELECT * FROM shipments WHERE status = 'open'")
    .all() as Shipment[];

  const matches = findMatchesForRoute(route, shipments);
  for (const m of matches) {
    getDb()
      .prepare(
        `INSERT OR IGNORE INTO matches (route_id, shipment_id, match_score, estimated_revenue, estimated_cost, fuel_saved, co2_saved)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        routeId,
        m.shipment.id,
        m.match_score,
        m.estimated_revenue,
        m.estimated_cost,
        m.fuel_saved,
        m.co2_saved
      );
  }

  logActivity(session.id, "post_route", `Posted route ${coords.from.name} → ${coords.to.name}`);
  return NextResponse.json({ id: routeId, matches_found: matches.length });
}
