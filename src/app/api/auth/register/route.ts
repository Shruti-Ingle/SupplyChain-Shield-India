import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logActivity } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = String(body.role || "");
    const company_name = String(body.company_name || "").trim();
    const gst = body.gst || null;
    const phone = body.phone || null;
    const contact_person = body.contact_person || null;

    if (!email || !password || !role || !company_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["transporter", "business"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const password_hash = await hashPassword(password);

    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        email,
        password_hash,
        role,
        company_name,
        gst,
        phone,
        contact_person,
        verification_status: "approved",
        green_score: 50,
      })
      .select("id, email, role, company_name, verification_status, green_score")
      .single();

    if (error || !newUser) {
      console.error("Register insert error:", error?.message);
      return NextResponse.json(
        { error: error?.message || "Registration failed" },
        { status: 500 }
      );
    }

    await logActivity(
      newUser.id,
      "register",
      `${company_name} registered as ${role}`
    );

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: newUser,
      id: newUser.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
