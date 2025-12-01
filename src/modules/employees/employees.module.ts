import { forwardRef, Module } from '@nestjs/common';
import { EmployeesResolver } from './employees.resolver';
import { EmployeesService } from './employees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from 'src/schemas/Employee.schema';
import { SalonsModule } from '../salons/salons.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Employee.name, schema:EmployeeSchema}]),forwardRef(()=>SalonsModule)] ,
  providers: [EmployeesResolver, EmployeesService], 
  exports: [EmployeesService]
})
export class EmployeesModule {}
