import userService from "../../src/services/userService";
import prisma from "../../src/config/prisma";
import bcrypt from "bcrypt";
import { UserInput, UserUpdateInput } from "../../src/types/types";
import { NotFoundError, BadRequestError } from "../../src/error/apiError";
import { Status, Role } from "@prisma/client"; // Import enums

// Mock dependencies
jest.mock("../../src/config/prisma", () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(), // Mock $transaction
  };
  return mockPrisma;
});
jest.mock("bcrypt");

describe("User Service Functions", () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };
    (prisma as any).user = prismaMock.user;
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  // --- Test cases for createUser ---
  describe("createUser", () => {
    const validInput: UserInput = {
      username: "newuser",
      email: "new@example.com",
      password: "password123",
      firstName: "New",
      lastName: "User",
      gender: "Female",
      birthdate: new Date("1990-05-15"),
      location: "New City",
      interests: ["reading"],
      status: Status.ACTIVE,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const hashedPassword = "hashedPassword";
    const createdUser = {
      ...validInput,
      id: "newUser123",
      password: hashedPassword,
    };

    it("should hash the password and create a user", async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      prismaMock.user.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(validInput);

      expect(bcrypt.hash).toHaveBeenCalledWith(validInput.password, 10);
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: { ...validInput, password: hashedPassword },
        include: {
          preferences: true,
          _count: {
            select: {
              hostedEvents: true,
              guestMatches: true,
              feedbacksReceived: true,
            },
          },
        },
      });
      expect(result).toEqual(createdUser);
    });

    // Add test for potential errors during creation if applicable
  });

  // --- Test cases for getUserById ---
  describe("getUserById", () => {
    const userId = "user1";
    const mockUser = {
      id: userId,
      email: "user1@example.com" /* other fields */,
    };

    it("should return a user if found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      const result = await userService.getUserById(userId);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          hostedEvents: {
            where: { status: { in: ["OPEN", "CLOSED"] } },
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
          preferences: true,
        },
      });
    });

    // --- Test cases for getUserByEmail ---
    describe("getUserByEmail", () => {
      const userEmail = "user@example.com";
      const mockUser = { id: "user1", email: userEmail /* other fields */ };

      it("should return a user if found by email", async () => {
        prismaMock.user.findUnique.mockResolvedValue(mockUser);
        const result = await userService.getUserByEmail(userEmail);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
          where: { email: userEmail },
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
        expect(result).toEqual(mockUser);
      });

      it("should return null if user not found by email", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);
        const result = await userService.getUserByEmail(userEmail);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
          where: { email: userEmail },
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
      });
    });

    // --- Test cases for updateUser ---
    describe("updateUser", () => {
      const userId = "user1";
      const updateData: UserUpdateInput = { firstName: "UpdatedName" };
      const mockUser = {
        id: userId,
        email: "user1@example.com",
        firstName: "OldName" /* other fields */,
      };
      const updatedUser = { ...mockUser, ...updateData };

      it("should update the user and return the updated user", async () => {
        prismaMock.user.update.mockResolvedValue(updatedUser);
        const result = await userService.updateUser(userId, updateData);
        expect(prismaMock.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: updateData,
        });
        expect(result).toEqual(updatedUser);
      });

      it("should hash password if provided in update data", async () => {
        const passwordUpdate: UserUpdateInput = { password: "newPassword123" };
        const hashedPassword = "newHashedPassword";
        const userWithUpdatedPassword = {
          ...mockUser,
          password: hashedPassword,
        };

        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
        prismaMock.user.update.mockResolvedValue(userWithUpdatedPassword);

        const result = await userService.updateUser(userId, passwordUpdate);

        expect(bcrypt.hash).toHaveBeenCalledWith(passwordUpdate.password, 10);
        expect(prismaMock.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: { password: hashedPassword }, // Ensure only hashed password is sent
        });
        expect(result).toEqual(userWithUpdatedPassword);
      });

      it("should throw NotFoundError if user to update is not found", async () => {
        // Mock prisma update to simulate not found (e.g., throw specific Prisma error or return null based on actual behavior)
        // For simplicity, let's assume it throws an error identifiable as 'not found'
        const prismaNotFoundError = new Error("Record to update not found."); // Simulate Prisma error
        prismaMock.user.update.mockRejectedValue(prismaNotFoundError);

        await expect(
          userService.updateUser(userId, updateData)
        ).rejects.toThrow(NotFoundError);
        expect(prismaMock.user.update).toHaveBeenCalledWith({
          where: { id: userId },
          data: updateData,
        });
      });
    });

    // --- Test cases for deleteUser ---
    describe("deleteUser", () => {
      const userId = "user1";
      const mockUser = {
        id: userId,
        email: "user1@example.com" /* other fields */,
      };

      it("should delete the user and return the deleted user", async () => {
        prismaMock.user.delete.mockResolvedValue(mockUser);
        const result = await userService.deleteUser(userId);
        expect(prismaMock.user.delete).toHaveBeenCalledWith({
          where: { id: userId },
        });
        expect(result).toEqual(mockUser);
      });

      it("should throw NotFoundError if user to delete is not found", async () => {
        const prismaNotFoundError = new Error("Record to delete not found."); // Simulate Prisma error
        prismaMock.user.delete.mockRejectedValue(prismaNotFoundError);
        await expect(userService.deleteUser(userId)).rejects.toThrow(
          NotFoundError
        );
        expect(prismaMock.user.delete).toHaveBeenCalledWith({
          where: { id: userId },
        });
      });
    });

    // --- Test cases for getUsers ---
    describe("getUsers", () => {
      const mockUsers = [{ id: "user1" }, { id: "user2" }];
      const mockTotal = 2;
      const pagination = { page: 1, limit: 10 };

      it("should return a list of users with pagination info", async () => {
        prismaMock.user.findMany.mockResolvedValue(mockUsers);
        prismaMock.user.count.mockResolvedValue(mockTotal);

        const result = await userService.getUsers({}, pagination);

        expect(prismaMock.user.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: pagination.limit,
          where: {}, // Empty filter
          orderBy: undefined, // No sort
        });
        expect(prismaMock.user.count).toHaveBeenCalledWith({ where: {} });
        expect(result).toEqual({
          data: mockUsers,
          total: mockTotal,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: 1,
        });
      });

      // Add tests for filters and sorting if implemented in getUsers
    });
  });
});

// --- Test cases for getUsers ---
describe("getUsers", () => {
  const mockUsers = [{ id: "user1" }, { id: "user2" }];
  const mockTotal = 2;
  const pagination = { page: 1, limit: 10 };

  it("should return a list of users with pagination info", async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
    (prisma.user.count as jest.Mock).mockResolvedValue(mockTotal);

    const result = await userService.getUsers({}, pagination);

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: pagination.limit,
      where: {}, // Empty filter
      orderBy: undefined, // No sort
    });
    expect(prisma.user.count).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual({
      data: mockUsers,
      total: mockTotal,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: 1,
    });
  });

  // Add tests for filters and sorting if implemented in getUsers
});
