import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql";
import { Salon } from "src/modules/salons/entites/Salon.model";


@ObjectType()
export class ServiceType {
     @Field(() => ID)
  _id: string;

  @Field(() => String )
  salon_id: string;
  @Field(()=>Salon , {nullable: true})
  salon?:Salon ; 

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  duration: number; // in minutes

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field(() => [ID], { nullable: true })
  employees?: string[];

  @Field({ nullable: true })
  image?: string;

  @Field({ defaultValue: false })
  homeService: boolean;
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}