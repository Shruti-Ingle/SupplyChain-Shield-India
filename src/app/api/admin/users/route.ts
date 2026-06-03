import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/db";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    transporters: [
      {
        id: 2,
        email: "transporter@test.com",
        company_name: "Green Logistics",
        verification_status: "pending",
      }
    ],
    businesses: [
      {
        id: 3,
        email: "business@test.com",
        company_name: "FreshFarm Traders",
        verification_status: "approved",
      }
    ]
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { user_id, status } = body;

  await logActivity(
    session.id,
    "admin_user_update",
    `User ${user_id} marked as ${status}`
  );

  return NextResponse.json({
    success: true,
    user_id,
    status,
  });
}
