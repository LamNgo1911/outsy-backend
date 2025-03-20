import prisma from "../config/prisma";
import {
  User,
  UserInput,
  UserUpdateInput,
  UserPreferences,
  UserStats,
} from "../types/types";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../error/apiError";
import bcrypt from "bcrypt";
import { Role, Status, Prisma, EventStatus } from "@prisma/client";

// Cache frequently accessed users (simple in-memory cache)
const userCache = new Map<string, { user: User; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const clearUserCache = (userId: string) => {
  userCache.delete(userId);
};

const getCachedUser = (userId: string): User | null => {
  const cached = userCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.user;
  }
  userCache.delete(userId);
  return null;
};

const cacheUser = (user: User) => {
  userCache.set(user.id, { user, timestamp: Date.now() });
};

// Helper function to convert Prisma user to our User type
const convertPrismaUserToUser = (prismaUser: any): User => ({
  ...prismaUser,
  bio: prismaUser.bio ?? undefined,
  profilePicture: prismaUser.profilePicture ?? undefined,
  location: prismaUser.location ?? undefined,
  igUrl: prismaUser.igUrl ?? undefined,
});

// Enhanced user retrieval with filtering and pagination
const getUsers = async (
  filters: {
    location?: string;
    interests?: string[];
    gender?: string;
    status?: Status;
    role?: Role;
    onlineStatus?: boolean;
    ageRange?: { min: number; max: number };
    searchTerm?: string;
  } = {},
  pagination: { page?: number; limit?: number } = {}
): Promise<{ users: User[]; total: number }> => {
  const {
    location,
    interests,
    gender,
    status = "ACTIVE",
    role,
    onlineStatus,
    ageRange,
    searchTerm,
  } = filters;

  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    status,
    ...(location && { location }),
    ...(interests && { interests: { hasSome: interests } }),
    ...(gender && { gender }),
    ...(role && { role }),
    ...(onlineStatus !== undefined && { onlineStatus }),
    ...(ageRange && {
      birthdate: {
        lte: new Date(Date.now() - ageRange.min * 365 * 24 * 60 * 60 * 1000),
        gte: new Date(Date.now() - ageRange.max * 365 * 24 * 60 * 60 * 1000),
      },
    }),
    ...(searchTerm && {
      OR: [
        {
          username: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          firstName: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          lastName: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    }),
  };

  const [prismaUsers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: [{ onlineStatus: "desc" }, { updatedAt: "desc" }],
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            hostedEvents: true,
            guestMatches: true,
            feedbacksReceived: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: prismaUsers.map(convertPrismaUserToUser),
    total,
  };
};

const getUserById = async (id: string): Promise<User> => {
  // Check cache first
  const cachedUser = getCachedUser(id);
  if (cachedUser) return cachedUser;

  const prismaUser = await prisma.user.findUnique({
    where: { id },
    include: {
      hostedEvents: {
        where: { status: { in: [EventStatus.OPEN, EventStatus.CLOSED] } },
        orderBy: { date: "desc" },
        take: 5,
      },
      guestMatches: {
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      feedbacksReceived: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
    },
  });

  if (!prismaUser) throw new NotFoundError("User not found");

  const user = convertPrismaUserToUser(prismaUser);
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
    },
  });

  if (!prismaUser) throw new NotFoundError("User not found");
  return convertPrismaUserToUser(prismaUser);
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

  const defaultPreferences: UserPreferences = {
    activity: ["food"],
    distance: 10,
    ageRange: { min: 18, max: 35 },
    notifications: {
      matches: true,
      messages: true,
      eventUpdates: true,
    },
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
      status: "ACTIVE",
      role: "USER",
      onlineStatus: onlineStatus ?? false,
      preferences: (preferences ?? defaultPreferences) as Prisma.InputJsonValue,
      igUrl,
    },
    include: {
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
    },
  });

  return user;
};

