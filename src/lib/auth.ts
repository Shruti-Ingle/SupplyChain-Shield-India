import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { SessionUser, UserRole } from "./types";
import { verifyToken, COOKIE_NAME } from "./auth-edge";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "scsi-dev-secret-key-change-in-production"
);

export { COOKIE_NAME };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case "transporter":
      return "/transporter/dashboard";
    case "business":
      return "/business/dashboard";
    case "admin":
      return "/admin/dashboard";
  }
}

export function requireRole(user: SessionUser | null, roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}
