import { sign, verify } from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string | undefined;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

export type AuthTokenPayload = {
  id: string;
  email: string;
  name: string;
};

export function createAuthToken(payload: AuthTokenPayload) {
  return sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET as string) as unknown;
    return decoded as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function createAuthCookie(token: string) {
  return serialize("hustle_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookie() {
  return serialize("hustle_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
