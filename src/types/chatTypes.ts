import { Chat } from '@prisma/client';

export interface ChatFilters {
  isActive?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ChatInput {
  isActive?: boolean;
}

export interface ChatResponse {
  chats: Chat[];
  total: number;
}
