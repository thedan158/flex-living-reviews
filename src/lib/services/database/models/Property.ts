import mongoose, { Schema, Document } from 'mongoose';
import { Property } from '../../../../types/property';

export interface IProperty extends Document {
  id: string;
  name: string;
  location: string;
  rating?: number; // Calculated dynamically from reviews
  description: string;
  amenities: string[];
  images: string[];
  slug?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5 }, // Optional - calculated from reviews
  description: { type: String, required: true },
  amenities: [{ type: String }],
  images: [{ type: String }],
  slug: { type: String },
  price: { type: Number },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  maxGuests: { type: Number }
}, {
  timestamps: true,
  collection: 'properties'
});

// Create indexes for better query performance
PropertySchema.index({ location: 1 });
PropertySchema.index({ rating: -1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ name: 'text', description: 'text' }); // Text search on name and description

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
