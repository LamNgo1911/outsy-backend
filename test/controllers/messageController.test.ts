import { NextFunction, Request, Response } from 'express';
import {
  sendMessage,
  markMessagesAsRead,
  getMessagesByChat,
} from '../../src/controllers/messageController';
import messageService from '../../src/services/messageService';
import { MessageInput } from '../../src/types/messageTypes';
import { Result } from '../../src/utils/Result';

// Mock the messageService
jest.mock('../../src/services/messageService');

const mockRequest = (body = {}, params = {}, query = {}, user = null) => {
  const req = {} as Request;
  req.body = body;
  req.params = params;
  req.query = query;
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

const mockNext = () => jest.fn() as NextFunction;

describe('Message Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const mockMessageId = 'msg123';
  const mockChatId = 'chat123';
  const mockSenderId = 'sender123';
  const mockMessage = {
    id: mockMessageId,
    chatId: mockChatId,
    senderId: mockSenderId,
    content: 'Test message',
    sentAt: new Date('2023-01-01'),
    isRead: false,
  };

  const mockMessageInput: MessageInput = {
    chatId: mockChatId,
    senderId: mockSenderId,
    content: 'Test message',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a new message', async () => {
      req = mockRequest(mockMessageInput);
      const createdMessage = {
        ...mockMessageInput,
        id: mockMessageId,
        sentAt: new Date('2023-01-01'),
        isRead: false,
      };
      const expectedResponse = Result.success(createdMessage, 201);
      const { statusCode, body } = expectedResponse.toResponse();

      (messageService.sendMessage as jest.Mock).mockImplementation(
        (chatId, senderId, content) => {
          return Promise.resolve({
            ...mockMessageInput,
            id: mockMessageId,
            sentAt: new Date('2023-01-01'),
            isRead: false,
          });
        }
      );
      res = mockResponse();

      await sendMessage(req, res);
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        mockMessageInput.chatId,
        mockMessageInput.senderId,
        mockMessageInput.content
      );
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (messageService.sendMessage as jest.Mock).mockRejectedValue(error);

      req = mockRequest(mockMessageInput);
      res = mockResponse();

      await sendMessage(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to send message',
      });
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      const markReadInput = {
        chatId: mockChatId,
        userId: mockSenderId,
      };
      req = mockRequest(markReadInput);
      const expectedResponse = Result.success(null, 200);
      const { statusCode, body } = expectedResponse.toResponse();

      (messageService.markMessagesAsRead as jest.Mock).mockResolvedValue(
        undefined
      );
      res = mockResponse();

      await markMessagesAsRead(req, res);
      expect(messageService.markMessagesAsRead).toHaveBeenCalledWith(
        markReadInput.chatId,
        markReadInput.userId
      );
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (messageService.markMessagesAsRead as jest.Mock).mockRejectedValue(error);

      req = mockRequest({ chatId: mockChatId, userId: mockSenderId });
      res = mockResponse();

      await markMessagesAsRead(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to mark messages as read',
      });
    });
  });

  describe('getMessagesByChat', () => {
    it('should get messages by chat', async () => {
      const mockResult = {
        messages: [mockMessage],
        total: 1,
      };
      const expectedResponse = Result.success(mockResult);
      const { statusCode, body } = expectedResponse.toResponse();

      (messageService.getMessagesByChat as jest.Mock).mockResolvedValue(
        mockResult
      );
      req = mockRequest({}, { chatId: mockChatId });
      res = mockResponse();

      await getMessagesByChat(req, res);
      expect(messageService.getMessagesByChat).toHaveBeenCalledWith(mockChatId);
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (messageService.getMessagesByChat as jest.Mock).mockRejectedValue(error);

      req = mockRequest({}, { chatId: mockChatId });
      res = mockResponse();

      await getMessagesByChat(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to retrieve messages',
      });
    });
  });
});
