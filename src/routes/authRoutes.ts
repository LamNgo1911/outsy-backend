import { Router } from "express";
import authController from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { adminCheck } from "../middleware/adminCheck";
import { z } from "zod";

const router = Router();

// Validation schemas
const signupSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    gender: z.string(),
    birthdate: z.string().transform((str) => new Date(str)),
    location: z.string(),
    interests: z.array(z.string()),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum(["USER", "ADMIN"], {
      errorMap: () => ({ message: "Role must be either USER or ADMIN" }),
    }),
  }),
});

// Public routes
router.post("/signup", validateRequest(signupSchema), authController.signup);
router.post("/login", validateRequest(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  authController.refreshToken
);
router.post(
  "/logout",
  validateRequest(refreshTokenSchema),
  authController.logout
);
router.get("/verify", authController.verifyToken);

// Admin-only routes
router.patch(
  "/users/:userId/role",
  adminCheck,
  validateRequest(updateUserRoleSchema),
  authController.updateUserRole
);

export default router;
