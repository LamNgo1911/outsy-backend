import { NextFunction, Request, Response } from 'express';
import feedbackController from '../../src/controllers/feedbackController';
import feedbackService from '../../src/services/feedbackService';
import { FeedbackInput } from '../../src/types/feedbackTypes';
import { Result } from '../../src/utils/Result';

// Mock the feedbackService
jest.mock('../../src/services/feedbackService');

const mockRequest = (body = {}, params = {}, query = {}, user = null) => {
  const req = {} as Request;
  req.body = body;
  req.params = params;
  req.query = query;
  // req.user = user; // If auth middleware adds user info
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

describe('Feedback Controller', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const mockFeedbackId = 'fb123';
  const mockFeedback = {
    id: mockFeedbackId,
    text: 'Test feedback',
    giverId: 'giver123',
    userId: 'user123',
    lastModifiedAt: new Date('2023-01-01'),
  };

  const mockFeedbackInput: FeedbackInput = {
    text: 'Test feedback',
    giverId: 'giver123',
    userId: 'user123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createFeedback', () => {
    it('should create a new feedback', async () => {
      req = mockRequest(mockFeedbackInput);
      const createdFeedback = {
        ...mockFeedbackInput,
        id: mockFeedbackId,
        lastModifiedAt: new Date('2023-01-01'),
      };
      const expectedResponse = Result.success(createdFeedback, 201);
      const { statusCode, body } = expectedResponse.toResponse();

      (feedbackService.createFeedback as jest.Mock).mockImplementation(
        (userId, giverId, text) => {
          return Promise.resolve({
            ...mockFeedbackInput,
            id: mockFeedbackId,
            lastModifiedAt: new Date('2023-01-01'),
          });
        }
      );
      res = mockResponse();
      next = mockNext();

      await feedbackController.createFeedback(req, res, next);
      expect(feedbackService.createFeedback).toHaveBeenCalledWith(
        mockFeedbackInput.userId,
        mockFeedbackInput.giverId,
        mockFeedbackInput.text
      );
      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (feedbackService.createFeedback as jest.Mock).mockRejectedValue(error);

      await feedbackController.createFeedback(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getFeedbackReceived', () => {
    it('should get feedback received by a user', async () => {
      const mockResult = Result.success({
        feedbacks: [mockFeedback],
        total: 1,
      });
      const { statusCode, body } = mockResult.toResponse();
      (feedbackService.getFeedbackReceived as jest.Mock).mockResolvedValue(
        mockResult.toResponse().body.data
      );

      req = mockRequest({}, { userId: 'user123' });
      res = mockResponse();
      next = mockNext();

      await feedbackController.getFeedbackReceived(req, res, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (feedbackService.getFeedbackReceived as jest.Mock).mockRejectedValue(
        error
      );

      await feedbackController.getFeedbackReceived(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getFeedbackGiven', () => {
    it('should get feedback given by a user', async () => {
      const mockResult = Result.success({
        feedbacks: [mockFeedback],
        total: 1,
      });
      const { statusCode, body } = mockResult.toResponse();
      (feedbackService.getFeedbackGiven as jest.Mock).mockResolvedValue(
        mockResult.toResponse().body.data
      );

      req = mockRequest({}, { userId: 'giver123' });
      res = mockResponse();
      next = mockNext();

      await feedbackController.getFeedbackGiven(req, res, next);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith(body);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (feedbackService.getFeedbackGiven as jest.Mock).mockRejectedValue(error);

      await feedbackController.getFeedbackGiven(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateFeedback', () => {
    it('should update a feedback and return 200', async () => {
      const updatedFeedback = {
        ...mockFeedback,
        text: 'Updated feedback',
      };

      const expectedResponse = { success: true, data: { ...updatedFeedback } };

      (feedbackService.updateFeedback as jest.Mock).mockResolvedValue(
        updatedFeedback
      );

      req = mockRequest({ text: 'Updated feedback' }, { id: mockFeedbackId });
      res = mockResponse();
      next = mockNext();

      await feedbackController.updateFeedback(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      req = mockRequest({ text: 'Updated feedback' }, { id: mockFeedbackId });
      const error = new Error('Test error');
      (feedbackService.updateFeedback as jest.Mock).mockRejectedValue(error);

      await feedbackController.updateFeedback(req, res, next);
      expect(feedbackService.updateFeedback).toHaveBeenCalledWith(
        mockFeedbackId,
        'Updated feedback'
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteFeedback', () => {
    it('should delete a feedback and return 204', async () => {
      const mockResult = Result.success(mockFeedback);
      (feedbackService.deleteFeedback as jest.Mock).mockResolvedValue(
        mockResult
      );

      req = mockRequest({}, { id: mockFeedbackId });
      res = mockResponse();
      next = mockNext();

      await feedbackController.deleteFeedback(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (feedbackService.deleteFeedback as jest.Mock).mockRejectedValue(error);

      await feedbackController.deleteFeedback(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
