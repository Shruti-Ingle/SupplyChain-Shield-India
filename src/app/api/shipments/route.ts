import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let query = supabaseAdmin
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  if (session.role === "business") {
    query = query.eq("business_id", session.id);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Shipments fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "business") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const from_city = String(body.from_city || body.pickup_location || "").trim();
    const to_city = String(body.to_city || body.destination || "").trim();
    const cargo_type = String(body.cargo_type || "").trim();
    const weight = Number(body.weight || 0);
    const volume = body.volume ? Number(body.volume) : null;
    const pickup_date = String(body.pickup_date || "");
    const deadline = String(body.deadline || "");

    if (!from_city || !to_city || !cargo_type || !weight || !pickup_date || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const shipmentPayload = {
      business_id: session.id,
      from_city,
      to_city,
      from_lat: 12.9716,
      from_lng: 77.5946,
      to_lat: 28.6139,
      to_lng: 77.209,
      distance_km: Number(body.distance_km || 1740),
      cargo_type,
      weight,
      volume,
      pickup_date,
      deadline,
      status: "open",
    };

    const { data: shipment, error } = await supabaseAdmin
      .from("shipments")
      .insert(shipmentPayload)
      .select("*")
      .single();

    if (error) {
      console.error("Shipment insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logActivity(session.id, "shipment_create", `Shipment ${from_city} to ${to_city} created`);

    return NextResponse.json(
      {
        success: true,
        shipment,
        matches: [],
        message: "Shipment posted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Shipment create error:", error);
    return NextResponse.json({ error: "Shipment creation failed" }, { status: 500 });
  }
}
