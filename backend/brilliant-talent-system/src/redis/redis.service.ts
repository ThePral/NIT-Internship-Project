// redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public client: RedisClientType;

  constructor() {
    const redisOpts = {
      socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        reconnectStrategy: (retries: number) => {
          this.logger.log(`Redis reconnecting attempt: ${retries}`);
          return Math.min(retries * 100, 3000);
        }
      },
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null
    };
    this.client = createClient(redisOpts);
    
    this.client.on('error', (err) => {
      this.logger.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connecting...');
      this.client.flushAll();
    });

    this.client.on('ready', () => {
      this.logger.log('Redis connected and ready');
    });

    this.client.on('reconnecting', () => {
      this.logger.log('Redis reconnecting...');
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis connection established');
    } catch (err) {
      this.logger.error('Failed to connect to Redis:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    }
  }

  // Helper methods for easier usage
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await this.client.setEx(key, ttl, stringValue);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  async hSet(key: string, field: string, value: any): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await this.client.hSet(key, field, stringValue);
  }

  async hGet<T = any>(key: string, field: string): Promise<T | null> {
    const value = await this.client.hGet(key, field);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async hGetAll(key: string): Promise<Record<string, any>> {
    return await this.client.hGetAll(key);
  }
}