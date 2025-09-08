import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Get('imports/:id')
    async getImportStatus(@Param('id') id: string) {
        const job = await this.queueService.importQueue.getJob(id);
        if (!job) {
            throw new NotFoundException();
        }

        const state = await job.getState(); // 'completed', 'failed', 'active', 'waiting', ...
        const progress = job.progress;
        const result = state === 'completed' ? job.returnvalue : null;
        const failedReason = job.failedReason ?? null;

        return {
            jobId: job.id,
            state,
            progress,
            result,
            failedReason,
        };
    }
}
