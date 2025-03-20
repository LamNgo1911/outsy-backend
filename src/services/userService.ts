import prisma from "../config/prisma";
import { User, UserInput, UserUpdateInput } from "../types/types";
import { NotFoundError, BadRequestError } from "../error/apiError";
import bcrypt from "bcrypt";

const getUsers = async (
  filters: { location?: string; interests?: string[]; gender?: string } = {}
): Promise<User[]> => {
  const { location, interests, gender } = filters;

  return prisma.user.findMany({
    where: {
      status: "ACTIVE",
      ...(location && { location }),
      ...(interests && { interests: { hasSome: interests } }),
      ...(gender && { gender }),
    },
    orderBy: { updatedAt: "desc" },
  });
};

const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { hostedEvents: true, guestMatches: true },
  });

  if (!user) throw new NotFoundError("User not found");
  return user;
};

const getUserByEmail = async (email: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new NotFoundError("User not found");
  return user;
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
    interests,
    onlineStatus,
    preferences,
    igUrl,
  } = input;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existingUser)
    throw new BadRequestError("Username or email already taken");

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
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
      status: "ACTIVE",
      onlineStatus: onlineStatus ?? false,
      preferences: preferences ?? { activity: ["food"], distance: 10 },
      igUrl,
    },
  });
};

const updateUser = async (
  id: string,
  userUpdateInput: UserUpdateInput
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  if (userUpdateInput.password) {
    userUpdateInput.password = await bcrypt.hash(userUpdateInput.password, 10);
  }

  return prisma.user.update({
    where: { id },
    data: { ...userUpdateInput, updatedAt: new Date() },
  });
};

const deleteUser = async (id: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  await prisma.user.delete({ where: { id } });
};

const toggleOnlineStatus = async (
  id: string,
  onlineStatus: boolean
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  return prisma.user.update({
    where: { id },
    data: { onlineStatus },
  });
};

const searchUsersForHangout = async (
  location: string,
  interests: string[],
  gender?: string,
  excludeId?: string
): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      status: "ACTIVE",
      location,
      interests: { hasSome: interests },
      ...(gender && { gender }),
      NOT: excludeId ? { id: excludeId } : undefined,
    },
    take: 10,
    orderBy: { onlineStatus: "desc" },
  });
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
};
