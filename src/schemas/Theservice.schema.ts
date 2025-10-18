import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TheserviceDocument = Theservice & Document

@Schema({timestamps: true}) 
export class Theservice {

}



export const TheserviceSchema = SchemaFactory.createForClass(Theservice)