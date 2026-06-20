import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readStore } from "@/lib/store";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = readStore();

  return NextResponse.json(store);
}
