import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis, { RedisOptions, Redis } from 'ioredis';

@Injectable()
export class QueueService implements OnModuleDestroy {
    private connection: Redis;
    public importQueue: Queue;
    public historyQueue: Queue;

    constructor() {
        const redisOpts: RedisOptions = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT || 6379),
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: null
        };
        this.connection = new IORedis(redisOpts);

        this.importQueue = new Queue('import-queue', {
            connection: this.connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: { age: 60 * 60 }, // remove completed after 1 hour
                removeOnFail: { age: 60 * 60 * 24 }, // keep failures 24h
            },
        });

        this.historyQueue = new Queue('history-queue', {
            connection: this.connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'fixed',
                    delay: 4000,
                },
                removeOnComplete: { age: 60 * 60 },
                removeOnFail: { age: 60 * 60 * 24 },
            },
        })
    }

    async onModuleDestroy() {
        try {
            await this.importQueue.close();
            await this.historyQueue.close();
            await this.connection.quit();
        } catch (err) {
            // ignore
        }
    }
}
