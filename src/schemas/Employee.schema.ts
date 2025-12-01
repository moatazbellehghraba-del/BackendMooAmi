import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Theservice } from "./Theservice.schema";
import { Review } from "./Review.schema";
import { Booking } from "./Booking.schema";


export type EmployeeDocument = Employee & Document & {
    _id: Types.ObjectId; // Explicitly define _id type
}

@Schema({ timestamps: true })
export class Employee {
  // 🔹 Basic Info
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  })
  email: string;

  @Prop({ required: true, minlength: 8, select: false })
  password: string;

  @Prop()
  profileImage?: string;
  @Prop({default:false}) 
  mustChangePassword?:boolean ; 
  @Prop()
  temporaryPassword?:string

  @Prop()
  bio?: string;

  // 🔹 Salon Relation
  @Prop({ type: Types.ObjectId, ref: "Salon", required: true })
  salon: Types.ObjectId;

  // 🔹 Services & Bookings
  @Prop({ type: [Types.ObjectId], ref: "Theservice", default: [] })
  assignedServices?: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: "Booking", default: [] })
  bookings?: Types.ObjectId[];

  // 🔹 Availability
  @Prop({
    default: "Available",
    enum: ["Available", "Busy", "Off"],
  })
  availabilityStatus?: "Available" | "Busy" | "Off";

  @Prop({
    type: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
    default: [],
    _id: false,
  })
  workingHours?: { day: string; startTime: string; endTime: string }[];

  @Prop({ type: [String], default: [] })
  daysOff?: string[];

  // 🔹 Reviews & Ratings
  @Prop({ type: [{ type: Types.ObjectId, ref: "Review" }], default: [] })
  reviews?: Types.ObjectId[];

  @Prop({ default: 0 })
  rating?: number;

  @Prop({ default: 0 })
  reviewCount?: number;

  // 🔹 Financial
  @Prop({ default: 0 })
  salary?: number;

  @Prop({ default: 0 })
  commissionRate?: number;

  @Prop({ default: 0 })
  totalEarnings?: number;

  // 🔹 Account Info
  @Prop({ default: false })
  verified?: boolean;

  @Prop({
    default: "ACTIVE",
    enum: ["ACTIVE", "SUSPENDED", "RESIGNED"],
  })
  status?: "ACTIVE" | "SUSPENDED" | "RESIGNED";

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: Date, default: Date.now })
  joinDate?: Date;

  @Prop()
  lastLogin?: Date;

  // 🔹 Communication
  @Prop({ type: [String], default: [] })
  notifications?: string[];
  @Prop({ type: Boolean, default: true })
isFirstLogin: boolean;

}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);