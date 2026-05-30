import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CycleCreateDto } from './dto';
import { AdminService } from 'src/admin/admin.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CycleService {
    constructor(private prisma: PrismaService, private adminService: AdminService) {}

    async createCycle(body: CycleCreateDto) {
        try {
            const cycle = await this.prisma.cycle.create({
                data: body
            });

            return {
                message: "دوره با موفقیت اضافه شد",
                data: cycle
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException('دوره با این نام از قبل وجود دارد');
            }
            throw error;
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
