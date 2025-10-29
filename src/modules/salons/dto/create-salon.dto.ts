import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsDateString,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
  IsLongitude,
  IsLatitude,
  ValidateIf,
  MaxLength,
  Min,
} from 'class-validator';

// --- Nested inputs ---
@InputType()
export class SalonLocationInput {
  @Field(() => Float)
  @IsNumber()
  lat: number;

  @Field(() => Float)
  @IsNumber()
  long: number;
}

@InputType()
export class TimeSlotInput {
  @Field(() => String)
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:MM (e.g., 09:00)'
  })
  open: string;

  @Field(() => String)
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format HH:MM (e.g., 18:00)'
  })
  close: string;
}

@InputType()
export class OpeningHoursInput {
  @Field(() => String)
  @IsString()
  @Matches(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i, {
    message: 'Day must be a valid day of the week'
  })
  day: string;

  @Field(() => [TimeSlotInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotInput)
  slots?: TimeSlotInput[];

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}

// --- Main Create DTO ---
@InputType()
export class CreateSalonDto {
  // 🔹 Basic Info (Required Fields)
  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Business name must be at least 2 characters long' })
  businessName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Owner name must be at least 2 characters long' })
  ownerName: string;

  @Field()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Please provide a valid phone number with country code'
  })
  phoneNumber: string;

  @Field()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please use a valid email address' })
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  })
  password: string;

 // ... your existing fields ...

  // 🔹 NEW: Salon Type
  @Field(() => String, { nullable: true, defaultValue: 'EVERYONE' })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'EVERYONE'])
  salonType?: 'MALE' | 'FEMALE' | 'EVERYONE';
  
  // 🔹 NEW: Price Range
  @Field(() => String, { nullable: true, defaultValue: 'MODERATE' })
  @IsOptional()
  @IsEnum(['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'])
  priceRange?: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';

  // 🔹 NEW: Average Price
  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  averagePrice?: number;
  // 🔹 Address & Location
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field(() => SalonLocationInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SalonLocationInput)
  location?: SalonLocationInput;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  street?: string;
    // 🔹 NEW: Review Count
  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  numberoflikes?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  // 🔹 Services & Employees (IDs only - will be populated later)
  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  services?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  employees?: string[];

  // 🔹 Media
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.+\..+/, { message: 'Logo must be a valid URL' })
  logo?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  portfolio?: string[];

  // 🔹 Business Details
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  serviceTypes?: string[];

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  homeService?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cancellationPolicy?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @Matches(/^https?:\/\/.+\..+/, { each: true, message: 'Social links must be valid URLs' })
  socialLinks?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.+\..+/, { message: 'Certification URL must be a valid URL' })
  certificationUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description should be at least 10 characters long' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  // 🔹 Operational
  @Field(() => [OpeningHoursInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursInput)
  openingHours?: OpeningHoursInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  closingDays?: string[];

  // 🔹 Subscription (Defaults set, no payment history on creation)
  @Field(() => String, { defaultValue: 'FREE' })
  @IsOptional()
  @IsEnum(['FREE', 'MONTHLY', 'YEARLY'])
  subscriptionType?: 'FREE' | 'MONTHLY' | 'YEARLY';

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  subscriptionStartDate?: string;

  // 🔹 Communication & Support
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Support email must be a valid email' })
  supportEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  supportPhone?: string;

  // 🔹 Verification Docs
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.+\..+/, { message: 'Identity document URL must be a valid URL' })
  identityDocumentUrl?: string;
}