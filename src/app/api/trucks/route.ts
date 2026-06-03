import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json([
    {
      id: 1,
      transporter_id: session.id,
      vehicle_number: "MH12AB1234",
      capacity: 5000,
      vehicle_type: "Container Truck",
      driver_name: "Rahul Sharma",
      driver_phone: "9876543210",
      status: "available",
    },
    {
      id: 2,
      transporter_id: session.id,
      vehicle_number: "GJ01CD5678",
      capacity: 7500,
      vehicle_type: "Open Body Truck",
      driver_name: "Amit Patel",
      driver_phone: "9876543211",
      status: "on_trip",
    },
  ]);
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "transporter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { vehicle_number, capacity, vehicle_type, driver_name, driver_phone } = body;

  if (!vehicle_number || !capacity || !vehicle_type || !driver_name || !driver_phone) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const truck = {
    id: Date.now(),
    transporter_id: session.id,
    vehicle_number,
    capacity: Number(capacity),
    vehicle_type,
    driver_name,
    driver_phone,
    status: "available",
  };

  await logActivity(session.id, "truck_create", `Truck ${vehicle_number} added`);

  return NextResponse.json(truck, { status: 201 });
}
