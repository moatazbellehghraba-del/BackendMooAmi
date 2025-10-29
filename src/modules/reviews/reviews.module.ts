import { Module } from '@nestjs/common';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from 'src/schemas/Review.schema';
import { Salon, SalonSchema } from 'src/schemas/Salon.schema';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Salon.name , schema:SalonSchema},{name:Review.name , schema:ReviewSchema}]) , ClientsModule] , 
  providers: [ReviewsResolver, ReviewsService]
})
export class ReviewsModule {}
