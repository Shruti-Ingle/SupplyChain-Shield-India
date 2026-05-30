import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, updatePlatformStats, logActivity } from "@/lib/db";
import type { Trip } from "@/lib/types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const trip = getDb()
      .prepare(
        `SELECT t.*, s.from_city, s.to_city, s.from_lat, s.from_lng, s.to_lat, s.to_lng, s.cargo_type, s.weight,
                ut.company_name as transporter_name, ub.company_name as business_name, r.departure_time
         FROM trips t
         JOIN shipments s ON t.shipment_id = s.id
         JOIN users ut ON t.transporter_id = ut.id
         JOIN users ub ON t.business_id = ub.id
         JOIN routes r ON t.route_id = r.id
         WHERE t.id = ?`
      )
      .get(id);

    if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const canView =
      session.role === "admin" ||
      (session.role === "transporter" && (trip as { transporter_id: number }).transporter_id === session.id) ||
      (session.role === "business" && (trip as { business_id: number }).business_id === session.id);

    if (!canView) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    return NextResponse.json(trip);
  }

  if (session.role === "transporter") {
    const trips = getDb()
      .prepare(
        `SELECT t.*, s.from_city, s.to_city, s.cargo_type, s.weight, u.company_name as business_name
         FROM trips t JOIN shipments s ON t.shipment_id = s.id JOIN users u ON t.business_id = u.id
         WHERE t.transporter_id = ? ORDER BY t.created_at DESC`
      )
      .all(session.id);
    return NextResponse.json(trips);
  }

  if (session.role === "business") {
    const trips = getDb()
      .prepare(
        `SELECT t.*, s.from_city, s.to_city, s.cargo_type, s.weight, u.company_name as transporter_name
         FROM trips t JOIN shipments s ON t.shipment_id = s.id JOIN users u ON t.transporter_id = u.id
         WHERE t.business_id = ? ORDER BY t.created_at DESC`
      )
      .all(session.id);
    return NextResponse.json(trips);
  }

  if (session.role === "admin") {
    const trips = getDb()
      .prepare(
        `SELECT t.*, s.from_city, s.to_city, ut.company_name as transporter_name, ub.company_name as business_name
         FROM trips t
         JOIN shipments s ON t.shipment_id = s.id
         JOIN users ut ON t.transporter_id = ut.id
         JOIN users ub ON t.business_id = ub.id
         WHERE t.status != 'delivered' AND t.status != 'cancelled'
         ORDER BY t.created_at DESC`
      )
      .all();
    return NextResponse.json(trips);
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await req.json();
  const trip = getDb().prepare("SELECT * FROM trips WHERE id = ?").get(id) as Trip | undefined;
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canUpdate =
    session.role === "admin" ||
    session.role === "transporter" && trip.transporter_id === session.id;

  if (!canUpdate) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const updates: Partial<Trip> = { status };
  if (status === "in_transit") {
    updates.current_lat = (trip.current_lat + (trip as unknown as { to_lat: number }).to_lat) / 2;
  }
  if (status === "delivered") {
    updates.completed_at = new Date().toISOString();
    updates.distance_remaining = 0;
    getDb().prepare("UPDATE routes SET status='completed' WHERE id=?").run(trip.route_id);
    getDb().prepare("UPDATE shipments SET status='delivered' WHERE id=?").run(trip.shipment_id);
    getDb().prepare("UPDATE trucks SET status='available' WHERE id = (SELECT truck_id FROM routes WHERE id=?)").run(trip.route_id);
    updatePlatformStats(trip.fuel_saved, trip.co2_saved);
    logActivity(session.id, "trip_delivered", `Trip #${id} delivered`);
  }

  getDb().prepare("UPDATE trips SET status=?, completed_at=COALESCE(?, completed_at), distance_remaining=COALESCE(?, distance_remaining) WHERE id=?")
    .run(status, updates.completed_at || null, updates.distance_remaining ?? null, id);

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const trip = getDb()
    .prepare(
      `SELECT t.*, s.from_lat, s.from_lng, s.to_lat, s.to_lng
       FROM trips t JOIN shipments s ON t.shipment_id = s.id WHERE t.id = ?`
    )
    .get(id) as Trip & { from_lat: number; from_lng: number; to_lat: number; to_lng: number } | undefined;

  if (!trip || trip.status === "delivered" || trip.status === "cancelled") {
    return NextResponse.json({ trip });
  }

  const progress = 1 - (trip.distance_remaining || 0) / ((trip.distance_remaining || 1) + 100);
  const t = Math.min(progress + 0.05, 1);
  const newLat = trip.from_lat + (trip.to_lat - trip.from_lat) * t;
  const newLng = trip.from_lng + (trip.to_lng - trip.from_lng) * t;
  const newDist = Math.max(0, (trip.distance_remaining || 0) - 10);

  let newStatus: Trip["status"] = trip.status;
  if (newDist <= 0) {
    newStatus = "delivered";
    getDb().prepare("UPDATE routes SET status='completed' WHERE id=?").run(trip.route_id);
    getDb().prepare("UPDATE shipments SET status='delivered' WHERE id=?").run(trip.shipment_id);
    updatePlatformStats(trip.fuel_saved, trip.co2_saved);
  } else if (newDist < (trip.distance_remaining || 0) * 0.7 && trip.status === "pending") {
    newStatus = "picked_up";
  } else if (newDist < (trip.distance_remaining || 0) * 0.3 && trip.status !== "in_transit") {
    newStatus = "in_transit";
  }

  getDb()
    .prepare("UPDATE trips SET current_lat=?, current_lng=?, distance_remaining=?, status=? WHERE id=?")
    .run(newLat, newLng, newDist, newStatus, id);

  const updated = getDb().prepare("SELECT * FROM trips WHERE id = ?").get(id);
  return NextResponse.json(updated);
}
