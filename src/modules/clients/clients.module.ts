import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsResolver } from './clients.resolver';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from 'src/schemas/Client.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Client.name , schema:ClientSchema}])] , 
  providers: [ClientsService, ClientsResolver]
})
export class ClientsModule {}
