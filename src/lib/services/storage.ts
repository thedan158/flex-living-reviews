import fs from 'fs';
import path from 'path';

interface ReviewApproval {
  [reviewId: string]: boolean;
}

class StorageService {
  private approvalFilePath: string;

  constructor() {
    // Use a data directory in the project root for production persistence
    const dataDir = path.join(process.cwd(), 'data');
    this.approvalFilePath = path.join(dataDir, 'review-approvals.json');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Initialize file if it doesn't exist
    if (!fs.existsSync(this.approvalFilePath)) {
      fs.writeFileSync(this.approvalFilePath, JSON.stringify({}, null, 2));
    }
  }

  private readApprovals(): ReviewApproval {
    try {
      const data = fs.readFileSync(this.approvalFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading approval data:', error);
      return {};
    }
  }

  private writeApprovals(approvals: ReviewApproval): void {
    try {
      fs.writeFileSync(this.approvalFilePath, JSON.stringify(approvals, null, 2));
    } catch (error) {
      console.error('Error writing approval data:', error);
    }
  }

  getApprovalStatus(reviewId: string): boolean {
    const approvals = this.readApprovals();
    return approvals[reviewId] || false;
  }

  setApprovalStatus(reviewId: string, approved: boolean): void {
    const approvals = this.readApprovals();
    approvals[reviewId] = approved;
    this.writeApprovals(approvals);
  }

  getAllApprovals(): ReviewApproval {
    return this.readApprovals();
  }
}

// Export singleton instance
export const storageService = new StorageService();
