import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsResolver } from './clients.resolver';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/Client.schema';
import { Booking, BookingSchema } from 'src/schemas/Booking.schema';
import { Review, ReviewSchema } from 'src/schemas/Review.schema';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { EmailModule } from '../email/email.module';
import { CloudinaryModule } from '../shared/cloudinary/cloudinary.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Client.name , schema:ClientSchema}
    ,{name:Booking.name , schema:BookingSchema}]) , VerificationCodeModule, CloudinaryModule,EmailModule] , 
  providers: [ClientsService, ClientsResolver],
  exports : [ClientsService]
})
export class ClientsModule {}
