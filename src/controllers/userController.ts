import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import userService from "../services/userService";
import { User } from "../services/types";
import { Status } from "@prisma/client";

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user" });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
      birthdate,
      bio,
      profilePicture,
      location,
      interests,
      status,
      chats,
      onlineStatus,
      preferences,
      igUrl,
    } = req.body;

    const newUser: User = await userService.createUser({
      id: uuidv4(),
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
      birthdate,
      bio,
      profilePicture,
      location,
      interests,
      status: Status.ACTIVE,
      onlineStatus,
      preferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      igUrl,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
      birthdate,
      bio,
      profilePicture,
      location,
      interests,
      status,
      onlineStatus,
      preferences,
      igUrl,
    } = req.body;

    await userService.updateUser(id, {
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
      birthdate,
      bio,
      profilePicture,
      location,
      interests,
      status,
      onlineStatus,
      preferences,
      igUrl,
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
