import { forwardRef, Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesResolver } from './services.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Theservice, TheserviceSchema } from 'src/schemas/Theservice.schema';
import { SalonsModule } from '../salons/salons.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Theservice.name, schema:TheserviceSchema}]) , forwardRef(() => SalonsModule) ] ,
  providers: [ServicesService, ServicesResolver] ,
  exports:[ServicesService]
})
export class ServicesModule {}
