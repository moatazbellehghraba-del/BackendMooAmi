import { Field, ID, InputType, PartialType } from "@nestjs/graphql";
import { CreateServiceDto } from "./create-service.dto";
import { IsMongoId, IsOptional } from "class-validator";

@InputType()
export class UpdateServiceDto extends PartialType(CreateServiceDto) {
   
}