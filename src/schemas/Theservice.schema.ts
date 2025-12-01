import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Employee } from "./Employee.schema";
import { Salon } from "./Salon.schema";

export type TheserviceDocument = Theservice & Document & {
   _id: Types.ObjectId; // Explicitly define _id type
}

@Schema({timestamps: true}) 
export class Theservice {


    @Prop({ type: Types.ObjectId, ref: 'Salon', required: true })
  salon_id: Types.ObjectId; // Change from 'Salon' to 'Types.ObjectId'

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  duration: number; // in minutes (or whatever unit you prefer)

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string; // e.g., 'haircut', 'massage', etc.

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }] , default:[]})
  employees?: Employee[];
  @Prop({ type: Boolean, default: false })
homeService: boolean;
@Prop({ type: String, required: false })
image?: string; // store the URL or path of the image
}



export const TheserviceSchema = SchemaFactory.createForClass(Theservice)