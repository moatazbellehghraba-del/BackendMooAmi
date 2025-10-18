import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BookingDocument= Booking & Document
@Schema({timestamps: true}) 
export class Booking {

}

export const BookingSchema= SchemaFactory.createForClass(Booking)