import { User } from "../types/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";

const generateRefreshToken = async (user: User): Promise<string> => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }

  const rawToken = jwt.sign({ userId: user.id }, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "30d",
  } as jwt.SignOptions);

  const hashedToken = await bcrypt.hash(rawToken, 10);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expiresAt,
    },
  });

  return rawToken;
};

export default generateRefreshToken;
