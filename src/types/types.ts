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

// Chat Interface
export interface Chat {
  id: string;
  users: User[];
  messages: Message[];
}

// Message Interface
export interface Message {
  id: number;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  chat: Chat;
}

// Event Interfaces
export interface Event {
  id: string;
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

export type Venue = {
  id: string;
  name: string;
  address: string;
  state: string | null;
  postalCode: string;
  city: string;
  country: string;
  description: string | null;
  imageUrl: string | null;
};

export type VenueInput = {
  name: string;
  address: string;
  state?: string;
  postalCode: string;
  city: string;
  country: string;
  description?: string;
  imageUrl?: string
};
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

// interface Like {
//   id: number;
//   senderId: number;
//   receiverId: number;
//   sentAt: Date;
//   sender: User;
//   receiver: User;
// }

// interface Photo {
//   id: number;
//   userId: number;
//   url: string;
//   uploadedAt: Date;
//   user: User;
// }
