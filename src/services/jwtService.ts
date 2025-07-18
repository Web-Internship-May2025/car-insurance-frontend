import { jwtDecode } from "jwt-decode";
import { type UserRoleType } from "../types/UserServiceTypes";

export interface JWTPayload {
  sub: string;
  iat: string;
  exp: number;
  username: string;
  role?: UserRoleType;
}

export function getDecodedToken(token?: string): JWTPayload | null {
  try {
    const t = token ?? localStorage.getItem("jwtToken");
    if (!t) return null;
    return jwtDecode<JWTPayload>(t);
  } catch (err) {
    console.error("JWT decode error", err);
    return null;
  }
}

export function getUserRoleType(): UserRoleType | undefined {
  const d = getDecodedToken();
  return d?.role;
}

export function getUserId(): string | undefined {
  const d = getDecodedToken();
  return d?.sub;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;
    const expiryTime = decoded.exp * 1000;
    return Date.now() > expiryTime;
  } catch {
    return true;
  }
}
