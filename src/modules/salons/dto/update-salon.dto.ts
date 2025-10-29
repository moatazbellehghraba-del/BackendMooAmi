import { InputType, Field, ID} from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSalonDto } from './create-salon.dto';
import { IsOptional, IsString, MinLength, Matches, IsEnum, IsArray, IsBoolean } from 'class-validator';

@InputType()
export class UpdateSalonDto extends PartialType(CreateSalonDto) {
  // Override specific fields that need different validation in update
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  })
  password?: string;

  // Admin-only fields (protected by role guards)
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['ACTIVE', 'SUSPENDED', 'CLOSED'])
  status?: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  autoAcceptBookings?: boolean;

  // Remove fields that shouldn't be updatable
  // These will be excluded in service layer or with custom logic
}

// Alternative: Create a base DTO without sensitive fields