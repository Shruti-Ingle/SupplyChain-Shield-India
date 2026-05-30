import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, logActivity } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const transporters = getDb()
    .prepare("SELECT id, email, company_name, gst, phone, verification_status, green_score, created_at FROM users WHERE role='transporter' ORDER BY created_at DESC")
    .all();
  const businesses = getDb()
    .prepare("SELECT id, email, company_name, contact_person, phone, verification_status, green_score, created_at FROM users WHERE role='business' ORDER BY created_at DESC")
    .all();

  return NextResponse.json({ transporters, businesses });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user_id, status } = await req.json();
  getDb().prepare("UPDATE users SET verification_status=? WHERE id=?").run(status, user_id);
  logActivity(session.id, "verify_user", `User #${user_id} ${status}`);
  return NextResponse.json({ success: true });
}
