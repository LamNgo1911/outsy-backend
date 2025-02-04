import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
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
    const user = await prisma.user.findUnique({ where: { id } });
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
      onlineStatus,
      preferences,
      igUrl,
    } = req.body;
    const newUser = await prisma.user.create({
      data: {
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
        status,
        onlineStatus,
        preferences,
        igUrl,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
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
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
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
      },
    });
    res.json(updatedUser);
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
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
