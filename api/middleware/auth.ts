import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload extends DefaultJwtPayload {
  userId: string;
}

// Middleware pour routes protégées
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });

    req.user = user;
    next();
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Invalid token.");
    res.status(401).json({ message: error.message });
  }
};

// Middleware pour vérifier les rôles
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "User not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Insufficient permissions" });
    next();
  };
};
