import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Salon } from "./Salon.schema";
import { Client } from "./Client.schema";

export type ReviewDocument = Review & Document ; 
@Schema({timestamps: true})
export class Review {
 @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  user: Client

  @Prop({ type: Types.ObjectId, ref: 'Salon', required: true })
  salon: Salon ; 

  @Prop({ required: true, min: 1, max: 5 })
  rating: number; // ⭐ Required

  @Prop()
  comment?: string; // 💬 Optional

}

export const ReviewSchema = SchemaFactory.createForClass(Review)