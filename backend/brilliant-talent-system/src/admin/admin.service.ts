import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { EditAdminDto, ExcelPaths, PresenceResult, userResults } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto, EditUserByAdminDto } from 'src/user/dto/user.dto';
import { ImportService } from 'src/admissions/import.service';
import { AllocationService } from 'src/admissions/allocation.service';
import { SrPdfService } from 'src/admissions/srpdf.service';
import * as fs from 'fs';
import * as path from 'path';
import { QueueService } from 'src/queue/queue.service';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService, 
        private importService: ImportService, 
        private allocationService: AllocationService,
        private srv: SrPdfService,
        private queueService: QueueService,
    ) {}
    
    async editAdmin(admin: Admin, dto: EditAdminDto) {

        let hash: string | undefined;

        if (dto.current_password && dto.new_password) {
            const pwMatches = await argon.verify(admin.hash_password, dto.current_password);
            if (!pwMatches) throw new ForbiddenException('رمز فعلی وارد شده نادرست می‌باشد');

            hash = await argon.hash(dto.new_password);
        }

        const {current_password, new_password, ...admindto} = dto;

        const updatedAdmin = await this.prisma.admin.update({
            where: {
                id: admin.id
            },
            data: {
                hash_password: hash,
                ...admindto
            }
        });

        const { hash_password, ...safeAdmin} = updatedAdmin;
        return safeAdmin;
    }

    // async addUser(dto: CreateUserDto) {

    //     const hash = await argon.hash(dto.password);

    //     const {password, ...userdto} = dto;

    //     try {
    //         const user = await this.prisma.user.create({
    //             data: {
    //                 hash_password: hash,
    //                 ...userdto
    //             }
    //         });    

    //         const { hash_password, ...safeUser} = user;
    //         return safeUser;

    //     } catch (error) {
    //         if (error instanceof PrismaClientKnownRequestError) {
    //             if (error.code === "P2002") {
    //                 throw new ForbiddenException('اطلاعات وارد شده مورد استفاده قرار گرفته اند');
    //             }
    //         }
    //         throw error;
    //     }
    // }

    async getUsers() {
        // return await this.prisma.user.findMany({
        //     select: {
        //         id: true,
        //         createdAt: true,
        //         updatedAt: true,
        //         username: true,
        //         firstname: true,
        //         lastname: true,
        //         points: true,
        //         grade: true,
        //         universityId: true
        //     }
        // });
        return await this.prisma.user.findMany();
    }

    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new NotFoundException('یافت نشد');

        const { hash_password, ...safeUser} = user;
        return safeUser;
    }

    async editUserById(userId: number, dto: EditUserByAdminDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new NotFoundException('یافت نشد');

        let hash: string | undefined;

        if (dto.new_password) {
            hash = await argon.hash(dto.new_password);
        }

        const {new_password, ...userdto} = dto;

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                hash_password: hash,
                ...userdto
            }
        });

        const { hash_password, ...safeUser} = updatedUser;
        return safeUser;
    }

    async deleteUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new NotFoundException('یافت نشد');

        await this.prisma.user.delete({
            where: {
                id: userId
            }
        });
    }

    private readonly patterns: Record<string, RegExp> = {
        students1: /students[^a-z0-9]*1/i,       // matches Students_1, Students-1, students1, etc.
        students2: /students[^a-z0-9]*2/i,       // matches Students_2, Students2, ...
        minors: /\bminors?\b/i,                  // minor or minors
        universities: /\buniversit/i,            // university or universities (partial match)
    };

    private getResourcesDir(): string {
        return path.resolve(process.cwd(), 'resources');
    }

    private async readDirSafe(): Promise<string[]>  {
        const dir = this.getResourcesDir();

        try {
            // if directory does not exist, return empty list
            if (!fs.existsSync(dir)) return [];
            const files = await fs.promises.readdir(dir);
            return files;
        } catch (err) {
            console.error((err as Error).message);
            throw new InternalServerErrorException('Failed to read resources directory');
        }
    }

    async listExcelPresence(): Promise<PresenceResult> {

        const files = await this.readDirSafe();

        const present: PresenceResult = {
            students1: {
                exists: false,
                date_created: null
            },
            students2: {
                exists: false,
                date_created: null
            },
            minors: {
                exists: false,
                date_created: null
            },
            universities: {
                exists: false,
                date_created: null
            },
        };

        for (const f of files) {
            // only consider .xls/.xlsx files
            if (!f.match(/\.(xlsx|xls)$/i)) continue;

            for (const key of Object.keys(this.patterns)) {
                if (this.patterns[key].test(f)) {
                    // (present as any)[key] = true;
                    present[key].exists = true;
                    const filePath = path.join(this.getResourcesDir(), f);
                    try {
                        const stats = fs.statSync(filePath)
                        present[key].date_created = stats.birthtime;
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        }

        return present;
    }

    async deleteDocs() {
        const files = await this.readDirSafe();
        const dir = this.getResourcesDir();

        for (const f of files) {
            const abs = path.join(dir, f);

            try {
                // use unlinkSync or promises - use promises for non-blocking
                await fs.promises.unlink(abs);
                // deleted[key].push(f);
            } catch (err) {
                // Log and continue; don't throw so we try to delete other files.
                console.warn(`Failed to delete ${abs}: ${(err as Error).message}`);
            }
        }
            
        await this.prisma.cleanExcelsData();

        return { message: "all resources files deleted succesfuly" };
    }

    async importDocsJob(filePaths: ExcelPaths, progressCb?: (progress: number | object) => void) {

        const hashPassword = true;
        
        await this.importService.importUniversities(filePaths["universities"]!);
        progressCb?.({message: "universities data imported"});
        await this.importService.importMinors(filePaths["minors"]!);
        progressCb?.({message: "minors data imported"});
        await this.importService.importStudents(filePaths["students1"]!, 1, {hashPassword});
        progressCb?.({message: "students1 data imported"});
        await this.importService.importStudents(filePaths["students2"]!, 2, {hashPassword});
        progressCb?.({message: "students2 data imported"});
    }

    async importDocs() {

        const files = await this.readDirSafe();
        const dir = this.getResourcesDir();

        const filePaths: ExcelPaths = {
            students1: null,
            students2: null,
            minors: null,
            universities: null,
        };

        for (const f of files) {
            if (!f.match(/\.(xlsx|xls)$/i)) continue;
            for (const key of Object.keys(this.patterns)) {
                if (this.patterns[key].test(f)) {
                    filePaths[key] = path.join(dir, f);
                }
            }
        }

        
        if (!filePaths.minors || !filePaths.universities || !filePaths.students1 || !filePaths.students2) {
            throw new BadRequestException("همه اکسل ها باید آپلود شده باشند");
        }

        const job = await this.queueService.importQueue.add('import', {filePaths});

        return {
            message: 'File imports queued',
            jobId: job.id,
        };
    }

    async allocateUserAcceptances() {
        const result = await this.allocationService.runAllocation(1);
        return {
            message: "User Acceptance Calculated",
            data: result
        };
    }

    async allocationRunsData() {
        return await this.prisma.allocationRun.findMany();
    }

    async removeAllocationRunById(runId: number) {
        const run = await this.prisma.allocationRun.findUnique({
            where: { id: runId }
        });
        if (!run) throw new NotFoundException('یافت نشد');

        return await this.prisma.allocationRun.delete({
            where: { id: runId }
        });
    }

    async allocationHistoryData(runId: number) {
        return await this.prisma.allocationHistory.findMany({
            where: { runId }
        });
    }

    async userAcceptanceData() {

        const data: userResults[] = await this.prisma.user.findMany({
            select: {
                firstname: true,
                lastname: true,
                points: true,
                university: {
                    select: {
                        name: true
                    }
                },
                priorities: {
                    orderBy: {
                        priority: 'asc'
                    },
                    select: {
                        isAccepted: true,
                        priority: true,
                        minor: {
                            select: {
                                name: true,
                                req:true,
                                capacity: true
                            }
                        }
                    }
                }
            }
        });

        return data;
    }

    async buildSr0() {
        return this.srv.generateSr0(
            './output/sr0.pdf',
            'Vazir',
            { regular: 'assets/fonts/Vazir-Regular.ttf', bold: 'assets/fonts/Vazir-Bold.ttf' }
        );
    }
    async buildSr1() {
        return this.srv.generateSr1(
            './output/sr1.pdf',
            'Vazir',
            { regular: 'assets/fonts/Vazir-Regular.ttf', bold: 'assets/fonts/Vazir-Bold.ttf' }
        );
    }
    async buildSr4() {
        return this.srv.generateSr4(
            './output/sr4.pdf',
            'Vazir',
            { regular: 'assets/fonts/Vazir-Regular.ttf', bold: 'assets/fonts/Vazir-Bold.ttf' }
        );
    }

}
