import { User } from "../types/types";
import jwt, { SignOptions } from "jsonwebtoken";

const generateAccessToken = (user: User): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiration = process.env.ACCESS_TOKEN_EXPIRATION;

  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables"
    );
  }

  if (!accessTokenExpiration) {
    throw new Error(
      "ACCESS_TOKEN_EXPIRATION is not defined in environment variables"
    );
  }

  const options: SignOptions = {
    expiresIn: (accessTokenExpiration as jwt.SignOptions["expiresIn"]) || "15m",
  };

  return jwt.sign({ userId: user.id, email: user.email }, secret, options);
};

export default generateAccessToken;
