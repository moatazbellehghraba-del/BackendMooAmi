import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateClientInput } from "./create-client.dto";
import { IsNotEmpty } from "class-validator";

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
 
}

//PartialType makes all the fields from createClientInput optional _ perfect for updates ... 
// added Id as @Field to specify  which cliend you're updating ;.. 