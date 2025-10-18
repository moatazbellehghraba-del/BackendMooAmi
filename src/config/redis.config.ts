import { BullModule } from '@nestjs/bull';

export const RedisConfig = BullModule.forRoot({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10) ,
    
  },
});
