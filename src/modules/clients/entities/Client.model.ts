import { Field, ID, ObjectType, Float } from '@nestjs/graphql';

// this for the retunring the data but the create is for the creating ... 
@ObjectType()
export class Booking {
  @Field(() => ID)
  _id: string;

  @Field()
  date: Date;

  @Field()
  service: string;

  // add other fields as needed
}

@ObjectType()
export class Review {
  @Field(() => ID)
  _id: string;

  @Field()
  rating: number;

  @Field()
  comment: string;

  // add other fields as needed
}
@ObjectType()
class Location {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  long: number;
}
@ObjectType()
export class ClientEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phoneNumber: string;
  // bookins and reviewsssssssssss
  @Field(()=>[Booking], {nullable: true})
  bookings?:Booking[] ; 
  @Field(()=>[Review], {nullable:true}) 
  reviews?: Review[];
  @Field()
  email: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  profilePhoto?: string;

  @Field(() => Location, { nullable: true })  // ← Use Location type here too
  location?: Location;

  @Field({ nullable: true })
  loyaltyPoints?: number;

  @Field({ nullable: true })
  createdAt?: Date;
  @Field({nullable:true}) 
  region?:string 
  @Field({nullable:true})
  country?:string

  @Field({ nullable: true })
  updatedAt?: Date;
   // 🟢 New field
  @Field(() => [String])
  favorites: string[];
}
