import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { User, UserUpdateInput, Preference } from "../types/types";
import { Status, Role } from "@prisma/client";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../error/apiError";
import { Result } from "../utils/Result";

// Get all users with filtering and pagination
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      location,
      interests,
      gender,
      status,
      role,
      onlineStatus,
      ageRange,
      searchTerm,
      page,
      limit,
    } = req.query;

    const filters = {
      ...(location && { location: location as string }),
      ...(interests && { interests: (interests as string).split(",") }),
      ...(gender && { gender: gender as string }),
      ...(status && { status: status as Status }),
      ...(role && { role: role as Role }),
      ...(onlineStatus !== undefined && {
        onlineStatus: onlineStatus === "true",
      }),
      ...(ageRange && {
        ageRange: {
          min: parseInt((ageRange as string).split(",")[0]),
          max: parseInt((ageRange as string).split(",")[1]),
        },
      }),
      ...(searchTerm && { searchTerm: searchTerm as string }),
    };

    const pagination = {
      ...(page && { page: parseInt(page as string) }),
      ...(limit && { limit: parseInt(limit as string) }),
    };

    const result = await userService.getUsers(filters, pagination);
    const response = Result.success(result);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    const response = Result.success(user);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Get user by email
export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    const response = Result.success(user);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
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
      onlineStatus,
      preferences,
      igUrl,
    } = req.body;

    const newUser = await userService.createUser({
      username,
      email,
      password,
      firstName,
      lastName,
      gender,
      birthdate: new Date(birthdate),
      bio,
      profilePicture,
      location,
      interests,
      onlineStatus,
      preferences,
      igUrl,
    });

    const response = Result.success(newUser, 201);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UserUpdateInput = req.body;

    // Convert date string to Date object if birthdate is provided
    if (updateData.birthdate) {
      updateData.birthdate = new Date(updateData.birthdate);
    }

    const updatedUser = await userService.updateUser(id, updateData);
    const response = Result.success(updatedUser);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Delete user (soft delete)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    const response = Result.success(null, 204);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Toggle user online status
export const toggleOnlineStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { onlineStatus } = req.body;

    if (typeof onlineStatus !== "boolean") {
      throw new BadRequestError("onlineStatus must be a boolean");
    }

    const updatedUser = await userService.toggleOnlineStatus(id, onlineStatus);
    const response = Result.success(updatedUser);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Search users for hangout
export const searchUsersForHangout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { location, interests, excludeId } = req.params;
    const { gender, ageRange, distance } = req.query;

    const preferences = {
      ...(gender && { gender: gender as string }),
      ...(ageRange && {
        ageRange: {
          min: parseInt((ageRange as string).split(",")[0]),
          max: parseInt((ageRange as string).split(",")[1]),
        },
      }),
      ...(distance && { distance: parseInt(distance as string) }),
    };

    const users = await userService.searchUsersForHangout(
      location,
      interests.split(","),
      preferences,
      excludeId
    );

    const response = Result.success(users);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Get user statistics
export const getUserStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const stats = await userService.getUserStats(userId);
    const response = Result.success(stats);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Update user preferences
export const updateUserPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const preferences: Partial<Preference> = req.body;

    const updatedUser = await userService.updateUserPreferences(
      userId,
      preferences
    );
    const response = Result.success(updatedUser);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error); // Propagate error to middleware
  }
};

// Update user password
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const updatedUser = await userService.updatePassword(
      id,
      oldPassword,
      newPassword
    );
    const response = Result.success(updatedUser);
    const { statusCode, body } = response.toResponse();
    res.status(statusCode).json(body);
  } catch (error) {
    next(error);
  }
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
