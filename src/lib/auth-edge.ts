import { jwtVerify } from "jose";
import type { SessionUser } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "scsi-dev-secret-key-change-in-production"
);

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "scsi_session";
