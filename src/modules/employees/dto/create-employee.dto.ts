import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class WorkingHourInput {
  @Field()
  day: string;

  @Field()
  startTime: string;

  @Field()
  endTime: string;
}

@InputType()
export class CreateEmployeeInput {
  // 🔹 Basic Info
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;

  @Field()
  email: string;

  @Field()
  password: string;
   @Field(() => Boolean, { defaultValue: false })
  mustChangePassword?: boolean;

  @Field({ nullable: true })
  temporaryPassword?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  bio?: string;

  // 🔹 Salon Relation
  @Field(() => ID)
  salon: string;

  // 🔹 Optional Relations
  @Field(() => [ID], { nullable: true })
  assignedServices?: string[];

  // 🔹 Availability
  @Field({ nullable: true })
  availabilityStatus?: 'Available' | 'Busy' | 'Off';

  @Field(() => [WorkingHourInput], { nullable: true })
  workingHours?: WorkingHourInput[];

  @Field(() => [String], { nullable: true })
  daysOff?: string[];

  // 🔹 Financial
  @Field(() => Float, { nullable: true })
  salary?: number;

  @Field(() => Float, { nullable: true })
  commissionRate?: number;

  // 🔹 Account Info
  @Field({ nullable: true })
  verified?: boolean;

  @Field({ nullable: true })
  status?: 'ACTIVE' | 'SUSPENDED' | 'RESIGNED';

  @Field({ nullable: true })
  isActive?: boolean;

  // 🔹 Communication
  @Field(() => [String], { nullable: true })
  notifications?: string[];
   @Field(() => Boolean, { defaultValue: true })
  isFirstLogin?: boolean;
}
