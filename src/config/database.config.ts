import { MongooseModule } from '@nestjs/mongoose';

export const DatabaseConfig = MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: process.env.MONGO_URI,
   
  }),
});
