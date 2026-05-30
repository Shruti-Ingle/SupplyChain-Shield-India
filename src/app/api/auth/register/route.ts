import { NextRequest, NextResponse } from "next/server";
import { getDb, logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role, company_name, gst, phone, contact_person } = body;

    if (!email || !password || !role || !company_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["transporter", "business"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existing = getDb()
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const password_hash = await hashPassword(password);
    const result = getDb()
      .prepare(
        `INSERT INTO users (email, password_hash, role, company_name, gst, phone, contact_person, verification_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'approved')`
      )
      .run(email, password_hash, role, company_name, gst || null, phone || null, contact_person || null);

    logActivity(result.lastInsertRowid as number, "register", `${company_name} registered as ${role}`);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
