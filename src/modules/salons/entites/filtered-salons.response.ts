import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Salon } from "./Salon.model";

@ObjectType()
export class PaginationInfo {
    @Field(()=>Number)

    currentPage: number;
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Number)
  totalResults: number;
    @Field(() => Int) // 🔹 ADD THIS MISSING FIELD
  totalPages: number;

}
@ObjectType()
export class FilteredSalonsResponse {
  @Field(() => [Salon])
  salons: Salon[];

  @Field(() => PaginationInfo)
  pagination: PaginationInfo;
}