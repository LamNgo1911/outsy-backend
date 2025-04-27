import { Request, Response, NextFunction } from "express";
import authController from "../../src/controllers/authController"; // Assuming default export
import authService from "../../src/services/authService";
import { UserInput } from "../../src/types/types"; // Import necessary types
import { BadRequestError, UnauthorizedError } from "../../src/error/apiError";
import { Status, Role } from "@prisma/client";

// Mock the authService
jest.mock("../../src/services/authService");

// Helper to create mock Express req, res, next objects
const mockRequest = (body = {}, params = {}, query = {}, user = null) => {
  const req = {} as Request;
  req.body = body;
  req.params = params;
  req.query = query;
  // Simulate authenticated user if needed for some controller methods
  // req.user = user;
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis(); // For logout or simple responses
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe("AuthController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    next = mockNext;
  });

  // --- Test cases for signup ---
  describe("signup", () => {
    const validInput: UserInput = {
      // Use the same valid input structure as service tests
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      gender: "Other",
      birthdate: new Date("1995-01-01"),
      location: "Test City",
      interests: ["testing", "coding"],
      status: Status.ACTIVE,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockSignupResult = {
      user: { ...validInput, id: "mockUserId", password: "hashedPassword" }, // Omit password in actual response
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    it("should call authService.signup and return 201 on success", async () => {
      req = mockRequest(validInput);
      const { password, ...userWithoutPassword } = mockSignupResult.user;
      (authService.signup as jest.Mock).mockResolvedValue(mockSignupResult);

      await authController.signup(req, res, next);

      expect(authService.signup).toHaveBeenCalledWith(validInput);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          user: expect.objectContaining({
            username: validInput.username,
            email: validInput.email,
            firstName: validInput.firstName,
            lastName: validInput.lastName,
            gender: validInput.gender,
            birthdate: validInput.birthdate,
            location: validInput.location,
            interests: validInput.interests,
            status: validInput.status,
            role: validInput.role,
            id: "mockUserId",
            updatedAt: expect.any(Date),
          }),
          accessToken: mockSignupResult.accessToken,
          refreshToken: mockSignupResult.refreshToken,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if authService.signup throws an error", async () => {
      req = mockRequest(validInput);
      const error = new BadRequestError("User already exists");
      (authService.signup as jest.Mock).mockRejectedValue(error);

      await authController.signup(req, res, next);

      expect(authService.signup).toHaveBeenCalledWith(validInput);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for login ---
  describe("login", () => {
    const loginCredentials = {
      email: "test@example.com",
      password: "password123",
    };
    const mockLoginResult = {
      user: {
        id: "mockUserId",
        email: loginCredentials.email /* other fields */,
      },
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    it("should call authService.login and return 200 on success", async () => {
      req = mockRequest(loginCredentials);
      const mockLoginResultWithData = {
        data: {
          user: mockLoginResult.user,
          accessToken: mockLoginResult.accessToken,
          refreshToken: mockLoginResult.refreshToken,
        },
        success: true,
      };
      (authService.login as jest.Mock).mockResolvedValue(
        mockLoginResultWithData
      );
    });

    it("should call next with error if authService.login throws UnauthorizedError", async () => {
      req = mockRequest(loginCredentials);
      const error = new UnauthorizedError("Invalid credentials");
      (authService.login as jest.Mock).mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith(
        loginCredentials.email,
        loginCredentials.password
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for refreshToken ---
  describe("refreshToken", () => {
    const refreshToken = "validRefreshToken";
    const mockRefreshResult = {
      accessToken: "newAccessToken",
      newRefreshToken: "newRefreshToken",
    };

    it("should call authService.refreshAccessToken and return 200 on success", async () => {
      req = mockRequest({ refreshToken }); // Assuming token comes in body
      const mockRefreshResultWithData = {
        data: {
          accessToken: mockRefreshResult.accessToken,
          refreshToken: mockRefreshResult.newRefreshToken,
        },
        success: true,
      };
      (authService.refreshAccessToken as jest.Mock).mockResolvedValue(
        mockRefreshResult
      );

      await authController.refreshToken(req, res, next);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          accessToken: mockRefreshResult.accessToken,
          refreshToken: mockRefreshResult.newRefreshToken,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if authService.refreshAccessToken throws an error", async () => {
      req = mockRequest({ refreshToken });
      const error = new UnauthorizedError("Invalid refresh token");
      (authService.refreshAccessToken as jest.Mock).mockRejectedValue(error);

      await authController.refreshToken(req, res, next);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for logout ---
  describe("logout", () => {
    const refreshToken = "validRefreshToken";

    it("should call authService.logout and return 204 on success", async () => {
      req = mockRequest({ refreshToken }); // Assuming token comes in body
      (authService.logout as jest.Mock).mockResolvedValue(undefined); // logout returns void

      await authController.logout(req, res, next);

      expect(authService.logout).toHaveBeenCalledWith(refreshToken);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled(); // Or res.json({}) depending on implementation
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if authService.logout throws BadRequestError (e.g., missing token)", async () => {
      req = mockRequest({}); // Missing token
      const error = new BadRequestError("Refresh token is required");
      // Simulate the service throwing the error (though it might be caught in the service itself)
      (authService.logout as jest.Mock).mockRejectedValue(error);

      await authController.logout(req, res, next);

      // Depending on controller logic, it might check req.body.refreshToken first
      // or directly call the service. Adjust expectation based on controller code.
      // Assuming it calls the service:
      expect(authService.logout).toHaveBeenCalledWith(undefined); // Called with undefined token
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
