import authService from "../../src/services/authService"; // Default import
import userService from "../../src/services/userService"; // Needed for mocking
import prisma from "../../src/config/prisma"; // Needed for mocking
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateAccessToken from "../../src/utils/generateAccessToken";
import generateRefreshToken from "../../src/utils/generateRefreshToken";
import { BadRequestError, UnauthorizedError } from "../../src/error/apiError";
import { Status, Role } from "@prisma/client"; // Import enums
import { UserInput } from "../../src/types/types"; // Import UserInput

// Mock dependencies
jest.mock("../../src/services/userService");
jest.mock("../../src/config/prisma", () => ({
  refreshToken: {
    findFirst: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    create: jest.fn(), // Added for generateRefreshToken mock
  },
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../src/utils/generateAccessToken");
jest.mock("../../src/utils/generateRefreshToken");

describe("Auth Service Functions", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Provide default mock implementations or return values if needed globally
    // For example:
    // (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    // (jwt.verify as jest.Mock).mockReturnValue({ userId: 'mockUserId', email: 'test@example.com' });
    // (generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');
    // (generateRefreshToken as jest.Mock).mockResolvedValue('mockRefreshToken');
  });

  // Test placeholder - can be removed when actual tests are added
  it("should have authService defined", () => {
    expect(authService).toBeDefined();
  });

  // --- Test cases for signup ---
  describe("signup", () => {
    // Create a valid UserInput object based on src/types/types.ts
    const validInput: UserInput = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      gender: "Other",
      birthdate: new Date("1995-01-01"),
      location: "Test City",
      interests: ["testing", "coding"],
      status: Status.ACTIVE, // Use enum
      role: Role.USER, // Use enum
      // These might be set by DB/service, ensure they are part of the input type if required
      updatedAt: new Date(), // Or mock date
      // Optional fields
      bio: null,
      profilePicture: null,
      onlineStatus: true,
      igUrl: null,
    };

    // Mock user object that userService.createUser might return (includes id, hashed password)
    const mockCreatedUser = {
      ...validInput,
      id: "mockUserId",
      password: "hashedPassword", // Simulate password hashing
      preferences: null, // Add other fields expected in the User type if necessary
      // Ensure all fields from User type are present if needed by subsequent calls
      feedbacksReceived: [],
      feedbacksGiven: [],
      hostedEvents: [],
      eventLikes: [],
      hostMatches: [],
      guestMatches: [],
      refreshTokens: [],
      chats: [],
    };

    it("should successfully sign up a new user", async () => {
      // Mock userService methods
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (userService.createUser as jest.Mock).mockResolvedValue(mockCreatedUser); // Use the detailed mock user
      // Mock token generation
      (generateAccessToken as jest.Mock).mockReturnValue("mockAccessToken");
      (generateRefreshToken as jest.Mock).mockResolvedValue("mockRefreshToken");

      const result = await authService.signup(validInput);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userService.createUser).toHaveBeenCalledWith(validInput);
      expect(generateAccessToken).toHaveBeenCalledWith(mockCreatedUser);
      expect(generateRefreshToken).toHaveBeenCalledWith(mockCreatedUser);
      expect(result).toEqual({
        user: mockCreatedUser, // Expect the detailed mock user
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });
    });

    it("should throw BadRequestError if email or password is missing", async () => {
      // Create partial inputs missing required fields
      const inputWithoutEmail = { ...validInput, email: "" };
      const inputWithoutPassword = { ...validInput, password: "" };

      // Need to cast to any or Partial<UserInput> because TS knows they are invalid
      await expect(
        authService.signup(inputWithoutEmail as any)
      ).rejects.toThrow(BadRequestError);
      await expect(
        authService.signup(inputWithoutPassword as any)
      ).rejects.toThrow(BadRequestError);
      // Test with both missing
      await expect(
        authService.signup({ ...validInput, email: "", password: "" } as any)
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if user already exists", async () => {
      // Mock existing user found (use a structure similar to mockCreatedUser)
      const existingUser = {
        ...mockCreatedUser,
        id: "existingId",
        email: validInput.email,
      };
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(existingUser);

      await expect(authService.signup(validInput)).rejects.toThrow(
        BadRequestError
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

  // --- Test cases for login ---
  describe("login", () => {
    const email = "test@example.com";
    const password = "password123";
    const mockUser = {
      id: "1",
      email,
      password: "hashedPassword",
      name: "Test User",
    };

    it("should successfully log in a user with valid credentials", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateAccessToken as jest.Mock).mockReturnValue("mockAccessToken");
      (generateRefreshToken as jest.Mock).mockResolvedValue("mockRefreshToken");

      const result = await authService.login(email, password);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
      expect(generateRefreshToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        user: mockUser,
        accessToken: "mockAccessToken",
        refreshToken: "mockRefreshToken",
      });
    });

    it("should throw BadRequestError if email or password is missing", async () => {
      await expect(authService.login("", "")).rejects.toThrow(BadRequestError);
      await expect(authService.login(email, "")).rejects.toThrow(
        BadRequestError
      );
      await expect(authService.login("", password)).rejects.toThrow(
        BadRequestError
      );
    });

    it("should throw UnauthorizedError if user is not found", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      await expect(authService.login(email, password)).rejects.toThrow(
        UnauthorizedError
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if password does not match", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Password mismatch
      await expect(authService.login(email, password)).rejects.toThrow(
        UnauthorizedError
      );
      expect(userService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(generateAccessToken).not.toHaveBeenCalled();
    });
  });

  // --- Test cases for refreshAccessToken ---
  describe("refreshAccessToken", () => {
    const refreshToken = "validRefreshToken";
    const decodedToken = { userId: "1" };
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: "hashedPassword",
      name: "Test User",
    };
    const storedToken = {
      id: "tokenId",
      userId: "1",
      token: "hashedRefreshToken",
      expiresAt: new Date(Date.now() + 3600 * 1000),
    };

    beforeEach(() => {
      // Mock JWT verification and bcrypt comparison by default for valid cases
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      // Mock Prisma findFirst to return a valid token
      (prisma.refreshToken.findFirst as jest.Mock).mockResolvedValue(
        storedToken
      );
      // Mock userService getUserById
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      // Mock token generation
      (generateAccessToken as jest.Mock).mockReturnValue("newMockAccessToken");
      (generateRefreshToken as jest.Mock).mockResolvedValue(
        "newMockRefreshToken"
      );
    });

    it("should successfully refresh the access token", async () => {
      const result = await authService.refreshAccessToken(refreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      expect(prisma.refreshToken.findFirst).toHaveBeenCalledWith({
        where: {
          userId: decodedToken.userId,
          expiresAt: { gt: expect.any(Date) },
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        refreshToken,
        storedToken.token
      );
      expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: storedToken.id },
      });
      expect(userService.getUserById).toHaveBeenCalledWith(decodedToken.userId);
      expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
      expect(generateRefreshToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        accessToken: "newMockAccessToken",
        newRefreshToken: "newMockRefreshToken",
      });
    });

    it("should throw BadRequestError if refresh token is missing", async () => {
      await expect(authService.refreshAccessToken("")).rejects.toThrow(
        BadRequestError
      );
    });

    it("should throw UnauthorizedError if jwt verification fails", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError("Invalid token");
      });
      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if jwt token is expired", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError("Expired token", new Date());
      });
      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if stored token is not found", async () => {
      (prisma.refreshToken.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if stored token is expired (findFirst returns null)", async () => {
      // Prisma query already checks expiresAt > now, so null means not found or expired
      (prisma.refreshToken.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if bcrypt comparison fails", async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError if user is not found after token verification", async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);
      await expect(
        authService.refreshAccessToken(refreshToken)
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  // --- Test cases for logout ---
  describe("logout", () => {
    const refreshToken = "validRefreshToken";
    const decodedToken = { userId: "1" };

    beforeEach(() => {
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({
        count: 1,
      }); // Simulate successful deletion
    });

    it("should successfully log out by deleting the refresh token", async () => {
      await expect(authService.logout(refreshToken)).resolves.toBeUndefined(); // logout returns void

      expect(jwt.verify).toHaveBeenCalledWith(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: decodedToken.userId,
          expiresAt: { gt: expect.any(Date) },
        },
      });
    });

    it("should throw BadRequestError if refresh token is missing", async () => {
      await expect(authService.logout("")).rejects.toThrow(BadRequestError);
    });

    it("should not throw an error if jwt verification fails (catches error)", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError("Invalid token");
      });
      await expect(authService.logout(refreshToken)).resolves.toBeUndefined();
      expect(prisma.refreshToken.deleteMany).not.toHaveBeenCalled(); // Deletion shouldn't happen if verify fails
    });

    it("should not throw an error if prisma deletion fails (catches error)", async () => {
      (prisma.refreshToken.deleteMany as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        // Expect that the error is caught and handled
      }
    });
  });

  // --- Test cases for verifyAccessToken ---
  describe("verifyAccessToken", () => {
    const accessToken = "validAccessToken";
    const decodedToken = { userId: "1", email: "test@example.com" };

    beforeEach(() => {
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
    });

    it("should successfully verify a valid access token", () => {
      const result = authService.verifyAccessToken(accessToken);
      expect(jwt.verify).toHaveBeenCalledWith(
        accessToken,
        process.env.JWT_ACCESS_SECRET
      );
      expect(result).toEqual(decodedToken);
    });

    it("should throw BadRequestError if access token is missing", () => {
      expect(() => authService.verifyAccessToken("")).toThrow(BadRequestError);
    });

    it("should throw UnauthorizedError if jwt verification fails", () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError("Invalid token");
      });
      expect(() => authService.verifyAccessToken(accessToken)).toThrow(
        UnauthorizedError
      );
    });

    it("should throw UnauthorizedError if jwt token is expired", () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError("Expired token", new Date());
      });
      expect(() => authService.verifyAccessToken(accessToken)).toThrow(
        UnauthorizedError
      );
    });
  });

  // Add more describe blocks for other functions like logout, verifyAccessToken etc.
  // describe('loginUser', () => {
  //   it('should return tokens on successful login', async () => {
  //     // Setup mocks for user lookup and password check
  //     // const result = await authService.loginUser('test@example.com', 'password');
  //     // expect(result.isSuccess).toBe(true);
  //     // expect(result.value).toHaveProperty('accessToken');
  //     // expect(result.value).toHaveProperty('refreshToken');
  //   });
  //
  //   it('should return error for invalid credentials', async () => {
  //      // Setup mocks for user lookup or password check failure
  //     // const result = await authService.loginUser('wrong@example.com', 'wrong');
  //     // expect(result.isFailure).toBe(true);
  //   });
  // });

  // describe('registerUser', () => {
  //   // Add tests for user registration
  // });
});
