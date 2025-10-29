import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

@InputType()
export class UpdateReviewInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;
}