import { InputType, Field, Float, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsMongoId,
  MinLength,
  ValidateNested,
  IsBoolean,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class WorkingHourInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  day: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  startTime: string; // e.g., "09:00"

  @Field()
  @IsNotEmpty()
  @IsString()
  endTime: string; // e.g., "18:00"
}

@InputType()
export class CreateEmployeeInput {
  // 🔹 Basic Info
  @Field()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  // 🔹 Work Info
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  salon: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignedServices?: string[];

  @Field({ nullable: true, defaultValue: 'Available' })
  @IsOptional()
  @IsEnum(['Available', 'Busy', 'Off'])
  availabilityStatus?: 'Available' | 'Busy' | 'Off';

  @Field(() => [WorkingHourInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHourInput)
  workingHours?: WorkingHourInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  daysOff?: string[];

  // 🔹 Performance & Financial
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @Field({ nullable: true, defaultValue: 'ACTIVE' })
  @IsOptional()
  @IsEnum(['ACTIVE', 'SUSPENDED', 'RESIGNED'])
  status?: 'ACTIVE' | 'SUSPENDED' | 'RESIGNED';

  // 🔹 Communication
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  notifications?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  joinDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}