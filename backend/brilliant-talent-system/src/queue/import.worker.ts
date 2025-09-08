import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class ImportWorker implements OnModuleDestroy {
    private worker: Worker | null = null;
    private readonly logger = new Logger(ImportWorker.name);

    constructor( private readonly adminService: AdminService ) {
        const redisOpts: RedisOptions = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT || 6379),
            maxRetriesPerRequest: null
        };

        // concurrency: how many imports this worker can run in parallel
        const concurrency = Number(process.env.IMPORT_WORKER_CONCURRENCY || 2);

        this.worker = new Worker(
            'import-queue',
            async (job: Job) => {
                this.logger.log(`Processing import job ${job.id} (file=${job.data.path})`);
                try {
                    await job.updateProgress({ step: 'starting' });

                    const result = await this.adminService.importDocs(job.data.path, job.data.type, async (p) => {
                        await job.updateProgress(p);
                    });

                    await job.updateProgress({ step: 'finalizing' });

                    return result;
                } catch (err) {
                    this.logger.error(`Job ${job.id} failed: ${(err as Error).message}`, (err as any).stack);
                    throw err; // worker will handle retry/backoff per Queue defaultJobOptions
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
