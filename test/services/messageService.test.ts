import prisma from '../../src/config/prisma';
import messageService from '../../src/services/messageService';

// Mock dependencies
jest.mock('../../src/config/prisma', () => ({
  message: {
    create: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

describe('Message Service Functions', () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = {
      message: {
        create: jest.fn(),
        updateMany: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };
    (prisma as any).message = prismaMock.message;
  });

  it('should be defined', () => {
    expect(messageService).toBeDefined();
  });

  // --- Test cases for sendMessage ---
  describe('sendMessage', () => {
    const chatId = 'chat123';
    const senderId = 'user123';
    const content = 'Hello, world!';
    const mockMessage = {
      id: 'message123',
      chatId,
      senderId,
      content,
      sentAt: new Date(),
      isRead: false,
    };

    it('should send a new message', async () => {
      prismaMock.message.create.mockResolvedValue(mockMessage);

      const result = await messageService.sendMessage(
        chatId,
        senderId,
        content
      );

      expect(prismaMock.message.create).toHaveBeenCalledWith({
        data: {
          chatId,
          senderId,
          content,
        },
        include: { chat: true },
      });
      expect(result).toEqual(mockMessage);
    });

    it('should throw Error if message creation fails', async () => {
      prismaMock.message.create.mockResolvedValue(null);
      await expect(
        messageService.sendMessage(chatId, senderId, content)
      ).rejects.toThrow(Error);
    });
  });

  // --- Test cases for markMessagesAsRead ---
  describe('markMessagesAsRead', () => {
    const chatId = 'chat123';
    const userId = 'user123';

    it('should mark messages as read', async () => {
      prismaMock.message.updateMany.mockResolvedValue({ count: 2 });

      await messageService.markMessagesAsRead(chatId, userId);

      expect(prismaMock.message.updateMany).toHaveBeenCalledWith({
        where: {
          chatId,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      });
    });
  });

  // --- Test cases for getMessagesByChat ---
  describe('getMessagesByChat', () => {
    const chatId = 'chat123';
    const mockMessages = [
      {
        id: 'message1',
        chatId,
        senderId: 'user1',
        content: 'Message 1',
        sentAt: new Date('2023-01-01'),
        isRead: false,
      },
      {
        id: 'message2',
        chatId,
        senderId: 'user2',
        content: 'Message 2',
        sentAt: new Date('2023-01-02'),
        isRead: true,
      },
    ];
    const mockTotal = 2;

    it('should get messages by chat', async () => {
      prismaMock.message.findMany.mockResolvedValue(mockMessages);
      prismaMock.message.count.mockResolvedValue(mockTotal);

      const result = await messageService.getMessagesByChat(chatId);

      expect(prismaMock.message.findMany).toHaveBeenCalledWith({
        where: { chatId },
        orderBy: { sentAt: 'desc' },
      });
      expect(prismaMock.message.count).toHaveBeenCalledWith({
        where: { chatId },
      });
      expect(result).toEqual({
        messages: mockMessages,
        total: mockTotal,
      });
    });
  });
});
