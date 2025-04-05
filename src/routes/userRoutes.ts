import { Router } from 'express';
import {
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
} from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminCheck } from '../middlewares/adminCheck';
import { z } from 'zod';
import { Status, Role } from '@prisma/client';

const router = Router();

// Validation schemas
const userCreateSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    gender: z.string(),
    birthdate: z.string().transform((str) => new Date(str)),
    bio: z.string().optional(),
    profilePicture: z.string().optional(),
    location: z.string(),
    interests: z.array(z.string()),
    onlineStatus: z.boolean().optional(),
    preferences: z
      .object({
        matchNotif: z.boolean().optional(),
        messageNotif: z.boolean().optional(),
        eventNotif: z.boolean().optional(),
      })
      .optional(),
    igUrl: z.string().optional(),
  }),
});

const userUpdateSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .optional(),
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .optional(),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .optional(),
    gender: z.string().optional(),
    birthdate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    bio: z.string().optional(),
    profilePicture: z.string().optional(),
    location: z.string().optional(),
    interests: z.array(z.string()).optional(),
    onlineStatus: z.boolean().optional(),
    preferences: z
      .object({
        matchNotif: z.boolean().optional(),
        messageNotif: z.boolean().optional(),
        eventNotif: z.boolean().optional(),
      })
      .optional(),
    igUrl: z.string().optional(),
  }),
});

const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

const userEmailSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

const toggleOnlineStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    onlineStatus: z.boolean(),
  }),
});

const searchUsersSchema = z.object({
  params: z.object({
    location: z.string(),
    interests: z.string(),
    excludeId: z.string(),
  }),
  query: z.object({
    gender: z.string().optional(),
    ageRange: z.string().optional(),
    distance: z.string().optional(),
  }),
});

const userPreferencesSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    matchNotif: z.boolean().optional(),
    messageNotif: z.boolean().optional(),
    eventNotif: z.boolean().optional(),
  }),
});

const userFiltersSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    interests: z.string().optional(),
    gender: z.string().optional(),
    status: z.enum([Status.ACTIVE, Status.BANNED, Status.INACTIVE]).optional(),
    role: z.enum([Role.USER, Role.ADMIN]).optional(),
    onlineStatus: z.string().optional(),
    ageRange: z.string().optional(),
    searchTerm: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

const updatePasswordSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Protected routes (auth required)
router.get('/email/:email', validateRequest(userEmailSchema), getUserByEmail);
router.get('/:id', validateRequest(userIdSchema), getUserById);
router.put('/:id', validateRequest(userUpdateSchema), updateUser);
router.patch(
  '/:id/password',
  validateRequest(updatePasswordSchema),
  updatePassword
);
router.patch(
  '/:id/online-status',
  validateRequest(toggleOnlineStatusSchema),
  toggleOnlineStatus
);
router.get('/:userId/stats', validateRequest(userIdSchema), getUserStats);
router.patch(
  '/:userId/preferences',
  validateRequest(userPreferencesSchema),
  updateUserPreferences
);
router.get(
  '/search/:location/:interests/:excludeId',
  validateRequest(searchUsersSchema),
  searchUsersForHangout
);

// Admin routes (auth + admin required)
router.use(adminCheck);
router.get('/', validateRequest(userFiltersSchema), getUsers);
router.post('/', validateRequest(userCreateSchema), createUser);
router.delete('/:id', validateRequest(userIdSchema), deleteUser);

export default router;
