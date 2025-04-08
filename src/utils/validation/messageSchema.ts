import z from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
    senderId: z.string().min(1, 'Sender ID is required'),
    content: z.string().min(1, 'Message content is required'),
  }),
});

export const markMessagesAsReadSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
    userId: z.string().min(1, 'User ID is required'),
  }),
});

export const chatIdSchema = z.object({
  params: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
  }),
});
