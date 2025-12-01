import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { Document, Types } from "mongoose";


@Schema({timestamps: true})
export class Review {



  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  client: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'Salon', required: true })
  salon: Types.ObjectId;


  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  
  @Prop()
  comment?: string;

  
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);