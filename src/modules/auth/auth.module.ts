import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ClientsModule } from '../clients/clients.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VerficationCodeSchema, VerifcationCodesch } from 'src/schemas/VerficationCode.schema';

import { VerificationCodeModule } from '../verification-code/verification-code.module';


@Module({
  imports:[ VerificationCodeModule,ClientsModule,ConfigModule ,EmailModule, JwtModule.register({})],
  providers: [AuthService, AuthResolver,JwtStrategy],

})
export class AuthModule {}
