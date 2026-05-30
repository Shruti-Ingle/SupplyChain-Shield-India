import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, logActivity } from "@/lib/db";
import type { Truck } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const trucks = getDb()
    .prepare("SELECT * FROM trucks WHERE transporter_id = ? ORDER BY id DESC")
    .all(session.id) as Truck[];
  return NextResponse.json(trucks);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { vehicle_number, capacity, vehicle_type, driver_name, driver_phone } = body;
  const result = getDb()
    .prepare(
      `INSERT INTO trucks (transporter_id, vehicle_number, capacity, vehicle_type, driver_name, driver_phone)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(session.id, vehicle_number, capacity, vehicle_type, driver_name, driver_phone);
  logActivity(session.id, "add_truck", `Added truck ${vehicle_number}`);
  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, vehicle_number, capacity, vehicle_type, driver_name, driver_phone, status } = body;
  getDb()
    .prepare(
      `UPDATE trucks SET vehicle_number=?, capacity=?, vehicle_type=?, driver_name=?, driver_phone=?, status=?
       WHERE id=? AND transporter_id=?`
    )
    .run(vehicle_number, capacity, vehicle_type, driver_name, driver_phone, status || "available", id, session.id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  getDb().prepare("DELETE FROM trucks WHERE id=? AND transporter_id=?").run(id, session.id);
  return NextResponse.json({ success: true });
}
