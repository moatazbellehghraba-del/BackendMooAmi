import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Booking } from './Booking.schema';
import { Review } from './Review.schema';

export type ClientDocument = Client & Document& {
  _id: Types.ObjectId;
};

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  firstName: string;
  
  @Prop({ required: true })
  lastName: string;
     
  @Prop({ required: true, unique: true, index: true })
  phoneNumber: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;
 @Prop({
  type: String,
  required: false,
  index: false
})
pendingEmail?: string | null;
 @Prop({ required: true })  // 🆕 Add password field
  password: string;
  @Prop()
  gender?: string;

  @Prop()
  dateOfBirth?: Date;
  // Booking and Review ...... 
  @Prop({type: [{type:Types.ObjectId , ref:"Booking"}], default:[]})
  bookings?:Booking[] ; 
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }], default: [] })
    reviews?: Review[];

  @Prop()
  profilePhoto?: string;
   @Prop() // Will store Cloudinary public_id
  profileImageId: string;
  @Prop({
    type: {
      lat: { type: Number },
      long: { type: Number },
    },
    default: null,
     _id: false,  // this to prevent mongoose form adding __id to this subdocument ... 
  })
  location?: {
    lat: number;
    long: number;
  };
  @Prop({type:String , default:null})
  region:String ; 
  @Prop({type:String , default:null})
  country:String ;
   // store hashed refresh tokens (could be array for multi-device)
  @Prop({ type: String, default: null })
  currentHashedRefreshToken?: string | null;
  @Prop({ default: 0 })
  loyaltyPoints?: number;
    // 🟢 New field
  @Prop({ type: [String], default: [] })
  favorites: string[];
  @Prop({type:Boolean , default:false})
  isVerified:Boolean;
 
}

export const ClientSchema = SchemaFactory.createForClass(Client);
