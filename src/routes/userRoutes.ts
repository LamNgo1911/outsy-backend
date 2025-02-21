import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

// Get all users
router.get("/", getUsers);

// Get a user by ID
router.get("/:id", getUserById);

// Create a new user
router.post("/", createUser);

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
