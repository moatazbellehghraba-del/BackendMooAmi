import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from 'src/schemas/Employee.schema';
import { CreateEmployeeInput } from './dto/create-employee.dto';
import * as crypto from 'crypto';
import * as bcrypt  from 'bcryptjs'
import { SalonsService } from '../salons/salons.service';

@Injectable()
export class EmployeesService {
   
    constructor(@InjectModel(Employee.name) private employeeModel : Model<EmployeeDocument> , private readonly salonsService: SalonsService){}
     private generateTemporaryPassword(): string {
  return crypto.randomBytes(6).toString('hex'); // 12 characters
}
    //--------------------------------Create Employee (Salon Admin)-------------------------------//
    async create(createEmployeeDto: CreateEmployeeInput):Promise<Employee>{
        const {email , salon} = createEmployeeDto  
        //check if email already exists //
        const existing= await this.employeeModel.findOne({email}); 
        if (existing) throw new BadRequestException("Email already is use") ; 
        // hash default password 
        const defaultPassword= this.generateTemporaryPassword()
        const hashedPassword = await bcrypt.hash(defaultPassword,10)
        const newEmployee= new this.employeeModel({
            ...createEmployeeDto , 
            password : hashedPassword , 
            salon: salon , 
            isFirstLogin : true 
            
        })
        const  savedEmployee=  await newEmployee.save()
        // Auto-add to salon's employees array 
        await this.salonsService.addEmployeeToSalon(
            savedEmployee.salon.toString() , savedEmployee._id.toString() 
        )
        return savedEmployee
    }
    // _______________________________________DELETE  EMployee ___________________________________///
    async remove(id:string) : Promise<Employee> {
        const employee = await this.employeeModel.findByIdAndDelete(id) ; 
        if (!employee) throw new NotFoundException("Employee Not found"
        )
        return employee
    }
    // ______________________________________ Find Employees of a Salon _________________________________/// 
    async findEmployeeofsalon(salon:string):Promise<Employee[]> {
        const Employees = await this.employeeModel.find({salon:salon})
        if(!Employees) throw new NotFoundException("Employees not found")
        return Employees
    }
    //________________________________________ Employee Changes password for the first time ______________// 
    async changePassword(employeeId : string , oldPassword: string , newPassword : string) : Promise<Employee> {
        const employee = await this.employeeModel.findById(employeeId)
        if (!employee) throw new NotFoundException("Employee not found ") ; 
        // Verify old password ............
        const isMatch = await bcrypt.compare(oldPassword , employee.password)
        if (!isMatch) throw new BadRequestException("Incorrect Current password") 
            // hash new password 
        const hashed = await bcrypt.hash(newPassword ,10) 
        employee.password=hashed
        employee.isFirstLogin=false ; 
        return employee.save()
        
    }
    //----------------------------------------Find all Employees of Salon (salonid)----------------------///
  
}
