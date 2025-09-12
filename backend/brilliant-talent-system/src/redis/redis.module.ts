// redis/redis.module.ts
import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // Makes this module available globally
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}