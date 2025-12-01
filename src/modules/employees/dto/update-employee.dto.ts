import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateEmployeeInput } from './create-employee.dto';


@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {
  @Field(() => ID)
  _id: string;
}
