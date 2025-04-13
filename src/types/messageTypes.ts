import { Message } from '@prisma/client';

export interface MessageInput {
  chatId: string;
  senderId: string;
  content: string;
}

export interface MessageResponse {
  messages: Message[];
  total: number;
}

export interface MessageFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface MessagePagination {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
