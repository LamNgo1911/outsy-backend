import prisma from "../config/prisma";
import userService from "./userService";
import { User, UserInput } from "../types/types";
import { BadRequestError, UnauthorizedError } from "../error/apiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken";
import generateRefreshToken from "../utils/generateRefreshToken";

// Validate environment variables at startup
const validateEnvironment = () => {
  const requiredEnvVars = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "ACCESS_TOKEN_EXPIRATION",
    "REFRESH_TOKEN_EXPIRATION",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// Initialize environment validation
validateEnvironment();

const signup = async (
  input: UserInput
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  // Validate input
  if (!input.email || !input.password) {
    throw new BadRequestError("Email and password are required");
  }

  // Check if user already exists
  const existingUser = await userService.getUserByEmail(input.email);
  if (existingUser) {
    throw new BadRequestError("User with this email already exists");
  }
  const user = await userService.createUser(input);
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const login = async (
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  // Validate input
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; newRefreshToken?: string }> => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const secret = process.env.JWT_REFRESH_SECRET!;
    const decoded = jwt.verify(refreshToken, secret) as { userId: string };

    // Find the token first, then delete it
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: decoded.userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (
      !storedToken ||
      !(await bcrypt.compare(refreshToken, storedToken.token))
    ) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return { accessToken, newRefreshToken };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token has expired");
    }
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  try {
    const secret = process.env.JWT_REFRESH_SECRET!;
    const decoded = jwt.verify(refreshToken, secret) as { userId: string };

    // Use a single query to find and delete the token
    await prisma.refreshToken.deleteMany({
      where: {
        userId: decoded.userId,
        expiresAt: { gt: new Date() },
      },
    });
  } catch (error) {
    // Don't throw error on logout to prevent token leakage
    console.error("Logout error:", error);
  }
};

const verifyAccessToken = (
  token: string
): { userId: string; email: string } => {
  if (!token) {
    throw new BadRequestError("Access token is required");
  }

  const secret = process.env.JWT_ACCESS_SECRET!;

  try {
    return jwt.verify(token, secret) as { userId: string; email: string };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError("Invalid access token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token has expired");
    }
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
  verifyAccessToken,
};
