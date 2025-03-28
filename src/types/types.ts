import {
  EventStatus,
  EventType,
  LikeStatus,
  MatchStatus,
  Prisma,
  Status,
  Role,
} from "@prisma/client"; // ✅ Import Status properly

// User Type (For Reading Data)
export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

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

// User Input Type (For Creating a User)
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

// User Update Type (For Updating a User)
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

// Event related types
export interface Event {
  id: string;
  hostId: string;
  name: string;
  description: string | null;
  type: EventType;
  date: Date;
  venueId: string;
  status: EventStatus;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  host?: User;
  venue?: Venue;
  eventLikes?: EventLike[];
  matches?: Match[];
}

export interface EventInput {
  hostId: string;
  name: string;
  description?: string;
  type: EventType;
  date: Date;
  venueId: string;
  status: EventStatus;
}

export interface EventUpdateInput {
  name?: string;
  description?: string;
  type?: EventType;
  date?: Date;
  venueId?: string;
  status?: EventStatus;
  capacity?: number;
}

// Event Like related types
export interface EventLike {
  id: string;
  userId: string;
  eventId: string;
  createdAt: Date;
  status: LikeStatus;
  message: string | null;

  // Relations
  user?: User;
  event?: Event;
}

// Venue related types
export interface Venue {
  id: string;
  name: string;
  address: string;
  state: string | null;
  postalCode: string;
  city: string;
  country: string;
  description: string | null;
  imageUrl: string | null;

  // Relations
  events?: Event[];
}

export interface VenueInput {
  name: string;
  address: string;
  state?: string;
  postalCode: string;
  city: string;
  country: string;
  description?: string;
  imageUrl?: string;
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
  hostId: string;
  chatId?: string | null;
  status?: MatchStatus;
}

export interface EventLike {
  id: string;
  userId: string;
  eventId: string;
  createdAt: Date;
  status: LikeStatus;
  message: string | null;
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

// Uncomment and define these interfaces if needed

// interface Match {
//   id: number;
//   user1Id: number;
//   user2Id: number;
//   matchedAt: Date;
//   isActive: boolean;
//   user1: User;
//   user2: User;
// }

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
  status?: EventStatus;
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
