import { Args, Mutation, Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewInput } from './dto/update-review.dto';
import { Review } from 'src/schemas/Review.schema';
import { ClientName, ReviewType } from './entites/review.types';
import { ClientsService } from '../clients/clients.service';
import { ClientEntity } from '../clients/entities/Client.model';
import { Param } from '@nestjs/common';

@Resolver(()=>ReviewType)
export class ReviewsResolver {
    constructor(private readonly reviewsService: ReviewsService , private readonly Clientservice: ClientsService) {}
    
   @Mutation(() => ReviewType)
  async createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewDto,
  ): Promise<ReviewType> {
    return this.reviewsService.createReview(createReviewInput);
  }

  @Mutation(() => ReviewType)
  async updateReview(
    @Args('reviewId') reviewId: string,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<ReviewType> {
    return this.reviewsService.updateReview(reviewId, updateReviewInput);
  }

  @Mutation(() => Boolean)
  async deleteReview(@Args('reviewId') reviewId: string): Promise<boolean> {
    return this.reviewsService.deleteReview(reviewId);
  }

  @Query(() => [ReviewType])
  async reviewsBySalon(@Args('salonId') salonId: string): Promise<ReviewType[]> {
    return this.reviewsService.getReviewsBySalon(salonId);
  }

  @Query(() => ReviewType)
  async review(@Args('reviewId') reviewId: string): Promise<ReviewType> {
    return this.reviewsService.getReview(reviewId);
  }

  @Query(() => [ReviewType])
  async reviews(): Promise<ReviewType[]> {
    return this.reviewsService.getAllReviews();
  }
@ResolveField(()=>ClientName)
  async client(@Parent() review: any): Promise<ClientName> {
    const clientDoc = await this.Clientservice.clientModel
      .findById(review.client)
    .select('firstName lastName')
    .lean();

  if (!clientDoc) {
    throw new Error('Client not found');
  }

  return clientDoc;
  }
}