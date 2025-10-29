import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Theservice } from "./Theservice.schema";
import { Review } from "./Review.schema";

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  // 🔹 Basic Info
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true, unique: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] })
  email: string;

  @Prop({ required: true, minlength: 8, select: false })
  password: string;

  @Prop()
  profileImage?: string;

  @Prop()
  bio?: string;

  // 🔹 Work Info
  @Prop({ type: Types.ObjectId, ref: "Salon", required: true })
  salon: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: "TheService", default: [] })
  assignedServices?: Theservice[];

  @Prop({ default: "Available", enum: ["Available", "Busy", "Off"] })
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

  // 🔹 Performance & Reviews
  @Prop({ type: [{ type: Types.ObjectId, ref: "Review" }], default: [] })
  reviews?: Review[];

  @Prop({ default: 0 })
  rating?: number;

  @Prop({ default: 0 })
  completedAppointments?: number;

  // 🔹 Financial
  @Prop({ default: 0 })
  salary?: number;

  @Prop({ default: 0 })
  commissionRate?: number;

  @Prop({ default: 0 })
  totalEarnings?: number;

  // 🔹 Account & Status
  @Prop({ default: false })
  verified?: boolean;

  @Prop({ default: "ACTIVE", enum: ["ACTIVE", "SUSPENDED", "RESIGNED"] })
  status?: "ACTIVE" | "SUSPENDED" | "RESIGNED";

  @Prop({ default: true })
  isActive?: boolean;

  // 🔹 Communication
  @Prop({ type: [String], default: [] })
  notifications?: string[];

  @Prop({ type: Date, default: Date.now })
  joinDate?: Date;

  @Prop()
  lastLogin?: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
