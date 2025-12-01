import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class LoginClientInput{
    @Field() email: string ;
    @Field() password: string ; 
}