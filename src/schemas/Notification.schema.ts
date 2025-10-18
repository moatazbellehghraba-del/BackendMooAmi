import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type NotificationDocument = Notification & Document
@Schema({timestamps : true})
export class Notification {

}
export const NotificationSchema= SchemaFactory.createForClass(Notification)