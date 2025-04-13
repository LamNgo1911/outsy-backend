import { User, Chat } from '@prisma/client';

export interface UserChatInput {
  userId: string;
  chatId: string;
}

export interface UserChatResponse {
  users?: User[];
  chats?: Chat[];
  total: number;
}

export interface UserChatFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface UserChatPagination {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
