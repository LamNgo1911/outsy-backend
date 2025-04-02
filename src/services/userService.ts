import prisma from "../config/prisma";
import { User, UserInput, UserUpdateInput } from "../types/types";

// Get all users
const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();

  return users;
};

// Get a user by ID
const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!prismaUser) throw new NotFoundError("User not found");

  const user = prismaUser;
  // Cache the user
  cacheUser(user);
  return user;
};

const getUserByEmail = async (email: string): Promise<User> => {
  const prismaUser = await prisma.user.findUnique({
    where: { email },
    include: {
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
      preferences: true,
    },
  });

  if (!prismaUser) throw new NotFoundError("User not found");
  return prismaUser;
};

const createUser = async (input: UserInput): Promise<User> => {
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
    interests = [],
    onlineStatus,
    preferences,
    igUrl,
  } = input;

  // Enhanced validation
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }, ...(igUrl ? [{ igUrl }] : [])],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new BadRequestError("Email already taken");
    }
    if (existingUser.username === username) {
      throw new BadRequestError("Username already taken");
    }
    if (existingUser.igUrl === igUrl) {
      throw new BadRequestError(
        "Instagram URL already linked to another account"
      );
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const defaultPreferences = {
    activities: ["food"],
    distance: 10,
    ageRangeMin: 18,
    ageRangeMax: 35,
    matchNotif: true,
    messageNotif: true,
    eventNotif: true,
  };

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
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
    },
  });
  return user;
};

const updateUser = async (
  id: string,
  userUpdateInput: UserUpdateInput
): Promise<void> => {
  await prisma.user.update({
    where: { id },
    data: userUpdateInput,
  });
};

// Delete a user by ID
const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};

export default {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  toggleOnlineStatus,
  searchUsersForHangout,
  getUserStats,
  updateUserPreferences,
  updatePassword,
};
