import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import { verifyToken } from "../utlis/jwt";

interface JwtPayload {
  userId: string;
  role: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = verifyToken(token) as JwtPayload;

    const user = await userModel
      .findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; 
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
