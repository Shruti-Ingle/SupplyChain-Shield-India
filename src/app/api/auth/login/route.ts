import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword, createToken, COOKIE_NAME } from "@/lib/auth";
import type { User } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle<User>();

    if (error) {
      console.error("Login fetch error:", error.message);
      return NextResponse.json(
        { error: "Login failed" },
        { status: 500 }
      );
    }

   if (!user) {
  return NextResponse.json(
    { error: "User not found" },
    { status: 401 }
  );
}
    if (user.role !== "admin" && user.verification_status !== "approved") {
      return NextResponse.json(
        { error: "Account pending approval. Please wait for admin verification." },
        { status: 403 }
      );
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      verification_status: user.verification_status,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_name: user.company_name,
        verification_status: user.verification_status,
      },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}