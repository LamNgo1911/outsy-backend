import { NextFunction, Request, Response } from 'express';
import {
  getChats,
  getChatById,
  createChat,
  updateChat,
  deleteChat,
} from '../../src/controllers/chatController';
import chatService from '../../src/services/chatService';
import { ChatInput } from '../../src/types/chatTypes';
import { Result } from '../../src/utils/Result';

// Mock the chatService
jest.mock('../../src/services/chatService');

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

describe('Chat Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const mockChatId = 'chat123';
  const mockChat = {
    id: mockChatId,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockChatInput: ChatInput = {
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChats', () => {
    it('should get all chats with filters and pagination', async () => {
      const mockResult = {
        chats: [mockChat],
        total: 1,
      };
      const expectedResponse = Result.success(mockResult);
      const { statusCode, body } = expectedResponse.toResponse();

      (chatService.getChats as jest.Mock).mockResolvedValue(mockResult);
      req = mockRequest(
        {},
        {},
        {
          isActive: 'true',
          dateRange: '2023-01-01,2023-01-31',
          page: '1',
          limit: '10',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      res = mockResponse();
      next = mockNext();

      await getChats(req, res, next);
      expect(chatService.getChats).toHaveBeenCalledWith(
        {
          isActive: true,
          dateRange: {
            start: new Date('2023-01-01'),
            end: new Date('2023-01-31'),
          },
        },
        {
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }
      );
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (chatService.getChats as jest.Mock).mockRejectedValue(error);

      req = mockRequest();
      res = mockResponse();
      next = mockNext();

      await getChats(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getChatById', () => {
    it('should get a chat by id', async () => {
      const expectedResponse = Result.success(mockChat);
      const { statusCode, body } = expectedResponse.toResponse();

      (chatService.getChatById as jest.Mock).mockResolvedValue(mockChat);
      req = mockRequest({}, { id: mockChatId });
      res = mockResponse();
      next = mockNext();

      await getChatById(req, res, next);
      expect(chatService.getChatById).toHaveBeenCalledWith(mockChatId);
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (chatService.getChatById as jest.Mock).mockRejectedValue(error);

      req = mockRequest({}, { id: mockChatId });
      res = mockResponse();
      next = mockNext();

      await getChatById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createChat', () => {
    it('should create a new chat', async () => {
      const expectedResponse = Result.success(mockChat, 201);
      const { statusCode, body } = expectedResponse.toResponse();

      (chatService.createChat as jest.Mock).mockResolvedValue(mockChat);
      req = mockRequest();
      res = mockResponse();
      next = mockNext();

      await createChat(req, res, next);
      expect(chatService.createChat).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (chatService.createChat as jest.Mock).mockRejectedValue(error);

      req = mockRequest();
      res = mockResponse();
      next = mockNext();

      await createChat(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateChat', () => {
    it('should update a chat', async () => {
      const expectedResponse = Result.success(mockChat);
      const { statusCode, body } = expectedResponse.toResponse();

      (chatService.updateChat as jest.Mock).mockResolvedValue(mockChat);
      req = mockRequest(mockChatInput, { id: mockChatId });
      res = mockResponse();
      next = mockNext();

      await updateChat(req, res, next);
      expect(chatService.updateChat).toHaveBeenCalledWith(
        mockChatId,
        mockChatInput
      );
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (chatService.updateChat as jest.Mock).mockRejectedValue(error);

      req = mockRequest(mockChatInput, { id: mockChatId });
      res = mockResponse();
      next = mockNext();

      await updateChat(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteChat', () => {
    it('should delete a chat', async () => {
      const expectedResponse = Result.success(null, 204);
      const { statusCode, body } = expectedResponse.toResponse();

      (chatService.deleteChat as jest.Mock).mockResolvedValue(undefined);
      req = mockRequest({}, { id: mockChatId });
      res = mockResponse();
      next = mockNext();

      await deleteChat(req, res, next);
      expect(chatService.deleteChat).toHaveBeenCalledWith(mockChatId);
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (chatService.deleteChat as jest.Mock).mockRejectedValue(error);

      req = mockRequest({}, { id: mockChatId });
      res = mockResponse();
      next = mockNext();

      await deleteChat(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
