import prisma from '../../src/config/prisma';
import chatService from '../../src/services/chatService';
import { ChatFilters, ChatInput } from '../../src/types/chatTypes';
import { PaginationParams } from '../../src/types/types';

// Mock dependencies
jest.mock('../../src/config/prisma', () => ({
  chat: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

describe('Chat Service Functions', () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = {
      chat: {
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };
    (prisma as any).chat = prismaMock.chat;
  });

  it('should be defined', () => {
    expect(chatService).toBeDefined();
  });

  // --- Test cases for createChat ---
  describe('createChat', () => {
    const mockChat = {
      id: 'chat123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new chat', async () => {
      prismaMock.chat.create.mockResolvedValue(mockChat);

      const result = await chatService.createChat();

      expect(prismaMock.chat.create).toHaveBeenCalledWith({
        data: {},
      });
      expect(result).toEqual(mockChat);
    });

    it('should throw Error if chat creation fails', async () => {
      prismaMock.chat.create.mockResolvedValue(null);
      await expect(chatService.createChat()).rejects.toThrow(Error);
    });
  });

  // --- Test cases for updateChat ---
  describe('updateChat', () => {
    const chatId = 'chat123';
    const updateData: ChatInput = {
      isActive: false,
    };
    const mockUpdatedChat = {
      id: chatId,
      ...updateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a chat', async () => {
      prismaMock.chat.update.mockResolvedValue(mockUpdatedChat);

      const result = await chatService.updateChat(chatId, updateData);

      expect(prismaMock.chat.update).toHaveBeenCalledWith({
        where: { id: chatId },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedChat);
    });

    it('should throw Error if chat update fails', async () => {
      prismaMock.chat.update.mockResolvedValue(null);
      await expect(chatService.updateChat(chatId, updateData)).rejects.toThrow(
        Error
      );
    });
  });

  // --- Test cases for deleteChat ---
  describe('deleteChat', () => {
    const chatId = 'chat123';

    it('should delete a chat', async () => {
      prismaMock.chat.delete.mockResolvedValue({ id: chatId });

      await chatService.deleteChat(chatId);

      expect(prismaMock.chat.delete).toHaveBeenCalledWith({
        where: { id: chatId },
      });
    });
  });

  // --- Test cases for getChats ---
  describe('getChats', () => {
    const mockChats = [
      {
        id: 'chat1',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: 'chat2',
        isActive: false,
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
    ];
    const mockTotal = 2;

    it('should get chats with pagination and filtering', async () => {
      prismaMock.chat.findMany.mockResolvedValue(mockChats);
      prismaMock.chat.count.mockResolvedValue(mockTotal);

      const filters: ChatFilters = {
        isActive: true,
        dateRange: {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-31'),
        },
      };
      const pagination: PaginationParams = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const result = await chatService.getChats(filters, pagination);

      expect(prismaMock.chat.findMany).toHaveBeenCalledWith({
        where: {
          isActive: filters.isActive,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
        skip: 0,
        take: pagination.limit,
        orderBy: {
          [pagination.sortBy as string]: pagination.sortOrder,
        },
      });
      expect(prismaMock.chat.count).toHaveBeenCalledWith({
        where: {
          isActive: filters.isActive,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
      });
      expect(result).toEqual({
        chats: mockChats,
        total: mockTotal,
      });
    });
  });

  // --- Test cases for getChatById ---
  describe('getChatById', () => {
    const chatId = 'chat123';
    const mockChat = {
      id: chatId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should get a chat by id', async () => {
      prismaMock.chat.findUnique.mockResolvedValue(mockChat);

      const result = await chatService.getChatById(chatId);

      expect(prismaMock.chat.findUnique).toHaveBeenCalledWith({
        where: { id: chatId },
      });
      expect(result).toEqual(mockChat);
    });

    it('should throw Error if chat is not found', async () => {
      prismaMock.chat.findUnique.mockResolvedValue(null);
      await expect(chatService.getChatById(chatId)).rejects.toThrow(Error);
    });
  });
});
