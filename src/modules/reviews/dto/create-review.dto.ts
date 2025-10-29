import { Field, InputType, Int } from "@nestjs/graphql";
import {  IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";



@InputType()
export class CreateReviewDto {
     @Field(() => String)
    @IsNotEmpty()
    clientId: string; // 🔹 KEEP: This matches your current usage

    @Field(() => String)
    @IsNotEmpty()
    salonId: string;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    comment?: string;
}