import { NextRequest, NextResponse } from "next/server";
import { createToken, COOKIE_NAME } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const requestedRole = String(body.role || "").trim().toLowerCase();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  let role: "admin" | "business" | "transporter" = "business";

  if (requestedRole === "admin" || requestedRole === "business" || requestedRole === "transporter") {
    role = requestedRole as "admin" | "business" | "transporter";
  } else if (email.includes("admin") || email.includes("vedant") || email.includes("shruti")) {
    role = "admin";
  } else if (email.includes("transport")) {
    role = "transporter";
  }

  let company_name = "Business User";

  if (role === "admin") {
    company_name = email.includes("shruti") ? "Shruti Ingle" : "Vedant Pathak";
  }

  if (role === "transporter") {
    company_name = "Green Logistics";
  }

  if (role === "business") {
    company_name = "Business User";
  }

  const store = readStore();

  let user = store.users.find((u) => u.email === email && u.role === role);

  if (!user) {
    user = {
      id: Date.now(),
      email,
      role,
      company_name,
      verification_status: "approved",
      green_score: 80,
      created_at: new Date().toISOString(),
    };

    store.users.push(user);
  } else {
    user.role = role;
    user.company_name = company_name;
    user.verification_status = "approved";
  }

  writeStore(store);

  const token = await createToken({
    id: user.id,
    email: user.email,
    role: user.role,
    company_name: user.company_name,
    verification_status: user.verification_status,
  });

  const response = NextResponse.json({ user });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
