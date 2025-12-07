import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ClientsModule } from '../clients/clients.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports:[ClientsModule,ConfigModule , JwtModule.register({})],
  providers: [AuthService, AuthResolver,JwtStrategy],

})
export class AuthModule {}
