import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Review } from "./Review.schema";
import { Theservice } from "./Theservice.schema";
import { Employee } from "./Employee.schema";

export type SalonDocument = Salon & Document;

@Schema({ timestamps: true })
export class Salon {
  // 🔹 Basic Info
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  ownerName: string;


  @Prop({ required: true, unique: true, index: true })
  phoneNumber: string;
                        // this is for the Validation of the Email ... that what i mean 

  @Prop({ 
  required: true, 
  unique: true, 
  index: true,
  match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
})
email: string;

@Prop({ required: true, minlength: 8, select: false })
password: string;

  // 🔹 Address & Location
  @Prop()
  address?: string;

  @Prop({
    type: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere', required: true }, // [long, lat]
      street: { type: String },
      city: { type: String },
      country: { type: String },
    },
    _id: false,
  })
  location?: {
    type: 'Point';
    coordinates: [number, number];
    street?: string;
    city?: string;
    country?: string;
  };

  // 🔹 Services & Employees
  @Prop({ type: [{ type: Types.ObjectId, ref: 'TheService' }], default: [] })
  services?: Theservice[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  employees?: Employee[];

  // 🔹 Ratings & Reviews
  @Prop({ default: 0 })
  rating?: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }], default: [] })
  reviews?: Review[];

  // 🔹 Media
  @Prop()
  logo?: string;

  @Prop({ type: [String], default: [] })
  photos?: string[];

  @Prop({ type: [String], default: [] })
  portfolio?: string[];

  // 🔹 Business Details
  @Prop({ type: [String], default: [] })
  serviceTypes?: string[];

  @Prop({ default: false })
  homeService?: boolean;

  @Prop()
  cancellationPolicy?: string;

  @Prop({ type: [String], default: [] })
  socialLinks?: string[];

  @Prop()
  certificationUrl?: string;

  @Prop()
  description?: string;
  @Prop({default:0})
  numberoflikes?:number ; 

  @Prop({ type: [String], default: [] })
  amenities?: string[];

  @Prop()
  businessRegistrationNumber?: string;

  // 🔹 Operational
  @Prop({ type: Map, of: String, default: {} })
  openingHours?: Record<string, string>;

  @Prop({ type: [String], default: [] })
  closingDays?: string[];

  // 🔹 Subscription & Payment
  @Prop({ type: String, enum: ['FREE', 'MONTHLY', 'YEARLY'], default: 'FREE' })
  subscriptionType: 'FREE' | 'MONTHLY' | 'YEARLY';

  @Prop()
  subscriptionStartDate?: Date;

  @Prop()
  accountExpiryDate?: Date;

  @Prop({
    type: [
      {
        amount: Number,
        date: Date,
        method: String,
        status: String,
      },
    ],
    default: [],
    _id: false,
  })
  paymentHistory?: { amount: number; date: Date; method: string; status: string }[];

  // 🔹 Financial & Performance
  @Prop({ default: 0 })
  earnings?: number;

  @Prop({ default: 0 })
  commissionRate?: number;

  @Prop({ default: 0 })
  totalBookings?: number;

  // 🔹 Visibility & Status
  @Prop({ default: 0 })
  viewsCount?: number;

  @Prop({ default: false })
  autoAcceptBookings?: boolean;

  @Prop({ default: false })
  verified?: boolean;

  @Prop({ type: String, enum: ['ACTIVE', 'SUSPENDED', 'CLOSED'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

  @Prop({ default: true })
  isActiveAccount?: boolean;

  // 🔹 Communication & Support
  @Prop({ type: [String], default: [] })
  notifications?: string[];

  @Prop()
  supportEmail?: string;

  @Prop()
  supportPhone?: string;

  // 🔹 Verification Docs
  @Prop()
  identityDocumentUrl?: string;
}

export const SalonSchema = SchemaFactory.createForClass(Salon);
SalonSchema.index({ 'location.coordinates': '2dsphere' });