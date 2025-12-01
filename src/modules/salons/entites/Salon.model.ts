import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Employee } from 'src/modules/employees/entities/employee.types';
import { ServiceType } from 'src/modules/services/entities/services.types';

@ObjectType()
export class SalonLocation {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  long: number;
}

@ObjectType()
export class PaymentHistory {
  @Field(() => Float)
  amount: number;

  @Field(() => Date)
  date: Date;

  @Field()
  method: string;

  @Field()
  status: string;
}
@ObjectType()
export class RatingItem {
  @Field(() => Int)
  stars: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class TimeSlot {
  @Field(() => String)
  open: string;

  @Field(() => String)
  close: string;
}

@ObjectType()
export class OpeningHours {
  @Field(() => String)
  day: string;

  @Field(() => [TimeSlot], { nullable: true })
  slots?: TimeSlot[];

  @Field({ nullable: true, defaultValue: false })
  isClosed?: boolean;
}

@ObjectType()
export class Salon {
  @Field(() => ID)
  _id: string;

  // 🔹 Basic Info
  @Field()
  businessName: string;

  @Field()
  ownerName: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  // 🔹 Address & Location
  @Field({ nullable: true })
  address?: string;

  @Field(() => SalonLocation, { nullable: true })
  location?: SalonLocation;

  @Field({ nullable: true })
  street?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  // 🔹 Services & Employees
   @Field(() => [String])
  services: string[];
  @Field(() => [ServiceType], { nullable: true })
  servicesDetails?: ServiceType[];

  @Field(() => [String], { nullable: true })
  employees?: string[];
  @Field(()=>[Employee], {nullable: true})
  employeesDetails?:Employee[]
  // 🔹 Ratings & Reviews
  @Field(() => [String], { nullable: true })
  reviews?: string[];

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  rating?: number;
  @Field(() => Int, { defaultValue: 0 })
  reviewCount: number;

 @Field(() => [RatingItem], { nullable: true })
ratingDistribution?: RatingItem[];

  // 🔹 Media
  @Field({ nullable: true })
  logo?: string;

  @Field(() => [String], { nullable: true })
  photos?: string[];

  @Field(() => [String], { nullable: true })
  portfolio?: string[];

  // 🔹 Business Details
  @Field(() => [String], { nullable: true })
  serviceTypes?: string[];

  @Field({ nullable: true, defaultValue: false })
  homeService?: boolean;

  @Field({ nullable: true })
  cancellationPolicy?: string;

  @Field(() => [String], { nullable: true })
  socialLinks?: string[];

  @Field({ nullable: true })
  certificationUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  numberoflikes?: number;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field({ nullable: true })
  businessRegistrationNumber?: string;

  // 🔹 Operational
  @Field(() => [OpeningHours], { nullable: true })
  openingHours?: OpeningHours[];
    // 🔹 Add this new field
  @Field(() => Boolean , { nullable: true })
  isOpenNow: boolean;

  @Field(() => [String], { nullable: true })
  closingDays?: string[];
    @Field(() => String ,{ nullable: true })
  salonType: 'MALE' | 'FEMALE' | 'EVERYONE';

  @Field(() => String ,{ nullable: true })
  priceRange: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';

  @Field(() => Float ,{ nullable: true })
  averagePrice: number;
  // 🔹 Subscription & Payment
  @Field(() => String )
  subscriptionType: 'FREE' | 'MONTHLY' | 'YEARLY';

  @Field({ nullable: true })
  subscriptionStartDate?: Date;

  @Field({ nullable: true })
  accountExpiryDate?: Date;

  @Field(() => [PaymentHistory], { nullable: true })
  paymentHistory?: PaymentHistory[];

  // 🔹 Financial & Performance
  @Field(() => Float, { nullable: true, defaultValue: 0 })
  earnings?: number;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  commissionRate?: number;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  totalBookings?: number;

  // 🔹 Visibility & Status
  @Field(() => Float, { nullable: true, defaultValue: 0 })
  viewsCount?: number;

  @Field({ nullable: true, defaultValue: false })
  autoAcceptBookings?: boolean;

  @Field({ nullable: true, defaultValue: false })
  verified?: boolean;

  @Field(() => String)
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

  @Field({ nullable: true, defaultValue: true })
  isActiveAccount?: boolean;

  // 🔹 Communication & Support
  @Field(() => [String], { nullable: true })
  notifications?: string[];
  @Field({ nullable: true })
  supportEmail?: string;

  @Field({ nullable: true })
  supportPhone?: string;

  // 🔹 Verification Docs
  @Field({ nullable: true })
  identityDocumentUrl?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}