import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Review } from 'src/modules/clients/entities/Client.model';
import { ServiceType } from 'src/modules/services/entities/services.types';


@ObjectType()
export class WorkingHour {
  @Field()
  day: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}

@ObjectType()
export class Employee {
  // 🔹 Basic Info
  @Field(() => ID)
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;
    @Field()
  mustChangePassword: boolean;

  @Field({ nullable: true })
  temporaryPassword?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  bio?: string;

  // 🔹 Salon Relation
  @Field(() => ID)
  salon: string;

  // 🔹 Relations
  @Field(() => [ID], { nullable: true })
  assignedServices?: string[];

  @Field(() => [ID], { nullable: true })
  bookings?: string[];

  // 🔹 Availability
  @Field({ nullable: true })
  availabilityStatus?: 'Available' | 'Busy' | 'Off';

  @Field(() => [WorkingHour], { nullable: true })
  workingHours?: WorkingHour[];

  @Field(() => [String], { nullable: true })
  daysOff?: string[];

  // 🔹 Reviews & Ratings
  @Field(() => [ID], { nullable: true })
  reviews?: string[];

  @Field(() => Float, { nullable: true })
  rating?: number;

  @Field(() => Float, { nullable: true })
  reviewCount?: number;

  // 🔹 Financial
  @Field(() => Float, { nullable: true })
  salary?: number;

  @Field(() => Float, { nullable: true })
  commissionRate?: number;

  @Field(() => Float, { nullable: true })
  totalEarnings?: number;

  // 🔹 Account Info
  @Field({ nullable: true })
  verified?: boolean;

  @Field({ nullable: true })
  status?: 'ACTIVE' | 'SUSPENDED' | 'RESIGNED';

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  joinDate?: Date;

  @Field({ nullable: true })
  lastLogin?: Date;

  // 🔹 Communication
  @Field(() => [String], { nullable: true })
  notifications?: string[];

  // 🔹 Populated Fields (for your idea)
//   @Field(() => [], { nullable: true })
//   bookingsDetails?: Booking[];

  @Field(() => [ServiceType], { nullable: true })
  assignedServicesDetails?: ServiceType[];

  @Field(() => [Review], { nullable: true })
  reviewDetails?: Review[];
   @Field(() => Boolean)
  isFirstLogin: boolean;
}
