import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

import { IsMongoId, IsNotEmpty } from 'class-validator';
import { CreateEmployeeInput } from './create-employee.dto';

@InputType()
export class UpdateEmployeeInput extends PartialType(CreateEmployeeInput) {
  // 🔹 ID of the employee to update
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
