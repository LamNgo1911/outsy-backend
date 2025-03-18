import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../error/apiError";

const errorStatusMap = new Map([
  [BadRequestError, 400],
  [ConflictError, 409],
  [UnauthorizedError, 401],
  [NotFoundError, 404],
  [ForbiddenError, 403],
]);

function apiErrorhandler(
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
) {
  console.log(error);

  for (const [ErrorType, statusCode] of errorStatusMap) {
    if (error instanceof ErrorType) {
      return response.status(statusCode).json({ message: error.message });
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return response.status(409).json({ message: "Unique constraint failed" });
    }
  }

  response.status(500).json({ message: "Internal Server Error" });
}

export default apiErrorhandler;
