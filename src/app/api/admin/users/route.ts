import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = readStore();
  const users = store.users || [];

  return NextResponse.json({
    transporters: users.filter((u: any) => u.role === "transporter"),
    businesses: users.filter((u: any) => u.role === "business"),
    admins: users.filter((u: any) => u.role === "admin"),
    users,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const store = readStore();

  const user = store.users.find((u: any) => Number(u.id) === Number(body.user_id));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.verification_status = body.status || body.verification_status || "approved";

  writeStore(store);

  return NextResponse.json({ success: true, user });
}
