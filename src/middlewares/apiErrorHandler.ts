import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../error/apiError";
import { Result } from "../utils/Result";
import { Prisma } from "@prisma/client";

// Custom error logging function
const logError = (error: Error, req: Request) => {
  console.error("Error Details:", {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    body: req.body,
    query: req.query,
    params: req.params,
  });
};

const apiErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error for debugging
  logError(err, req);

  // Handle ApiError instances
  if (err instanceof ApiError) {
    const response = Result.error(err.message, err.status);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        res.status(409).json({
          success: false,
          message: "Unique constraint violation",
          error: err.meta?.target,
        });
        break;
      case "P2025":
        res.status(404).json({
          success: false,
          message: "Record not found",
        });
        break;
      case "P2003":
        res.status(400).json({
          success: false,
          message: "Foreign key constraint violation",
        });
        break;
      default:
        res.status(500).json({
          success: false,
          message: "Database operation failed",
        });
    }
    return;
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: "Invalid data provided",
      error: err.message,
    });
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
      error: err.message,
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
      error: err.message,
    });
    return;
  }

  // Handle multer errors (file upload)
  if (err.name === "MulterError") {
    res.status(400).json({
      success: false,
      message: "File upload error",
      error: err.message,
    });
    return;
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === "ValidationError") {
    res.status(422).json({
      success: false,
      message: "Validation failed",
      error: err.message,
    });
    return;
  }

  // Handle rate limiting errors
  if (err.name === "RateLimitError") {
    res.status(429).json({
      success: false,
      message: "Too many requests",
      error: err.message,
    });
    return;
  }

  // Handle network errors
  if (err.name === "NetworkError") {
    res.status(503).json({
      success: false,
      message: "Service unavailable",
      error: err.message,
    });
    return;
  }

  // Handle syntax errors in JSON
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      error: err.message,
    });
    return;
  }

  // Handle unknown errors
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

export default apiErrorHandler;
