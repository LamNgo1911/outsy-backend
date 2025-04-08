import { Feedback } from '@prisma/client';

export interface FeedbackFilters {
  userId?: string;
  giverId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface FeedbackInput {
  userId: string;
  giverId: string;
  text: string;
}

export interface FeedbackResponse {
  feedbacks: Feedback[];
  total: number;
}
