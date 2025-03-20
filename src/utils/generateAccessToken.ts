import { User } from "../types/types";
import jwt, { SignOptions } from "jsonwebtoken";

const generateAccessToken = (user: User): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION as string;

  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables"
    );
  }

  const options: SignOptions = {
    expiresIn: parseInt(accessTokenExpiration, 10) || "15m",
  };

  return jwt.sign({ userId: user.id, email: user.email }, secret, options);
};

export default generateAccessToken;
