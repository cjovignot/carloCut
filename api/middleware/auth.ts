import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User.js";

// Étendre Request pour y ajouter 'user'
export interface AuthRequest extends Request {
  user?: IUser;
}

// Payload JWT typé
interface JwtPayload extends DefaultJwtPayload {
  userId: string;
}

// ---------------------------
// Authentification
// ---------------------------
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || "fallback-secret";

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Invalid token.");
    res.status(400).json({ message: error.message });
  }
};

// ---------------------------
// Autorisation
// ---------------------------
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Access denied. User not authenticated." });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};
