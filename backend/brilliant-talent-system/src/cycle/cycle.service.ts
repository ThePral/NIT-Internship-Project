import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CycleCreateDto } from './dto';

@Injectable()
export class CycleService {
    constructor(private prisma: PrismaService) {}

    async createCycle(body: CycleCreateDto) {
        const cycle = await this.prisma.cycle.create({
            data: body
        });

        return {
            message: "دوره با موفقیت اضافه شد",
            data: cycle
        }
    }

    async getAllCycles() {
        return await this.prisma.cycle.findMany();
    }
}
