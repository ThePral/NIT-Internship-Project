import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CycleCreateDto } from './dto';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class CycleService {
    constructor(private prisma: PrismaService, private adminService: AdminService) {}

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

    async deleteCycle(id: number) {
        await this.prisma.cycle.delete({ where: { id }});
        await this.adminService.deleteDocs(String(id));
        return { message: "Cycle Deleted Succesfuly" };
    }
}