const updateUser = async (
  id: string,
  userUpdateInput: UserUpdateInput
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  // Validate unique fields if they're being updated
  if (
    userUpdateInput.email ||
    userUpdateInput.username ||
    userUpdateInput.igUrl
  ) {
    const existingUser = await prisma.user.findFirst({
      where: {
        id: { not: id },
        OR: [
          ...(userUpdateInput.email ? [{ email: userUpdateInput.email }] : []),
          ...(userUpdateInput.username
            ? [{ username: userUpdateInput.username }]
            : []),
          ...(userUpdateInput.igUrl ? [{ igUrl: userUpdateInput.igUrl }] : []),
        ],
      },
    });

    if (existingUser) {
      if (
        userUpdateInput.email &&
        existingUser.email === userUpdateInput.email
      ) {
        throw new BadRequestError("Email already taken");
      }
      if (
        userUpdateInput.username &&
        existingUser.username === userUpdateInput.username
      ) {
        throw new BadRequestError("Username already taken");
      }
      if (
        userUpdateInput.igUrl &&
        existingUser.igUrl === userUpdateInput.igUrl
      ) {
        throw new BadRequestError(
          "Instagram URL already linked to another account"
        );
      }
    }
  }

  if (userUpdateInput.password) {
    userUpdateInput.password = await bcrypt.hash(userUpdateInput.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { ...userUpdateInput, updatedAt: new Date() },
    include: {
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
    },
  });

  // Clear user cache
  clearUserCache(id);
  return updatedUser;
};

const deleteUser = async (id: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  // Soft delete by updating status
  await prisma.user.update({
    where: { id },
    data: {
      status: "INACTIVE",
      onlineStatus: false,
      updatedAt: new Date(),
    },
  });

  // Clear user cache
  clearUserCache(id);
};

const toggleOnlineStatus = async (
  id: string,
  onlineStatus: boolean
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  if (user.status !== "ACTIVE") {
    throw new UnauthorizedError("Only active users can change online status");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      onlineStatus,
      updatedAt: new Date(),
    },
    include: {
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
    },
  });

  // Clear user cache
  clearUserCache(id);
  return updatedUser;
};

const searchUsersForHangout = async (
  location: string,
  interests: string[],
  preferences: {
    gender?: string;
    ageRange?: { min: number; max: number };
    distance?: number;
  } = {},
  excludeId?: string
): Promise<User[]> => {
  const { gender, ageRange, distance = 10 } = preferences;

  return prisma.user.findMany({
    where: {
      status: "ACTIVE",
      location, // In a real app, use geospatial queries
      interests: { hasSome: interests },
      ...(gender && { gender }),
      ...(ageRange && {
        birthdate: {
          lte: new Date(Date.now() - ageRange.min * 365 * 24 * 60 * 60 * 1000),
          gte: new Date(Date.now() - ageRange.max * 365 * 24 * 60 * 60 * 1000),
        },
      }),
      NOT: excludeId ? { id: excludeId } : undefined,
    },
    include: {
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
    },
    take: 10,
    orderBy: [{ onlineStatus: "desc" }, { updatedAt: "desc" }],
  });
};

const getUserStats = async (userId: string): Promise<UserStats> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      hostedEvents: true,
      guestMatches: true,
      feedbacksReceived: true,
      feedbacksGiven: true,
    },
  });

  if (!user) throw new NotFoundError("User not found");

  const now = new Date();
  const recentFeedbacks = user.feedbacksReceived
    .slice(0, 5)
    .map((feedback) => ({
      text: feedback.text,
      createdAt: feedback.createdAt,
    }));

  const eventBreakdown = {
    hosted: user.hostedEvents.length,
    completed: user.hostedEvents.filter(
      (event) => event.status === EventStatus.CLOSED
    ).length,
    cancelled: user.hostedEvents.filter(
      (event) => event.status === EventStatus.CANCELLED
    ).length,
  };

  const matchBreakdown = {
    total: user.guestMatches.length,
    completed: user.guestMatches.filter((match) => match.status === "COMPLETED")
      .length,
    cancelled: user.guestMatches.filter((match) => match.status === "CANCELLED")
      .length,
  };

  return {
    totalEvents: user.hostedEvents.length,
    totalMatches: user.guestMatches.length,
    totalFeedbacksReceived: user.feedbacksReceived.length,
    totalFeedbacksGiven: user.feedbacksGiven.length,
    recentFeedbacks,
    eventBreakdown,
    matchBreakdown,
  };
};

const updateUserPreferences = async (
  userId: string,
  preferences: Partial<UserPreferences>
): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  if (!user) throw new NotFoundError("User not found");

  const currentPreferences = user.preferences as unknown as UserPreferences;
  const updatedPreferences = {
    ...currentPreferences,
    ...preferences,
  } as const;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      preferences: updatedPreferences as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
    include: {
      _count: {
        select: {
          hostedEvents: true,
          guestMatches: true,
          feedbacksReceived: true,
        },
      },
    },
  });

  // Clear user cache
  clearUserCache(userId);
  return updatedUser;
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
};
