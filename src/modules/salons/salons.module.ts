import { Module } from '@nestjs/common';
import { SalonsResolver } from './salons.resolver';
import { MongooseModule } from '@nestjs/mongoose';

import { Salon, SalonSchema } from 'src/schemas/Salon.schema';
import { SalonsService } from './salons.service';
import { Review, ReviewSchema } from 'src/schemas/Review.schema';

import { Theservice, TheserviceSchema } from 'src/schemas/Theservice.schema';
import { Employee, EmployeeSchema } from 'src/schemas/Employee.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Salon.name , schema: SalonSchema} ,{name:Employee.name , schema : EmployeeSchema},{name:Theservice.name , schema:TheserviceSchema} , {name:Review.name , schema: ReviewSchema}])] , 
  providers: [ SalonsService,SalonsResolver]
})
export class SalonsModule {}
