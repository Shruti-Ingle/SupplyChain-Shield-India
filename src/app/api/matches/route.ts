import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, logActivity, updatePlatformStats } from "@/lib/db";
import type { Match, Route, Shipment } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const routeId = searchParams.get("route_id");

  if (session.role === "transporter") {
    let matches;
    if (routeId) {
      matches = getDb()
        .prepare(
          `SELECT m.*, s.from_city, s.to_city, s.weight, s.cargo_type, s.pickup_date, s.deadline,
                  u.company_name as business_name, r.from_city as route_from, r.to_city as route_to
           FROM matches m
           JOIN shipments s ON m.shipment_id = s.id
           JOIN users u ON s.business_id = u.id
           JOIN routes r ON m.route_id = r.id
           WHERE m.route_id = ? AND r.transporter_id = ? AND m.status = 'proposed' AND s.status = 'open'
           ORDER BY m.match_score DESC`
        )
        .all(routeId, session.id);
    } else {
      matches = getDb()
        .prepare(
          `SELECT m.*, s.from_city, s.to_city, s.weight, s.cargo_type, s.pickup_date, s.deadline,
                  u.company_name as business_name, r.from_city as route_from, r.to_city as route_to, r.id as route_id
           FROM matches m
           JOIN shipments s ON m.shipment_id = s.id
           JOIN users u ON s.business_id = u.id
           JOIN routes r ON m.route_id = r.id
           WHERE r.transporter_id = ? AND m.status = 'proposed' AND s.status = 'open'
           ORDER BY m.match_score DESC`
        )
        .all(session.id);
    }
    return NextResponse.json(matches);
  }

  if (session.role === "business") {
    const shipmentId = searchParams.get("shipment_id");
    let matches;
    if (shipmentId) {
      matches = getDb()
        .prepare(
          `SELECT m.*, r.from_city, r.to_city, r.capacity_available, r.departure_time,
                  u.company_name as transporter_name, t.vehicle_number, t.vehicle_type, t.capacity
           FROM matches m
           JOIN routes r ON m.route_id = r.id
           JOIN users u ON r.transporter_id = u.id
           JOIN trucks t ON r.truck_id = t.id
           WHERE m.shipment_id = ? AND m.status = 'proposed' AND r.status = 'open'
           ORDER BY m.match_score DESC`
        )
        .all(shipmentId);
    } else {
      matches = getDb()
        .prepare(
          `SELECT m.*, r.from_city, r.to_city, r.capacity_available, r.departure_time,
                  u.company_name as transporter_name, t.vehicle_number, t.vehicle_type, t.capacity,
                  s.from_city as ship_from, s.to_city as ship_to
           FROM matches m
           JOIN routes r ON m.route_id = r.id
           JOIN users u ON r.transporter_id = u.id
           JOIN trucks t ON r.truck_id = t.id
           JOIN shipments s ON m.shipment_id = s.id
           WHERE s.business_id = ? AND m.status = 'proposed' AND r.status = 'open'
           ORDER BY m.match_score DESC`
        )
        .all(session.id);
    }
    return NextResponse.json(matches);
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { match_id, action } = await req.json();
  const match = getDb().prepare("SELECT * FROM matches WHERE id = ?").get(match_id) as Match | undefined;
  if (!match || match.status !== "proposed") {
    return NextResponse.json({ error: "Match not found or already processed" }, { status: 404 });
  }

  const route = getDb().prepare("SELECT * FROM routes WHERE id = ?").get(match.route_id) as Route;
  const shipment = getDb().prepare("SELECT * FROM shipments WHERE id = ?").get(match.shipment_id) as Shipment;

  if (action === "accept" && session.role === "transporter") {
    if (route.transporter_id !== session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    getDb().prepare("UPDATE matches SET status='accepted' WHERE id=?").run(match_id);
    getDb().prepare("UPDATE matches SET status='rejected' WHERE route_id=? AND id!=? AND status='proposed'").run(route.id, match_id);
    getDb().prepare("UPDATE matches SET status='rejected' WHERE shipment_id=? AND id!=? AND status='proposed'").run(shipment.id, match_id);
    getDb().prepare("UPDATE routes SET status='matched' WHERE id=?").run(route.id);
    getDb().prepare("UPDATE shipments SET status='matched' WHERE id=?").run(shipment.id);
    getDb().prepare("UPDATE trucks SET status='on_trip' WHERE id=?").run(route.truck_id);

    const eta = new Date(Date.now() + route.distance_km * 60000).toISOString();
    const tripResult = getDb()
      .prepare(
        `INSERT INTO trips (match_id, route_id, shipment_id, transporter_id, business_id, status, current_lat, current_lng, eta, distance_remaining, fuel_saved, co2_saved, revenue, cost)
         VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        match_id,
        route.id,
        shipment.id,
        route.transporter_id,
        shipment.business_id,
        route.from_lat,
        route.from_lng,
        eta,
        route.distance_km,
        match.fuel_saved,
        match.co2_saved,
        match.estimated_revenue,
        match.estimated_cost
      );

    logActivity(session.id, "accept_match", `Accepted match for ${route.from_city} → ${route.to_city}`);
    return NextResponse.json({ trip_id: tripResult.lastInsertRowid });
  }

  if (action === "book" && session.role === "business") {
    if (shipment.business_id !== session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    getDb().prepare("UPDATE matches SET status='accepted' WHERE id=?").run(match_id);
    getDb().prepare("UPDATE matches SET status='rejected' WHERE shipment_id=? AND id!=? AND status='proposed'").run(shipment.id, match_id);
    getDb().prepare("UPDATE matches SET status='rejected' WHERE route_id=? AND id!=? AND status='proposed'").run(route.id, match_id);
    getDb().prepare("UPDATE routes SET status='matched' WHERE id=?").run(route.id);
    getDb().prepare("UPDATE shipments SET status='matched' WHERE id=?").run(shipment.id);
    getDb().prepare("UPDATE trucks SET status='on_trip' WHERE id=?").run(route.truck_id);

    const eta = new Date(Date.now() + route.distance_km * 60000).toISOString();
    const tripResult = getDb()
      .prepare(
        `INSERT INTO trips (match_id, route_id, shipment_id, transporter_id, business_id, status, current_lat, current_lng, eta, distance_remaining, fuel_saved, co2_saved, revenue, cost)
         VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        match_id,
        route.id,
        shipment.id,
        route.transporter_id,
        shipment.business_id,
        route.from_lat,
        route.from_lng,
        eta,
        route.distance_km,
        match.fuel_saved,
        match.co2_saved,
        match.estimated_revenue,
        match.estimated_cost
      );

    logActivity(session.id, "book_shipment", `Booked transporter for ${shipment.from_city} → ${shipment.to_city}`);
    return NextResponse.json({ trip_id: tripResult.lastInsertRowid });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
