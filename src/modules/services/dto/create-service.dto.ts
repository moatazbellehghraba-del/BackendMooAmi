import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsArray, IsMongoId } from 'class-validator';

@InputType()
export class CreateServiceDto {
  @Field(() => String)
  @IsNotEmpty()
  salon_id: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  duration: number; // in minutes

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
 
  @IsOptional()
  employees?: string[];
  @Field({ nullable: true })
@IsString()
@IsOptional()
image?: string; // URL of the picture
@Field({ nullable: true, defaultValue: false })
@IsOptional()
homeService?: boolean;

}