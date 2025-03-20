import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../error/apiError";
import authService from "../services/authService";
import prisma from "../config/prisma";

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

export const adminCheck = async (
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
    const decoded = authService.verifyAccessToken(token);

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      throw new UnauthorizedError("Access denied. Admin privileges required.");
    }

    // Add user info to request for later use
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
