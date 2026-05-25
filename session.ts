import {
  RequestCookie,
  ResponseCookie,
} from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { verifyAuthToken } from "./auth";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hustle_session")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return null;
  }

  return payload;
}

export function getAuthUserFromToken(token: string) {
  return verifyAuthToken(token);
}
