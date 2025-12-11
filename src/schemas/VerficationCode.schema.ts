import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type VericationDocument = VerifcationCodesch & Document & {
    _id:Types.ObjectId;
}

@Schema({timestamps:true})

export class VerifcationCodesch {
    @Prop({required:true})
    email:string
    @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const VerficationCodeSchema=SchemaFactory.createForClass(VerifcationCodesch)