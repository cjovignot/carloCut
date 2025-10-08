import { JwtPayload } from "jsonwebtoken";

import { IUser } from "./user.js";
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
}
