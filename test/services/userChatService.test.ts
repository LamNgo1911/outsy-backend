import userChatService from '../../src/services/userChatService';
import prisma from '../../src/config/prisma';
import { UserChat } from '@prisma/client';
import {
  UserChatInput,
  UserChatFilters,
  UserChatResponse,
} from '../../src/types/userChatTypes';
import { PaginationParams } from '../../src/types/types';
import { BadRequestError, NotFoundError } from '../../src/error/apiError';

// Mock dependencies
jest.mock('../../src/config/prisma', () => ({
  userChat: {
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  chat: {
    findUnique: jest.fn(),
  },
}));

describe('UserChat Service Functions', () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = {
      userChat: {
        create: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      chat: {
        findUnique: jest.fn(),
      },
    };
    (prisma as any).userChat = prismaMock.userChat;
    (prisma as any).user = prismaMock.user;
    (prisma as any).chat = prismaMock.chat;
  });

  it('should be defined', () => {
    expect(userChatService).toBeDefined();
  });

  // --- Test cases for addUserToChat ---
  describe('addUserToChat', () => {
    const mockUserChatInput: UserChatInput = {
      userId: 'user123',
      chatId: 'chat123',
    };
    const mockUserChat = {
      id: 'userChat123',
      ...mockUserChatInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should add a user to a chat', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: mockUserChatInput.userId,
      });
      prismaMock.chat.findUnique.mockResolvedValue({
        id: mockUserChatInput.chatId,
      });
      prismaMock.userChat.findUnique.mockResolvedValue(null);
      prismaMock.userChat.create.mockResolvedValue(mockUserChat);

      const result = await userChatService.addUserToChat(mockUserChatInput);

      expect(prismaMock.userChat.create).toHaveBeenCalledWith({
        data: mockUserChatInput,
      });
      expect(result).toEqual(mockUserChat);
    });

    it('should throw Error if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.chat.findUnique.mockResolvedValue({
        id: mockUserChatInput.chatId,
      });

      await expect(
        userChatService.addUserToChat(mockUserChatInput)
      ).rejects.toThrow('User or Chat not found');
    });

    it('should throw Error if chat is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: mockUserChatInput.userId,
      });
      prismaMock.chat.findUnique.mockResolvedValue(null);

      await expect(
        userChatService.addUserToChat(mockUserChatInput)
      ).rejects.toThrow('User or Chat not found');
    });

    it('should throw Error if user is already in chat', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: mockUserChatInput.userId,
      });
      prismaMock.chat.findUnique.mockResolvedValue({
        id: mockUserChatInput.chatId,
      });
      prismaMock.userChat.findUnique.mockResolvedValue(mockUserChat);

      await expect(
        userChatService.addUserToChat(mockUserChatInput)
      ).rejects.toThrow('User is already in the chat');
    });
  });

  // --- Test cases for removeUserFromChat ---
  describe('removeUserFromChat', () => {
    const mockUserChatInput: UserChatInput = {
      userId: 'user123',
      chatId: 'chat123',
    };
    const mockUserChat = {
      id: 'userChat123',
      ...mockUserChatInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should remove a user from a chat', async () => {
      prismaMock.userChat.findUnique.mockResolvedValue(mockUserChat);
      prismaMock.userChat.delete.mockResolvedValue(mockUserChat);

      await userChatService.removeUserFromChat(mockUserChatInput);

      expect(prismaMock.userChat.delete).toHaveBeenCalledWith({
        where: {
          userId_chatId: mockUserChatInput,
        },
      });
    });

    it('should throw Error if user is not in chat', async () => {
      prismaMock.userChat.findUnique.mockResolvedValue(null);

      await expect(
        userChatService.removeUserFromChat(mockUserChatInput)
      ).rejects.toThrow('User is not in the chat');
    });
  });

  // --- Test cases for getUsersByChatId ---
  describe('getUsersByChatId', () => {
    const chatId = 'chat123';
    const mockUserChats = [
      {
        id: 'userChat1',
        userId: 'user1',
        chatId: chatId,
        createdAt: new Date('2023-01-01'),
        user: {
          id: 'user1',
          name: 'User 1',
        },
      },
      {
        id: 'userChat2',
        userId: 'user2',
        chatId: chatId,
        createdAt: new Date('2023-01-02'),
        user: {
          id: 'user2',
          name: 'User 2',
        },
      },
    ];
    const mockTotal = 2;

    it('should get users by chat id with pagination and filtering', async () => {
      prismaMock.userChat.findMany.mockResolvedValue(mockUserChats);
      prismaMock.userChat.count.mockResolvedValue(mockTotal);

      const filters: UserChatFilters = {
        dateRange: {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-31'),
        },
      };
      const pagination: PaginationParams = {
        page: 1,
        limit: 10,
      };

      const result = await userChatService.getUsersByChatId(
        chatId,
        filters,
        pagination
      );

      expect(prismaMock.userChat.findMany).toHaveBeenCalledWith({
        where: {
          chatId,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
        skip: 0,
        take: pagination.limit,
        include: {
          user: true,
        },
      });
      expect(prismaMock.userChat.count).toHaveBeenCalledWith({
        where: {
          chatId,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
      });
      expect(result).toEqual({
        users: mockUserChats.map((userChat) => userChat.user),
        total: mockTotal,
      });
    });
  });

  // --- Test cases for getChatsByUserId ---
  describe('getChatsByUserId', () => {
    const userId = 'user123';
    const mockUserChats = [
      {
        id: 'userChat1',
        userId: userId,
        chatId: 'chat1',
        createdAt: new Date('2023-01-01'),
        chat: {
          id: 'chat1',
          name: 'Chat 1',
        },
      },
      {
        id: 'userChat2',
        userId: userId,
        chatId: 'chat2',
        createdAt: new Date('2023-01-02'),
        chat: {
          id: 'chat2',
          name: 'Chat 2',
        },
      },
    ];
    const mockTotal = 2;

    it('should get chats by user id with pagination and filtering', async () => {
      prismaMock.userChat.findMany.mockResolvedValue(mockUserChats);
      prismaMock.userChat.count.mockResolvedValue(mockTotal);

      const filters: UserChatFilters = {
        dateRange: {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-31'),
        },
      };
      const pagination: PaginationParams = {
        page: 1,
        limit: 10,
      };

      const result = await userChatService.getChatsByUserId(
        userId,
        filters,
        pagination
      );

      expect(prismaMock.userChat.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
        skip: 0,
        take: pagination.limit,
        include: {
          chat: true,
        },
      });
      expect(prismaMock.userChat.count).toHaveBeenCalledWith({
        where: {
          userId,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
      });
      expect(result).toEqual({
        chats: mockUserChats.map((userChat) => userChat.chat),
        total: mockTotal,
      });
    });
  });
});
