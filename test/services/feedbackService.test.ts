import prisma from '../../src/config/prisma';
import feedbackService from '../../src/services/feedbackService';
import {
  FeedbackFilters
} from '../../src/types/feedbackTypes';
import { PaginationParams } from '../../src/types/types';

// Mock dependencies
jest.mock('../../src/config/prisma', () => ({
  feedback: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

describe('Feedback Service Functions', () => {
  let prismaMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = {
      feedback: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      },
    };
    (prisma as any).feedback = prismaMock.feedback;
  });

  it('should be defined', () => {
    expect(feedbackService).toBeDefined();
  });

  // --- Test cases for createFeedback ---
  describe('createFeedback', () => {
    const userId = 'user123';
    const giverId = 'giver123';
    const text = 'Great feedback!';
    const mockFeedback = {
      id: 'feedback123',
      userId,
      giverId,
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new feedback', async () => {
      prismaMock.feedback.create.mockResolvedValue(mockFeedback);

      const result = await feedbackService.createFeedback(
        userId,
        giverId,
        text
      );

      expect(prismaMock.feedback.create).toHaveBeenCalledWith({
        data: {
          userId,
          giverId,
          text,
        },
      });
      expect(result).toEqual(mockFeedback);
    });

    it('should throw Error if feedback creation fails', async () => {
      prismaMock.feedback.create.mockResolvedValue(null);
      await expect(
        feedbackService.createFeedback(userId, giverId, text)
      ).rejects.toThrow(Error);
    });
  });

  // --- Test cases for getFeedbackReceived ---
  describe('getFeedbackReceived', () => {
    const userId = 'user123';
    const mockFeedbacks = [
      {
        id: 'feedback1',
        userId,
        giverId: 'giver1',
        text: 'Feedback 1',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: 'feedback2',
        userId,
        giverId: 'giver2',
        text: 'Feedback 2',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
    ];
    const mockTotal = 2;

    it('should get feedback received with pagination and filtering', async () => {
      prismaMock.feedback.findMany.mockResolvedValue(mockFeedbacks);
      prismaMock.feedback.count.mockResolvedValue(mockTotal);

      const filters: FeedbackFilters = {
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

      const result = await feedbackService.getFeedbackReceived(
        userId,
        filters,
        pagination
      );

      expect(prismaMock.feedback.findMany).toHaveBeenCalledWith({
        where: {
          userId,
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
      expect(prismaMock.feedback.count).toHaveBeenCalledWith({
        where: {
          userId,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
      });
      expect(result).toEqual({
        feedbacks: mockFeedbacks,
        total: mockTotal,
      });
    });
  });

  // --- Test cases for getFeedbackGiven ---
  describe('getFeedbackGiven', () => {
    const giverId = 'giver123';
    const mockFeedbacks = [
      {
        id: 'feedback1',
        userId: 'user1',
        giverId,
        text: 'Feedback 1',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      },
      {
        id: 'feedback2',
        userId: 'user2',
        giverId,
        text: 'Feedback 2',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
      },
    ];
    const mockTotal = 2;

    it('should get feedback given with pagination and filtering', async () => {
      prismaMock.feedback.findMany.mockResolvedValue(mockFeedbacks);
      prismaMock.feedback.count.mockResolvedValue(mockTotal);

      const filters: FeedbackFilters = {
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

      const result = await feedbackService.getFeedbackGiven(
        giverId,
        filters,
        pagination
      );

      expect(prismaMock.feedback.findMany).toHaveBeenCalledWith({
        where: {
          giverId,
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
      expect(prismaMock.feedback.count).toHaveBeenCalledWith({
        where: {
          giverId,
          createdAt: {
            gte: filters.dateRange?.start,
            lte: filters.dateRange?.end,
          },
        },
      });
      expect(result).toEqual({
        feedbacks: mockFeedbacks,
        total: mockTotal,
      });
    });
  });

  // --- Test cases for deleteFeedback ---
  describe('deleteFeedback', () => {
    const feedbackId = 'feedback123';

    it('should delete a feedback', async () => {
      prismaMock.feedback.delete.mockResolvedValue({ id: feedbackId });

      await feedbackService.deleteFeedback(feedbackId);

      expect(prismaMock.feedback.delete).toHaveBeenCalledWith({
        where: { id: feedbackId },
      });
    });
  });

  // --- Test cases for updateFeedback ---
  describe('updateFeedback', () => {
    const feedbackId = 'feedback123';
    const text = 'Updated feedback';
    const mockUpdatedFeedback = {
      id: feedbackId,
      userId: 'user123',
      giverId: 'giver123',
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a feedback', async () => {
      prismaMock.feedback.update.mockResolvedValue(mockUpdatedFeedback);

      const result = await feedbackService.updateFeedback(feedbackId, text);

      expect(prismaMock.feedback.update).toHaveBeenCalledWith({
        where: { id: feedbackId },
        data: { text },
      });
      expect(result).toEqual(mockUpdatedFeedback);
    });

    it('should throw Error if feedback update fails', async () => {
      prismaMock.feedback.update.mockResolvedValue(null);
      await expect(
        feedbackService.updateFeedback(feedbackId, text)
      ).rejects.toThrow(Error);
    });
  });
});
