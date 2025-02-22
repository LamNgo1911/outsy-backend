export interface User {
  id: string;
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
  interests: string[];
  status: "active" | "banned" | "inactive";
  chats: Chat[];

  // Activity & Preferences
  onlineStatus: boolean;
  preferences: Record<string, any>; // Define a stricter type if needed
  createdAt: Date;
  updatedAt: Date;
  igUrl?: string;
}

export interface Chat {
  id: string;
  users: User[];
  messages: Message[];
}

export interface Message {
  id: number;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;
  chat: Chat;
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
