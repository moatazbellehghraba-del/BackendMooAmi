// src/graphql-types/review.type.ts
import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
@ObjectType()
export class ClientName {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}

@ObjectType()
export class ReviewType {
  @Field(() => ID)
  _id: string;

    // We want client info here
  @Field(() => ClientName) // A new type with only firstName & lastName
  client: ClientName;

  @Field(() => String)
  salon: string;

  @Field(() => Float)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}