import {
  MatchStatus,
  Status,
  Role,
} from "@prisma/client"; // ✅ Import Status properly
import { EventLike, Event } from "./eventTypes";

// Base interfaces for common properties
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Preference related types
export interface Preference extends BaseEntity {
  userId: string;
  activities: string[];
  distance: number;
  ageRangeMin: number;
  ageRangeMax: number;
  matchNotif: boolean;
  messageNotif: boolean;
  eventNotif: boolean;
}

export interface PreferenceInput {
  activities?: string[];
  distance?: number;
  ageRangeMin?: number;
  ageRangeMax?: number;
  matchNotif?: boolean;
  messageNotif?: boolean;
  eventNotif?: boolean;
}

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: Date;
  bio?: string | null;
  profilePicture?: string | null;
  location: string;
  interests: string[];
  status: Status;
  role: Role;

  // Activity & Preferences
  onlineStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
  igUrl?: string | null;

  // Relations
  preferences: Preference | null;
  chats?: UserChat[];
  feedbacksReceived?: Feedback[];
  feedbacksGiven?: Feedback[];
  hostedEvents?: Event[];
  eventLikes?: EventLike[];
  hostMatches?: Match[];
  guestMatches?: Match[];
  refreshTokens?: RefreshToken[];
}

export interface UserInput {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: Date;
  bio?: string | null;
  profilePicture?: string | null;
  location: string;
  interests: string[];
  status: Status;
  role: Role;

  // Activity & Preferences
  onlineStatus?: boolean;
  createdAt: Date;
  updatedAt: Date;
  igUrl?: string | null;
  preferences?: PreferenceInput;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthdate?: Date;
  bio?: string | null;
  profilePicture?: string | null;
  location?: string;
  interests?: string[];
  status?: Status;
  role?: Role;

  // Activity & Preferences
  onlineStatus?: boolean;
  igUrl?: string | null;
  preferences?: PreferenceInput;
}

// Match related types
export interface Match extends BaseEntity {
  eventId: string;
  hostId: string;
  guestId: string;
  chatId: string | null;
  status: MatchStatus;

  // Relations
  event?: Event;
  host?: User;
  guest?: User;
  chat?: Chat;
}

export interface MatchInput {
  eventId: string;
  guestId: string;
}

export interface MatchUpdateInput {
  status?: MatchStatus;
  chatId?: string;
}

// Chat related types
export interface Chat extends BaseEntity {
  isActive: boolean;

  // Relations
  users?: UserChat[];
  messages?: Message[];
  matches?: Match[];
}

export interface UserChat {
  userId: string;
  chatId: string;

  // Relations
  user?: User;
  chat?: Chat;
}

export interface Message extends BaseEntity {
  chatId: string;
  senderId: string;
  content: string;
  isRead: boolean;

  // Relations
  chat?: Chat;
}

// Feedback related types
export interface Feedback {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  giverId: string;
  text: string;

  // Relations
  user?: User;
  giver?: User;
}

// RefreshToken related types
export interface RefreshToken extends BaseEntity {
  token: string;
  userId: string;
  expiresAt: Date;

  // Relations
  user?: User;
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserStats {
  totalEvents: number;
  totalMatches: number;
  totalFeedbacksReceived: number;
  totalFeedbacksGiven: number;
  recentFeedbacks: {
    text: string;
    createdAt: Date;
  }[];
  eventBreakdown: {
    hosted: number;
    completed: number;
    cancelled: number;
  };
  matchBreakdown: {
    total: number;
    completed: number;
    cancelled: number;
  };
}

// Filter types
export interface UserFilters {
  location?: string;
  interests?: string[];
  gender?: string;
  status?: Status;
  role?: Role;
  onlineStatus?: boolean;
  ageRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Auth related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData
  extends Omit<UserInput, "id" | "createdAt" | "updatedAt"> {
  confirmPassword: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  accessToken: string;
  refreshToken: string;
}

// Utility types
export type WithoutPassword<T> = Omit<T, "password">;
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
