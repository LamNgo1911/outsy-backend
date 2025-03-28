import prisma from "../config/prisma";
import { User, UserInput, UserUpdateInput } from "../types/types";

// Get all users
const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany({
    include: {
      preferences: true,
    },
  });

  return users;
};

// Get a user by ID
const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      preferences: true,
    },
  });

  if (user) {
    return user;
  }

  throw new Error("User not found");
};

// Create a new user
const createUser = async ({
  id,
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
  createdAt,
  updatedAt,
  igUrl,
}: UserInput): Promise<User> => {
  const newUser = await prisma.user.create({
    data: {
      id,
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
      preferences: preferences
        ? {
            create: preferences,
          }
        : undefined,
      createdAt,
      updatedAt,
      igUrl,
    },
    include: {
      preferences: true,
    },
  });

  return newUser;
};

// Update a user by ID
const updateUser = async (
  id: string,
  userUpdateInput: UserUpdateInput
): Promise<void> => {
  const { preferences, ...rest } = userUpdateInput;
  await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      ...(preferences && {
        preferences: {
          upsert: {
            create: preferences,
            update: preferences,
          },
        },
      }),
    },
  });
};

// Delete a user by ID
const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
