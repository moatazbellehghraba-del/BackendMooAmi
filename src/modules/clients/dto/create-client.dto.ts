import { InputType, Field, Float } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsOptional, IsString, IsNumber, IsArray, ValidateNested, isBoolean, isEAN, isEmail } from 'class-validator';
@InputType()
class LocationInput {
  @Field(() => Float)
  @IsNumber()
  lat: number;

  @Field(() => Float)
  @IsNumber()
  long: number;
}
@InputType()
export class CreateClientInput {
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
  @IsString()
  password: string;
 
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field({ nullable: true })
  @IsOptional()
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  profilePhoto?: string;
   @Field({ nullable: true })
  @IsOptional()
  @IsString()
   profileImageId?: string;

   @Field(() => LocationInput, { nullable: true })  // ← Replace lat/long with location
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationInput)
  location?: LocationInput;
  @Field({nullable:true})
  @IsOptional()
  @IsString()
  region ?:string ;
  @Field({nullable:true})
  @IsOptional()
  @IsString()
  country ?:string ;



  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  loyaltyPoints?: number;
    // 🟢 New field
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favorites?: string[];
  
  
}
