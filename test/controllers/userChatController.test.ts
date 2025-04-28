import { NextFunction, Request, Response } from 'express';
import {
  addUserToChat,
  removeUserFromChat,
  getUsersByChatId,
  getChatsByUserId,
} from '../../src/controllers/userChatController';
import userChatService from '../../src/services/userChatService';
import { UserChatInput } from '../../src/types/userChatTypes';
import { Result } from '../../src/utils/Result';

// Mock the userChatService
jest.mock('../../src/services/userChatService');

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

describe('UserChat Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const mockUserId = 'user123';
  const mockChatId = 'chat123';
  const mockUserChat = {
    userId: mockUserId,
    chatId: mockChatId,
    createdAt: new Date('2023-01-01'),
  };

  const mockUser = {
    id: mockUserId,
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockChat = {
    id: mockChatId,
    isActive: true,
    createdAt: new Date('2023-01-01'),
  };

  const mockUserChatInput: UserChatInput = {
    userId: mockUserId,
    chatId: mockChatId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addUserToChat', () => {
    it('should add a user to a chat', async () => {
      const expectedResponse = Result.success(mockUserChat, 201);
      const { statusCode, body } = expectedResponse.toResponse();

      (userChatService.addUserToChat as jest.Mock).mockResolvedValue(
        mockUserChat
      );
      req = mockRequest(mockUserChatInput);
      res = mockResponse();
      next = mockNext();

      await addUserToChat(req, res, next);
      expect(userChatService.addUserToChat).toHaveBeenCalledWith(
        mockUserChatInput
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(Result.success(mockUserChat));
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (userChatService.addUserToChat as jest.Mock).mockRejectedValue(error);

      req = mockRequest(mockUserChatInput);
      res = mockResponse();
      next = mockNext();

      await addUserToChat(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('removeUserFromChat', () => {
    it('should remove a user from a chat', async () => {
      const expectedResponse = Result.success(null, 200);
      const { statusCode, body } = expectedResponse.toResponse();

      (userChatService.removeUserFromChat as jest.Mock).mockResolvedValue(
        undefined
      );
      req = mockRequest(mockUserChatInput);
      res = mockResponse();
      next = mockNext();

      await removeUserFromChat(req, res, next);
      expect(userChatService.removeUserFromChat).toHaveBeenCalledWith(
        mockUserChatInput
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Result.success(null));
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (userChatService.removeUserFromChat as jest.Mock).mockRejectedValue(
        error
      );

      req = mockRequest(mockUserChatInput);
      res = mockResponse();
      next = mockNext();

      await removeUserFromChat(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUsersByChatId', () => {
    it('should get all users in a chat with pagination and filtering', async () => {
      const mockResult = {
        users: [mockUser],
        total: 1,
      };
      const expectedResponse = Result.success(mockResult);
      const { statusCode, body } = expectedResponse.toResponse();

      (userChatService.getUsersByChatId as jest.Mock).mockResolvedValue(
        mockResult
      );
      req = mockRequest(
        {},
        { chatId: mockChatId },
        {
          page: '1',
          limit: '10',
          start: '2023-01-01',
          end: '2023-01-31',
        }
      );
      res = mockResponse();
      next = mockNext();

      await getUsersByChatId(req, res, next);
      expect(userChatService.getUsersByChatId).toHaveBeenCalledWith(
        mockChatId,
        {
          dateRange: {
            start: new Date('2023-01-01'),
            end: new Date('2023-01-31'),
          },
        },
        {
          page: 1,
          limit: 10,
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Result.success(mockResult));
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (userChatService.getUsersByChatId as jest.Mock).mockRejectedValue(error);

      req = mockRequest({}, { chatId: mockChatId });
      res = mockResponse();
      next = mockNext();

      await getUsersByChatId(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getChatsByUserId', () => {
    it('should get all chats for a user with pagination and filtering', async () => {
      const mockResult = {
        chats: [mockChat],
        total: 1,
      };
      const expectedResponse = Result.success(mockResult);
      const { statusCode, body } = expectedResponse.toResponse();

      (userChatService.getChatsByUserId as jest.Mock).mockResolvedValue(
        mockResult
      );
      req = mockRequest(
        {},
        { userId: mockUserId },
        {
          page: '1',
          limit: '10',
          start: '2023-01-01',
          end: '2023-01-31',
        }
      );
      res = mockResponse();
      next = mockNext();

      await getChatsByUserId(req, res, next);
      expect(userChatService.getChatsByUserId).toHaveBeenCalledWith(
        mockUserId,
        {
          dateRange: {
            start: new Date('2023-01-01'),
            end: new Date('2023-01-31'),
          },
        },
        {
          page: 1,
          limit: 10,
        }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Result.success(mockResult));
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (userChatService.getChatsByUserId as jest.Mock).mockRejectedValue(error);

      req = mockRequest({}, { userId: mockUserId });
      res = mockResponse();
      next = mockNext();

      await getChatsByUserId(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
