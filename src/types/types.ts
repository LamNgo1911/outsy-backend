import { EventStatus, EventType, LikeStatus, Prisma, Status } from "@prisma/client"; // ✅ Import Status properly

// User Type (For Reading Data)
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

  // Activity & Preferences
  onlineStatus: boolean;
  preferences: Prisma.JsonValue; // ✅ Correct for reading
  createdAt: Date;
  updatedAt: Date;
  igUrl?: string | null;
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

  // Activity & Preferences
  onlineStatus?: boolean;
  preferences: Prisma.InputJsonValue; // ✅ Correct for writing
  createdAt: Date;
  updatedAt: Date;
  igUrl?: string | null;
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

  // Activity & Preferences
  onlineStatus?: boolean;
  preferences?: Prisma.InputJsonValue; // ✅ Correct for writing
  igUrl?: string | null;
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
  name: string;
  description: string | null;
  type: EventType;
  date: Date;
  venueId: string;
  status: EventStatus;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
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

export interface EventLike {
  userId: string;
  eventId: string;
  createdAt: Date;
  status: LikeStatus;
  message: string | null;
}

export interface EventLikeInput {
  userId: string;
  eventId: string;
  message: string;
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
