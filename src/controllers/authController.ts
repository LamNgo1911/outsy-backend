import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import { UserInput } from "../types/types";
import { BadRequestError, UnauthorizedError } from "../error/apiError";
import prisma from "../config/prisma";

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface UpdateRoleRequest {
  role: "USER" | "ADMIN";
}

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput: UserInput = req.body;
    const { user, accessToken, refreshToken } = await authService.signup(
      userInput
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginRequest;
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    res.json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body as RefreshTokenRequest;
    const { accessToken, newRefreshToken } =
      await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body as RefreshTokenRequest;
    await authService.logout(refreshToken);

    res.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = authService.verifyAccessToken(token);

    res.json({
      success: true,
      data: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { role } = req.body as UpdateRoleRequest;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  login,
  refreshToken,
  logout,
  verifyToken,
  updateUserRole,
};
