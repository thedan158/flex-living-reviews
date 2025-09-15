import mongoose, { Schema, Document } from 'mongoose';
import { Review } from '../../../../types/review';

export interface IReview extends Document {
  id: string;
  listingId?: string;
  rating: number | null;
  comment: string;
  guestName: string;
  date: string;
  reviewType: 'host-to-guest' | 'guest-to-host' | 'automatic';
  channel: 'hostaway' | 'airbnb' | 'booking' | 'direct';
  source: string;
  normalizedRating?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  approved?: boolean;
  status?: 'published' | 'pending' | 'rejected';
  reviewCategory?: Array<{
    category: string;
    rating: number;
  }>;
  listingName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewCategorySchema = new Schema({
  category: { type: String, required: true },
  rating: { type: Number, required: true }
}, { _id: false });

const ReviewSchema = new Schema<IReview>({
  id: { type: String, required: true, unique: true },
  listingId: { type: String },
  rating: { type: Number, default: null },
  comment: { type: String, required: true },
  guestName: { type: String, required: true },
  date: { type: String, required: true },
  reviewType: {
    type: String,
    required: true,
    enum: ['host-to-guest', 'guest-to-host', 'automatic']
  },
  channel: {
    type: String,
    required: true,
    enum: ['hostaway', 'airbnb', 'booking', 'direct']
  },
  source: { type: String, required: true },
  normalizedRating: { type: Number },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative']
  },
  approved: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['published', 'pending', 'rejected'],
    default: 'pending'
  },
  reviewCategory: [ReviewCategorySchema],
  listingName: { type: String }
}, {
  timestamps: true,
  collection: 'reviews'
});

// Create indexes for better query performance
ReviewSchema.index({ listingId: 1 });
ReviewSchema.index({ channel: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ approved: 1 });
ReviewSchema.index({ date: -1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
