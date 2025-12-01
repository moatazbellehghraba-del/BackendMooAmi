import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Review } from "./Review.schema";
import { Theservice } from "./Theservice.schema";
import { Employee } from "./Employee.schema";

// Define interfaces for nested objects
interface TimeSlot {
  open: string;
  close: string;
}

interface OpeningHoursDay {
  day: string;
  slots: TimeSlot[];
  isClosed?: boolean;
}

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
      lat: { type: Number },
      long: { type: Number },
    },
    default: null,
    _id: false,
  })
  location?: {
    lat: number;
    long: number;
  };

  @Prop()
  street?: string;

  @Prop()
  city?: string;

  @Prop()
  country?: string;

  // 🔹 Services & Employees
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Theservice' }], default: [] })
  services?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }], default: [] })
  employees?: Types.ObjectId[];

  // 🔹 Ratings & Reviews
  @Prop({ default: 0 })
  rating?: number;
    @Prop({ default: 0 })
  reviewCount: number;

@Prop({
  type: [
    {
      stars: { type: Number, required: true },
      count: { type: Number, required: true },
      _id: false, // prevent automatic _id
    },
  ],
  default: [],
})
ratingDistribution: { stars: number; count: number }[];
 // Stores counts: {1: 5, 2: 3, 3: 8, 4: 12, 5: 25}

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
    // 🔹 NEW: Salon Type (Male/Female/Everyone)
  @Prop({ 
    type: String, 
    enum: ['MALE', 'FEMALE', 'EVERYONE'], 
    default: 'EVERYONE' 
  })
  salonType?: 'MALE' | 'FEMALE' | 'EVERYONE';
// 🔹 NEW: Price Range (budget-friendly to luxury)
  @Prop({ 
    type: String, 
    enum: ['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'], 
    default: 'MODERATE' 
  })
  priceRange?: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';

  // 🔹 NEW: Average Service Price (for sorting)
  @Prop({ default: 0 })
  averagePrice?: number;

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
  numberoflikes?: number;

  @Prop({ type: [String], default: [] })
  amenities?: string[];

  @Prop()
  businessRegistrationNumber?: string;

@Prop({ 
  type: [{
    _id: false, // Disable _id for day objects
    day: String,
    slots: [{
      _id: false, // Disable _id for time slot objects
      open: String,
      close: String
    }],
    isClosed: { type: Boolean, default: false }
  }], 
  default: [] 
})
  openingHours?: OpeningHoursDay[];

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

// Add this method to your SalonSchema with proper typing
SalonSchema.methods.isOpenNow = function(): boolean {
  if (!this.openingHours || this.openingHours.length === 0) return false;

  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // get the current day ... 
  const currentTime = now.toTimeString().slice(0, 5); // "14:30"  get the current time 

  const todaySchedule = this.openingHours.find((schedule: OpeningHoursDay) => 
    schedule.day.toLowerCase() === currentDay
  );

  // If no schedule for today or explicitly closed
  if (!todaySchedule || todaySchedule.isClosed) return false;

  // If no time slots for today
  if (!todaySchedule.slots || todaySchedule.slots.length === 0) return false;

  // Check if current time falls within any slot
  return todaySchedule.slots.some((slot: TimeSlot) => 
    currentTime >= slot.open && currentTime <= slot.close
  );
};