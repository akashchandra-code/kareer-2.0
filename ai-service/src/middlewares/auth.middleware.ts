import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: string;
  name: string;
  isVerified: boolean;
}

const createAuthMiddleware = (roles: string[] = ["user"]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("Auth middleware invoked");
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];
      console.log("Token from middleware:", token);
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as CustomJwtPayload;

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient permissions",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
      });
    }
  };
};
const emailIsVerified = (req: Request, res: Response, next: NextFunction) => {
  console.log('user isVerified:', req.user?.isVerified);
   if (!req.user?.isVerified) {
      return res.status(403).json({
        message: "Forbidden: Email not verified",
      });
   }
   next();
}
export { emailIsVerified };
export default createAuthMiddleware;
