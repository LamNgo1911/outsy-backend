import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../error/apiError";
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
    // Since authMiddleware has already verified the token and attached user data
    if (!req.user?.userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      throw new UnauthorizedError("Access denied. Admin privileges required.");
    }

    next();
  } catch (error) {
    next(error);
  }
};
