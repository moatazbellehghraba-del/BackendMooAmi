import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/Review.schema';
import { Salon, SalonDocument } from 'src/schemas/Salon.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewInput } from './dto/update-review.dto';
import { ReviewType } from './entites/review.types';


@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Salon.name) private salonModel: Model<SalonDocument>,
  ) {}

     async createReview(createReviewInput: CreateReviewDto): Promise<ReviewType> {
    // 🔹 CHECK FOR EXISTING REVIEW FIRST
    const existingReview = await this.reviewModel.findOne({
      client: new Types.ObjectId(createReviewInput.clientId),
      salon: new Types.ObjectId(createReviewInput.salonId)
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this salon');
    }

    // 🔹 VALIDATE SALON EXISTS
    const salon = await this.salonModel.findById(createReviewInput.salonId);
    if (!salon) {
      throw new NotFoundException('Salon not found');
    }

    const reviewData = {
      client: new Types.ObjectId(createReviewInput.clientId),
      salon: new Types.ObjectId(createReviewInput.salonId),
      rating: createReviewInput.rating,
      comment: createReviewInput.comment,
    };

    const review = await this.reviewModel.create(reviewData);
    await this.updateSalonRating(createReviewInput.salonId);
    
    return this.convertToGraphQL(review.toObject());
  }

  async updateReview(reviewId: string, updateReviewInput: UpdateReviewInput): Promise<ReviewType> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const updatedReview = await this.reviewModel.findByIdAndUpdate(
      reviewId, 
      updateReviewInput, 
      { new: true }
    ).lean();

    if (!updatedReview) {
      throw new NotFoundException('Review not found after update');
    }

    if (updateReviewInput.rating !== undefined) {
      await this.updateSalonRating(review.salon.toString());
    }

    return this.convertToGraphQL(updatedReview);
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const salonId = review.salon.toString();
    await this.reviewModel.findByIdAndDelete(reviewId);
    await this.updateSalonRating(salonId);
    
    return true;
  }
   //___________________________________Get Reviews of salon ______________________________________.....::::
  async getReviewsBySalon(salonId: string): Promise<ReviewType[]> {
    const reviews = await this.reviewModel
      .find({ salon: new Types.ObjectId(salonId) })
      .populate('client', 'firstName lastName')
     // .populate('salon', 'businessName')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return reviews.map(review => this.convertToGraphQL(review));
  }

  async getReview(reviewId: string): Promise<ReviewType> {
    const review = await this.reviewModel
      .findById(reviewId)
      .populate('client', 'firstName lastName')
      .populate('salon', 'businessName')
      .lean()
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.convertToGraphQL(review);
  }

  async getAllReviews(): Promise<ReviewType[]> {
    const reviews = await this.reviewModel
      .find()
      .populate('client', 'firstName lastName')
      .populate('salon', 'businessName')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return reviews.map(review => this.convertToGraphQL(review));
  }

  private convertToGraphQL(review: any): ReviewType {
    return {
      _id: review._id?.toString(),
      client: review.client?._id?.toString() || review.client?.toString() || review.client,
      salon: review.salon?._id?.toString() || review.salon?.toString() || review.salon,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    } as ReviewType;
  }

  // 🔹 **CORE FUNCTION: Update Salon Rating**
private async updateSalonRating(salonId: string): Promise<void> {
  const ratingStats = await this.reviewModel.aggregate([
    { $match: { salon: new Types.ObjectId(salonId) } },
    {
      $group: {
        _id: '$salon',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
        ratingDistribution: { $push: '$rating' },
      },
    },
  ]);

  if (ratingStats.length > 0) {
    const stats = ratingStats[0];

    // Calculate rating distribution (1–5 stars)
    const distribution: Record<number, number> = {};
    [1, 2, 3, 4, 5].forEach((rating) => {
      const count = stats.ratingDistribution.filter(
        (r: number) => Math.round(r) === rating
      ).length;
      distribution[rating] = count;
    });

    // Convert Record<number, number> → array of { stars, count }
    const ratingDistributionArray = Object.entries(distribution).map(
      ([stars, count]) => ({
        stars: Number(stars),
        count,
      })
    );

    // Update salon with proper format
    await this.salonModel.findByIdAndUpdate(salonId, {
      rating: Number(stats.averageRating.toFixed(1)),
      reviewCount: stats.reviewCount,
      ratingDistribution: ratingDistributionArray,
    });
  } else {
    // No reviews → return consistent 1–5 stars array with 0 counts
    const emptyDistribution = [1, 2, 3, 4, 5].map((stars) => ({
      stars,
      count: 0,
    }));

    await this.salonModel.findByIdAndUpdate(salonId, {
      rating: 0,
      reviewCount: 0,
      ratingDistribution: emptyDistribution,
    });
  }
}


}