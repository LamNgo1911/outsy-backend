import { Request, Response, NextFunction } from "express";
import userController from "../../src/controllers/userController"; // Assuming default export
import userService from "../../src/services/userService";
import {
  UserInput,
  UserUpdateInput,
  UserFilters,
  PaginationParams,
} from "../../src/types/types"; // Import necessary types
import { NotFoundError } from "../../src/error/apiError";
import { Status, Role } from "@prisma/client";

// Mock the userService
jest.mock("../../src/services/userService");

// Helper to create mock Express req, res, next objects (can be shared or redefined)
const mockRequest = (body = {}, params = {}, query = {}, user = null) => {
  const req = {} as Request;
  req.body = body;
  req.params = params;
  req.query = query;
  // req.user = user; // If auth middleware adds user info
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe("UserController", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  // Mock user data for reuse
  const mockUserId = "user123";
  const mockUser = {
    id: mockUserId,
    username: "testuser",
    email: "test@example.com",
    firstName: "Test",
    lastName: "User",
    // Add other necessary fields based on User type, omitting password
  };
  const mockUserInput: UserInput = {
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
  const mockUserUpdateInput: UserUpdateInput = {
    firstName: "Updated",
    interests: ["coding", "testing"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    next = mockNext;
  });

  // --- Test cases for getUsers ---
  describe("getUsers", () => {
    const mockUsersList = [
      mockUser,
      { ...mockUser, id: "user456", email: "test2@example.com" },
    ];
    const mockPaginationResult = {
      data: mockUsersList,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it("should call userService.getUsers and return 200 with users list", async () => {
      req = mockRequest({}, {}, { page: "1", limit: "10" }); // Query params as strings
      (userService.getUsers as jest.Mock).mockResolvedValue(
        mockPaginationResult
      );

      await userController.getUsers(req, res, next);

      // Construct expected filters and pagination from req.query
      const expectedFilters: UserFilters = {}; // Add filters if controller parses them
      const expectedPagination: PaginationParams = { page: 1, limit: 10 };

      expect(userService.getUsers).toHaveBeenCalledWith(
        expectedFilters,
        expectedPagination
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPaginationResult,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if userService.getUsers throws error", async () => {
      req = mockRequest({}, {}, { page: "1", limit: "10" });
      const error = new Error("Database error");
      (userService.getUsers as jest.Mock).mockRejectedValue(error);

      await userController.getUsers(req, res, next);

      expect(userService.getUsers).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for getUserById ---
  describe("getUserById", () => {
    it("should call userService.getUserById and return 200 with user", async () => {
      req = mockRequest({}, { id: mockUserId }); // Params
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await userController.getUserById(req, res, next);

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUser }); // Assuming service omits password
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with NotFoundError if user not found", async () => {
      req = mockRequest({}, { id: "unknownId" });
      const error = new NotFoundError("User not found");
      (userService.getUserById as jest.Mock).mockRejectedValue(error);

      await userController.getUserById(req, res, next);

      expect(userService.getUserById).toHaveBeenCalledWith("unknownId");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for createUser ---
  describe("createUser", () => {
    const createdUser = {
      ...mockUserInput,
      id: "newUser123",
      password: "hashedPassword",
    }; // Service returns this
    // Create expected response by omitting password via destructuring
    const { password, ...expectedResponse } = createdUser;
    const expectedResponseWithSuccess = {
      success: true,
      data: expectedResponse,
    };

    it("should call userService.createUser and return 201 with created user (no password)", async () => {
      req = mockRequest(mockUserInput);
      (userService.createUser as jest.Mock).mockResolvedValue(createdUser);

      await userController.createUser(req, res, next);

      expect(userService.createUser).toHaveBeenCalledWith(mockUserInput);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedResponseWithSuccess);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if userService.createUser throws error", async () => {
      req = mockRequest(mockUserInput);
      const error = new Error("Failed to create user");
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      await userController.createUser(req, res, next);

      expect(userService.createUser).toHaveBeenCalledWith(mockUserInput);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for updateUser ---
  describe("updateUser", () => {
    const updatedUser = { ...mockUser, ...mockUserUpdateInput };
    const expectedResponse = { success: true, data: { ...updatedUser } };

    it("should call userService.updateUser and return 200 with updated user", async () => {
      req = mockRequest(mockUserUpdateInput, { id: mockUserId });
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await userController.updateUser(req, res, next);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUserId,
        mockUserUpdateInput
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if userService.updateUser throws error", async () => {
      req = mockRequest(mockUserUpdateInput, { id: mockUserId });
      const error = new NotFoundError("User to update not found");
      (userService.updateUser as jest.Mock).mockRejectedValue(error);

      await userController.updateUser(req, res, next);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUserId,
        mockUserUpdateInput
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // --- Test cases for deleteUser ---
  describe("deleteUser", () => {
    const deletedUser = { ...mockUser }; // Service returns the deleted user info

    it("should call userService.deleteUser and return 204 (No Content)", async () => {
      req = mockRequest({}, { id: mockUserId });
      (userService.deleteUser as jest.Mock).mockResolvedValue(deletedUser); // Service returns deleted user

      await userController.deleteUser(req, res, next);

      expect(userService.deleteUser).toHaveBeenCalledWith(mockUserId);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled(); // Or res.json()
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error if userService.deleteUser throws error", async () => {
      req = mockRequest({}, { id: mockUserId });
      const error = new NotFoundError("User to delete not found");
      (userService.deleteUser as jest.Mock).mockRejectedValue(error);

      await userController.deleteUser(req, res, next);

      expect(userService.deleteUser).toHaveBeenCalledWith(mockUserId);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
