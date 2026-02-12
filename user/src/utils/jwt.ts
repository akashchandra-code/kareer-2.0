import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";
import {env} from "../config/env";

interface TokenPayload {
  userId: string;
  role: "user" | "company";
  provider: "local" | "google";
}

export const generateToken = (
  payload: TokenPayload,
  expiresIn: SignOptions["expiresIn"] = "1d"
): string  => {
  return sign(payload, env.JWT_SECRET, { expiresIn });
};

export const verifyToken = (
  token: string
): JwtPayload | TokenPayload => {
  return verify(token, env.JWT_SECRET) as JwtPayload | TokenPayload;
};

