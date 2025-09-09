import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

@Injectable()
export class HistoryWorker implements OnModuleDestroy {
    private worker: Worker | null = null;
    private readonly logger = new Logger(HistoryWorker.name);

    constructor() {
        const redisOpts: RedisOptions = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT || 6379),
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: null
        };

        const concurrency = Number(process.env.IMPORT_WORKER_CONCURRENCY || 3);

        this.worker = new Worker(
            'history-queue',
            async (job: Job) => {
                this.logger.log(`Processing import job ${job.id}`);
                try {
                    await job.updateProgress({ step: 'starting' });

                    // const result = await this.adminService.importDocsJob(job.data.filePaths, async (p) => {
                    //     await job.updateProgress(p);
                    // });

                    await job.updateProgress({ step: 'finalizing' });

                    // return result;
                } catch (err) {
                    this.logger.error(`Job ${job.id} failed: ${(err as Error).message}`, (err as any).stack);
                    throw err;
                }
            },
            {
                connection: new IORedis(redisOpts),
                concurrency,
            },
        );

        this.worker.on('completed', (job) => {
            this.logger.log(`Job ${job.id} completed.`);
        });

        this.worker.on('failed', (job, err) => {
            this.logger.warn(`Job ${job?.id} failed: ${err.message}`);
        });

        this.worker.on('error', (err) => {
            this.logger.error('Worker error: ' + err.message);
        });
    }

    async onModuleDestroy() {
        if (this.worker) {
            try {
                await this.worker.close();
            } catch (err) {
                // ignore
            }
        }
    }
}
