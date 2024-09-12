// src/@types/express.d.ts
import "express";
import { User } from "../services/users.service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// src/handlers/users.ts
