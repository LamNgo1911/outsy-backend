import { Status, Role } from "@prisma/client"; // ✅ Import Status properly

// Base interfaces for common properties
interface BaseEntity {
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
export interface User extends BaseEntity {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: Date;
  bio: string | null;
  profilePicture: string | null;
  location: string;
  interests: string[];
  status: Status;
  role: Role;
  onlineStatus: boolean;
  preferences: Preference | null;
  igUrl: string | null;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: Date;
  bio?: string;
  profilePicture?: string;
  location: string;
  interests?: string[];
  onlineStatus?: boolean;
  preferences?: PreferenceInput;
  igUrl?: string;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthdate?: Date;
  bio?: string;
  profilePicture?: string;
  location?: string;
  interests?: string[];
  status?: Status;
  onlineStatus?: boolean;
  preferences?: PreferenceInput;
  igUrl?: string;
}

// Event related types
export interface Event extends BaseEntity {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxGuests: number;
  currentGuests: number;
  status: string;
  hostId: string;
  host: User;
  guests: User[];
  category: string;
  price?: number;
  images?: string[];
  requirements?: string[];
}

export interface EventInput {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxGuests: number;
  category: string;
  price?: number;
  images?: string[];
  requirements?: string[];
}

export interface EventUpdateInput {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  maxGuests?: number;
  status?: string;
  category?: string;
  price?: number;
  images?: string[];
  requirements?: string[];
}

// Match related types
export interface Match extends BaseEntity {
  eventId: string;
  event: Event;
  hostId: string;
  host: User;
  guestId: string;
  guest: User;
  status: string;
  rating?: number;
  feedback?: string;
}

export interface MatchInput {
  eventId: string;
  guestId: string;
}

export interface MatchUpdateInput {
  status?: string;
  rating?: number;
  feedback?: string;
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

export interface EventFilters {
  location?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  status?: string;
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

export interface RegisterData extends UserInput {
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
