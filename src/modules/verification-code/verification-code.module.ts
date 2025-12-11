import { Module } from '@nestjs/common';
import { VerficationCodeService } from './verfication-code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VerficationCodeSchema, VerifcationCodesch } from 'src/schemas/VerficationCode.schema';


@Module({
  imports:[MongooseModule.forFeature([{name:VerifcationCodesch.name, schema:VerficationCodeSchema}])],
  providers: [VerficationCodeService],
  exports:[VerficationCodeService]
})
export class VerificationCodeModule {}
