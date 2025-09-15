import dbConnect from '../connection';
import ReviewModel, { IReview } from '../models/Review';
import { Review } from '../../../../types/review';

export class ReviewRepository {
  private async connect() {
    await dbConnect();
  }

  async create(reviewData: Omit<Review, '_id'>): Promise<IReview> {
    await this.connect();

    const review = new ReviewModel(reviewData);
    return await review.save();
  }

  async findById(id: string): Promise<IReview | null> {
    await this.connect();

    return await ReviewModel.findOne({ id });
  }

  async findAll(options: {
    listingId?: string;
    channel?: string;
    status?: string;
    approved?: boolean;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  } = {}): Promise<IReview[]> {
    await this.connect();

    const query: any = {};

    if (options.listingId) query.listingId = options.listingId;
    if (options.channel) query.channel = options.channel;
    if (options.status) query.status = options.status;
    if (options.approved !== undefined) query.approved = options.approved;

    let mongoQuery = ReviewModel.find(query);

    if (options.sort) {
      mongoQuery = mongoQuery.sort(options.sort);
    } else {
      mongoQuery = mongoQuery.sort({ date: -1 });
    }

    if (options.skip) mongoQuery = mongoQuery.skip(options.skip);
    if (options.limit) mongoQuery = mongoQuery.limit(options.limit);

    return await mongoQuery.exec();
  }

  async updateById(id: string, updateData: Partial<Omit<Review, '_id'>>): Promise<IReview | null> {
    await this.connect();

    return await ReviewModel.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteById(id: string): Promise<boolean> {
    await this.connect();

    const result = await ReviewModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async approveReview(id: string, approved: boolean = true): Promise<IReview | null> {
    await this.connect();

    return await ReviewModel.findOneAndUpdate(
      { id },
      {
        approved,
        status: approved ? 'published' : 'pending',
        updatedAt: new Date()
      },
      { new: true }
    );
  }

  async getApprovalStatus(id: string): Promise<boolean> {
    await this.connect();

    const review = await ReviewModel.findOne({ id }, { approved: 1 });
    return review?.approved || false;
  }

  async getAllApprovalStatuses(): Promise<Record<string, boolean>> {
    await this.connect();

    const reviews = await ReviewModel.find({}, { id: 1, approved: 1 });
    const approvals: Record<string, boolean> = {};

    reviews.forEach(review => {
      approvals[review.id] = review.approved || false;
    });

    return approvals;
  }

  async count(options: {
    listingId?: string;
    channel?: string;
    status?: string;
    approved?: boolean;
  } = {}): Promise<number> {
    await this.connect();

    const query: any = {};

    if (options.listingId) query.listingId = options.listingId;
    if (options.channel) query.channel = options.channel;
    if (options.status) query.status = options.status;
    if (options.approved !== undefined) query.approved = options.approved;

    return await ReviewModel.countDocuments(query);
  }

  async bulkCreate(reviews: Omit<Review, '_id'>[]): Promise<IReview[]> {
    await this.connect();

    const reviewDocs = reviews.map(review => new ReviewModel(review));
    return await ReviewModel.insertMany(reviewDocs);
  }

  async getReviewsByListing(listingId: string, options: {
    status?: string;
    approved?: boolean;
    limit?: number;
    skip?: number;
  } = {}): Promise<IReview[]> {
    return await this.findAll({
      listingId,
      ...options,
      sort: { date: -1 }
    });
  }

  async getReviewsByChannel(channel: string, options: {
    status?: string;
    approved?: boolean;
    limit?: number;
    skip?: number;
  } = {}): Promise<IReview[]> {
    return await this.findAll({
      channel,
      ...options,
      sort: { date: -1 }
    });
  }
}

// Export singleton instance
export const reviewRepository = new ReviewRepository();
