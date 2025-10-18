import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



export type EmployeeDocument= Employee & Document
@Schema({timestamps : true})
export class Employee {

}
export const EmployeeSchema= SchemaFactory.createForClass(Employee)