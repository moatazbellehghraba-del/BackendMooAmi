import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/env.config';
import { DatabaseConfig } from './config/database.config';
import { RedisConfig } from './config/redis.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';

import { EmployeesModule } from './modules/employees/employees.module';

import { SalonsModule } from './modules/salons/salons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ServicesModule } from './modules/services/services.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { EmailModule } from './modules/email/email.module';

import { VerificationCodeModule } from './modules/verification-code/verification-code.module';
import { CloudinaryModule } from './modules/shared/cloudinary/cloudinary.module';




@Module({
  imports: [
    // Environment
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [envConfig],
    }),
    // MongoDB
    DatabaseConfig,
    // Redis / BullMQ
    RedisConfig,
    // GraphQL (Code-First)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: {
        settings: {
          'editor.autocomplete': false,
          'editor.cursorShape': 'line',
          'schema.polling.enable': false,
        } as any,
      },
    }),
    // Feature modules
    AuthModule,
    ClientsModule,
    EmployeesModule,
    SalonsModule,
    ReviewsModule,
    ServicesModule,
    BookingsModule,
    EmailModule,
    CloudinaryModule,
   VerificationCodeModule
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
