import prisma from "../config/prisma";
import userService from "./userService";
import { User, UserInput } from "../types/types";
import { BadRequestError } from "../error/apiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken";
import generateRefreshToken from "../utils/generateRefreshToken";

const signup = async (
  input: UserInput
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const user = await userService.createUser(input);
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const login = async (
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const user = await userService.getUserByEmail(email);

  if (!(await bcrypt.compare(password, user.password))) {
    throw new BadRequestError("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; newRefreshToken?: string }> => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in environment variables"
      );
    }

    const decoded = jwt.verify(refreshToken, secret) as { userId: string };

    const storedToken = await prisma.refreshToken.findFirst({
      where: { userId: decoded.userId, expiresAt: { gt: new Date() } },
    });

    if (
      !storedToken ||
      !(await bcrypt.compare(refreshToken, storedToken.token))
    ) {
      throw new BadRequestError("Invalid or expired refresh token");
    }

    const user = await userService.getUserById(decoded.userId);
    const accessToken = generateAccessToken(user);

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    const newRefreshToken = await generateRefreshToken(user);

    return { accessToken, newRefreshToken };
  } catch (error) {
    throw new BadRequestError("Invalid or expired refresh token");
  }
};

const logout = async (refreshToken: string): Promise<void> => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }

  const decoded = jwt.verify(refreshToken, secret) as { userId: string };

  const storedToken = await prisma.refreshToken.findFirst({
    where: { userId: decoded.userId },
  });

  if (storedToken && (await bcrypt.compare(refreshToken, storedToken.token))) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
  }
};

const verifyAccessToken = (
  token: string
): { userId: string; email: string } => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables"
    );
  }

  try {
    return jwt.verify(token, secret) as { userId: string; email: string };
  } catch (error) {
    throw new BadRequestError("Invalid or expired access token");
  }
};

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
  verifyAccessToken,
};
