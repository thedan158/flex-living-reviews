import { reviewRepository } from './database/repositories/ReviewRepository';

interface ReviewApproval {
  [reviewId: string]: boolean;
}

class StorageService {
  async getApprovalStatus(reviewId: string): Promise<boolean> {
    try {
      return await reviewRepository.getApprovalStatus(reviewId);
    } catch (error) {
      console.error('Error getting approval status:', error);
      return false;
    }
  }

  async setApprovalStatus(reviewId: string, approved: boolean): Promise<void> {
    try {
      await reviewRepository.approveReview(reviewId, approved);
    } catch (error) {
      console.error('Error setting approval status:', error);
      throw error;
    }
  }

  async getAllApprovals(): Promise<ReviewApproval> {
    try {
      return await reviewRepository.getAllApprovalStatuses();
    } catch (error) {
      console.error('Error getting all approvals:', error);
      return {};
    }
  }

  // Legacy synchronous methods for backward compatibility
  getApprovalStatusSync(reviewId: string): boolean {
    // This is a fallback that will be removed once all code is updated to async
    console.warn('Using deprecated synchronous method. Please update to use async version.');
    return false;
  }

  setApprovalStatusSync(reviewId: string, approved: boolean): void {
    // This is a fallback that will be removed once all code is updated to async
    console.warn('Using deprecated synchronous method. Please update to use async version.');
  }

  getAllApprovalsSync(): ReviewApproval {
    // This is a fallback that will be removed once all code is updated to async
    console.warn('Using deprecated synchronous method. Please update to use async version.');
    return {};
  }
}

// Export singleton instance
export const storageService = new StorageService();
