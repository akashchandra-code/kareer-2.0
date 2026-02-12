import { Request, Response, NextFunction } from "express";
import companyModel from "../models/company.model";
import { verifyToken } from "../utils/jwt";

interface JwtPayload {
  companyId: string;
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

    const user = await companyModel
      .findById(decoded.companyId)
      .select("-password");
     console.log(user)
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; 
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
