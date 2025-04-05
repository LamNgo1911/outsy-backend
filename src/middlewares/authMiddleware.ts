import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../error/apiError";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_ACCESS_SECRET!;
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
    };

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token"));
  }
};

export default authMiddleware;
