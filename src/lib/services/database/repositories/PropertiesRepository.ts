import dbConnect from '../connection';
import PropertyModel, { IProperty } from '../models/Property';
import { Property, PropertyFilter } from '../../../../types/property';

export class PropertiesRepository {
  private async connect() {
    await dbConnect();
  }

  async create(propertyData: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProperty> {
    await this.connect();

    const property = new PropertyModel(propertyData);
    return await property.save();
  }

  async findById(id: string): Promise<IProperty | null> {
    await this.connect();

    return await PropertyModel.findOne({ id });
  }

  async findBySlug(slug: string): Promise<IProperty | null> {
    await this.connect();

    return await PropertyModel.findOne({ slug });
  }

  async findAll(filter: PropertyFilter = {}): Promise<IProperty[]> {
    await this.connect();

    const query: any = {};

    if (filter.location) {
      query.location = { $regex: filter.location, $options: 'i' };
    }

    if (filter.minRating !== undefined) {
      query.rating = { ...query.rating, $gte: filter.minRating };
    }

    if (filter.maxPrice !== undefined) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }

    if (filter.amenities && filter.amenities.length > 0) {
      query.amenities = { $in: filter.amenities };
    }

    let mongoQuery = PropertyModel.find(query);

    // Default sort by rating descending, then by name
    mongoQuery = mongoQuery.sort({ rating: -1, name: 1 });

    if (filter.skip) mongoQuery = mongoQuery.skip(filter.skip);
    if (filter.limit) mongoQuery = mongoQuery.limit(filter.limit);

    return await mongoQuery.exec();
  }

  async updateById(id: string, updateData: Partial<Omit<Property, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IProperty | null> {
    await this.connect();

    return await PropertyModel.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteById(id: string): Promise<boolean> {
    await this.connect();

    const result = await PropertyModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async count(filter: PropertyFilter = {}): Promise<number> {
    await this.connect();

    const query: any = {};

    if (filter.location) {
      query.location = { $regex: filter.location, $options: 'i' };
    }

    if (filter.minRating !== undefined) {
      query.rating = { ...query.rating, $gte: filter.minRating };
    }

    if (filter.maxPrice !== undefined) {
      query.price = { ...query.price, $lte: filter.maxPrice };
    }

    if (filter.amenities && filter.amenities.length > 0) {
      query.amenities = { $in: filter.amenities };
    }

    return await PropertyModel.countDocuments(query);
  }

  async bulkCreate(properties: Omit<Property, '_id' | 'createdAt' | 'updatedAt'>[]): Promise<IProperty[]> {
    await this.connect();

    const propertyDocs = properties.map(property => new PropertyModel(property));
    return await PropertyModel.insertMany(propertyDocs);
  }

  async search(query: string, filter: PropertyFilter = {}): Promise<IProperty[]> {
    await this.connect();

    const searchQuery = {
      $text: { $search: query },
      ...filter
    };

    let mongoQuery = PropertyModel.find(searchQuery, { score: { $meta: 'textScore' } });

    // Sort by text score and then by rating
    mongoQuery = mongoQuery.sort({
      score: { $meta: 'textScore' },
      rating: -1
    });

    if (filter.skip) mongoQuery = mongoQuery.skip(filter.skip);
    if (filter.limit) mongoQuery = mongoQuery.limit(filter.limit);

    return await mongoQuery.exec();
  }

  async getPropertiesByLocation(location: string, options: { limit?: number; skip?: number } = {}): Promise<IProperty[]> {
    return await this.findAll({
      location,
      ...options
    });
  }

  async getTopRated(limit: number = 10): Promise<IProperty[]> {
    await this.connect();

    return await PropertyModel.find({})
      .sort({ rating: -1 })
      .limit(limit)
      .exec();
  }
}

// Export singleton instance
export const propertiesRepository = new PropertiesRepository();
