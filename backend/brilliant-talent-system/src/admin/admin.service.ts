import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
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
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
    
    constructor(
        private prisma: PrismaService, 
        private importService: ImportService, 
        private allocationService: AllocationService,
        private srv: SrPdfService,
        private queueService: QueueService,
        private readonly redisService: RedisService
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

    async getUsers(cycleId: number) {
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
        return await this.prisma.user.findMany({ where: { cycleId }});
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

    // private readonly patterns: Record<string, RegExp> = {
    //     // Matches: students1_405, Students1_405, STUDENTS1_405, students1-405, etc.
    //     students1: /^students1[-_]?\d+\.(xlsx|xls)$/i,
        
    //     // Matches: students2_405, Students2_405, STUDENTS2_405, students2-405, etc.
    //     students2: /^students2[-_]?\d+\.(xlsx|xls)$/i,
        
    //     // Matches: minors_405, Minors_405, MINORS_405, minors-405, etc.
    //     minors: /^minors[-_]?\d+\.(xlsx|xls)$/i,
        
    //     // Matches: universities_405, Universities_405, UNIVERSITIES_405, universities-405, etc.
    //     universities: /^universities[-_]?\d+\.(xlsx|xls)$/i,
    // };

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

    private async ExtractCycleExcelsPath(cycleId: string): Promise<ExcelPaths> {

        if (!cycleId) {
            throw new BadRequestException('cycleId is required');
        }

        const files = await this.readDirSafe();
        const dir = this.getResourcesDir();

        const filePaths: ExcelPaths = {
            students1: null,
            students2: null,
            minors: null,
            universities: null,
        };

        // Generate patterns for the specific cycleId
        const patternsWithCycle: Record<string, RegExp> = {
            students1: new RegExp(`^students1[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
            students2: new RegExp(`^students2[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
            minors: new RegExp(`^minors[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
            universities: new RegExp(`^universities[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
        };

        for (const f of files) {
            if (!f.match(/\.(xlsx|xls)$/i)) continue;
            for (const [key, pattern] of Object.entries(patternsWithCycle)) {
                if (pattern.test(f)) {
                    filePaths[key as keyof ExcelPaths] = path.join(dir, f);
                    break;
                }
            }
        }

        return filePaths;
    }

    async listExcelPresence(cycleId: string): Promise<PresenceResult> {
        if (!cycleId) {
            throw new BadRequestException('cycleId is required');
        }

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

        // Map of expected basenames to their patterns
        const expectedFiles = {
            students1: `Students1_${cycleId}`,
            students2: `Students2_${cycleId}`,
            minors: `minors_${cycleId}`,
            universities: `universities_${cycleId}`
        };

        for (const f of files) {
            // only consider .xls/.xlsx files
            if (!f.match(/\.(xlsx|xls)$/i)) continue;

            // Get filename without extension
            const nameWithoutExt = f.replace(/\.(xlsx|xls)$/i, '');
            
            // Check against expected patterns
            for (const [key, expectedName] of Object.entries(expectedFiles)) {
                if (nameWithoutExt === expectedName) {
                    present[key as keyof PresenceResult].exists = true;
                    const filePath = path.join(this.getResourcesDir(), f);
                    try {
                        const stats = fs.statSync(filePath);
                        present[key as keyof PresenceResult].date_created = stats.mtime;
                    } catch (error) {
                        console.error(`Error reading file stats for ${f}:`, error);
                    }
                    break; // Found match for this file, move to next file
                }
            }
        }

        return present;
    }

    async deleteDocs(cycleId: string) {
        // const files = await this.readDirSafe();
        // const dir = this.getResourcesDir();
        
        // for (const f of files) {
        //     const abs = path.join(dir, f);
            
        //     try {
        //         // use unlinkSync or promises - use promises for non-blocking
        //         await fs.promises.unlink(abs);
        //         // deleted[key].push(f);
        //     } catch (err) {
        //         // Log and continue; don't throw so we try to delete other files.
        //         console.warn(`Failed to delete ${abs}: ${(err as Error).message}`);
        //     }
        // }
        
        // await this.prisma.cleanExcelsData();
        
        const filePaths = await this.ExtractCycleExcelsPath(cycleId);

        for (const path of Object.values(filePaths)) {
            try {
                if (path) await fs.promises.unlink(path);
            } catch (err) {
                // Log and continue; don't throw so we try to delete other files.
                this.logger.warn(`Failed to delete ${path}: ${(err as Error).message}`);
            }
        }

        await this.importService.deleteCycleData(Number(cycleId));

        return { message: "cycle resource files deleted succesfuly" };
    }

    async importDocsJob(filePaths: ExcelPaths, cycleId: number, progressCb?: (progress: number | object) => void) {

        await this.importService.deleteCycleData(cycleId);

        progressCb?.({message: "cycle data deleted"});
        
        const hashPassword = true;
        
        await this.importService.importUniversities(filePaths["universities"]!, cycleId);
        progressCb?.({message: "universities data imported"});
        await this.importService.importMinors(filePaths["minors"]!, cycleId);
        progressCb?.({message: "minors data imported"});
        await this.importService.importStudents(filePaths["students1"]!, 1, cycleId, {hashPassword});
        progressCb?.({message: "students1 data imported"});
        await this.importService.importStudents(filePaths["students2"]!, 2, cycleId, {hashPassword});
        progressCb?.({message: "students2 data imported"});
    }

    async importDocs(cycleId: string) {

        // if (!cycleId) {
        //     throw new BadRequestException('cycleId is required');
        // }

        // const files = await this.readDirSafe();
        // const dir = this.getResourcesDir();

        // const filePaths: ExcelPaths = {
        //     students1: null,
        //     students2: null,
        //     minors: null,
        //     universities: null,
        // };

        // // Generate patterns for the specific cycleId
        // const patternsWithCycle: Record<string, RegExp> = {
        //     students1: new RegExp(`^students1[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
        //     students2: new RegExp(`^students2[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
        //     minors: new RegExp(`^minors[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
        //     universities: new RegExp(`^universities[-_]${cycleId}\\.(xlsx|xls)$`, 'i'),
        // };

        // for (const f of files) {
        //     if (!f.match(/\.(xlsx|xls)$/i)) continue;
        //     for (const [key, pattern] of Object.entries(patternsWithCycle)) {
        //         if (pattern.test(f)) {
        //             filePaths[key as keyof ExcelPaths] = path.join(dir, f);
        //             break;
        //         }
        //     }
        // }

        const filePaths = await this.ExtractCycleExcelsPath(cycleId);

        
        if (!filePaths.minors || !filePaths.universities || !filePaths.students1 || !filePaths.students2) {
            throw new BadRequestException("همه اکسل ها باید آپلود شده باشند");
        }

        const job = await this.queueService.importQueue.add('import', {filePaths, cycleId: Number(cycleId)});

        return {
            message: 'File imports queued',
            jobId: job.id,
        };
    }

    async allocateUserAcceptances(cycleId: number) {
        const isPdfCreating = await this.redisService.get("pdfCreating");
        if(isPdfCreating == "true" || isPdfCreating == true){
            throw new BadRequestException("پی دی اف ها در حال ساخت می باشند ، لطفا صبور باشید");
        }
        await this.redisService.set("pdfCreating","true");
        
        try {
            const result = await this.allocationService.runAllocation(cycleId);
            this.srv.generateAllPDFs( 'Vazir',{ regular: 'assets/fonts/Vazir-Regular.ttf', bold: 'assets/fonts/Vazir-Bold.ttf' }, cycleId);
            return {
                message: "User Acceptance Calculated",
                data: result
            };
            
        } catch (error) {
            this.redisService.set("pdfCreating","error");
            throw new BadRequestException(error)
        }
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

    async userAcceptanceData(cycleId: number) {

        const data: userResults[] = await this.prisma.user.findMany({
            select: {
                firstname: true,
                lastname: true,
                points: true,
                majorName: true,
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
            },
            where: { cycleId }
        });

        if (data.length === 0) throw new NotFoundException("نتیجه ای برای این دوره وجود ندارد");

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
    async buildSr2() {
        return this.srv.generateSr2(
            './output/sr2.pdf',
            'Vazir',
            { regular: 'assets/fonts/Vazir-Regular.ttf', bold: 'assets/fonts/Vazir-Bold.ttf' }
        );
    }
    async buildSr3() {
        return this.srv.generateSr3(
            './output/sr3.pdf',
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

    async pdfChecker(runId: number) {
        const isPdfCreating = await this.redisService.get("pdfCreating");
        console.log(isPdfCreating)
        let run = await this.prisma.allocationRun.findFirst({ orderBy: { createdAt: 'desc' } });
        if (!run) {
            return({
                result: {
                    sr0: false,
                    sr1: false,
                    sr2: false,
                    sr3: false,
                    sr4: false,
                }
            });
        };
        if(run.id == runId){
            if(isPdfCreating == "true" || isPdfCreating == true){
                return({message : "پی دی اف ها در حال ساخت می باشند ، لطفا صبور باشید",
                    result: {
                        sr0: false,
                        sr1: false,
                        sr2: false,
                        sr3: false,
                        sr4: false,
                    }
                });
            }
        }
        
        // if(isPdfCreating == "error"){
        //     return({message : "مشکلی در ساخت پی دی اف ها به وجود آمد، لطفا دوباره تلاش کنید",
        //         result: {
        //             sr0: false,
        //             sr1: false,
        //             sr2: false,
        //             sr3: false,
        //             sr4: false,
        //         }
        //     });
        // }
        const filePath0 = path.join(process.cwd(), `./output/sr0_${runId}.pdf`);
        const filePath1 = path.join(process.cwd(), `./output/sr1_${runId}.pdf`);
        const filePath2 = path.join(process.cwd(), `./output/sr2_${runId}.pdf`);
        const filePath3 = path.join(process.cwd(), `./output/sr3_${runId}.pdf`);
        const filePath4 = path.join(process.cwd(), `./output/sr4_${runId}.pdf`);
        return({
            result:{
                sr0: fs.existsSync(filePath0),
                    sr1: fs.existsSync(filePath1),
                    sr2: fs.existsSync(filePath2),
                    sr3: fs.existsSync(filePath3),
                    sr4: fs.existsSync(filePath4)
            }
        })

    }

    // async downloadsr0() {
    //     const filePath = path.join(process.cwd(), `./output/sr0.pdf`);
    //     if(!fs.existsSync(filePath)){
    //         throw new BadRequestException("فایل وجود ندارد");
    //     }
    //     const stats = fs.statSync(filePath);

    //     // Set proper headers for PDF download
    //     res.setHeader('Content-Disposition', `attachment; filename="${req.params.roomID}-${pdfHeader}.pdf"`);
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Length', stats.size);
    //     res.setHeader('Cache-Control', 'no-cache');

    //     // Stream the file (NO encoding for binary files!)
    //     const fileStream = fs.createReadStream(filePath);

    //     fileStream.pipe(res);

    //     // Handle stream errors
    //     fileStream.on('error', (error) => {
    //         console.error('File stream error:', error);
    //         if (!res.headersSent) {
    //             res.status(500).json({ error: 'Error reading file' });
    //         }
    //     });

    //     // Handle client disconnect
    //     req.on('close', () => {
    //         fileStream.destroy();
    //     });
        
    // }

    async downloadsr0(cycleId: number): Promise<StreamableFile> {
        const filePath = path.join(process.cwd(), `./output/sr0_${cycleId}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            throw new BadRequestException("فایل وجود ندارد");
        }

        const fileStream = fs.createReadStream(filePath);
        
        return new StreamableFile(fileStream, {
            disposition: `attachment; filename="sr0_${cycleId}.pdf"`,
            type: 'application/pdf',
        });
    }
    async downloadsr1(cycleId: number): Promise<StreamableFile> {
        const filePath = path.join(process.cwd(), `./output/sr1_${cycleId}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            throw new BadRequestException("فایل وجود ندارد");
        }

        const fileStream = fs.createReadStream(filePath);
        
        return new StreamableFile(fileStream, {
            disposition: `attachment; filename="sr1_${cycleId}.pdf"`,
            type: 'application/pdf',
        });
    }
    async downloadsr2(cycleId: number): Promise<StreamableFile> {
        const filePath = path.join(process.cwd(), `./output/sr2_${cycleId}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            throw new BadRequestException("فایل وجود ندارد");
        }

        const fileStream = fs.createReadStream(filePath);
        
        return new StreamableFile(fileStream, {
            disposition: `attachment; filename="sr2_${cycleId}.pdf"`,
            type: 'application/pdf',
        });
    }
    async downloadsr3(cycleId: number): Promise<StreamableFile> {
        const filePath = path.join(process.cwd(), `./output/sr3_${cycleId}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            throw new BadRequestException("فایل وجود ندارد");
        }

        const fileStream = fs.createReadStream(filePath);
        
        return new StreamableFile(fileStream, {
            disposition: `attachment; filename="sr3_${cycleId}.pdf"`,
            type: 'application/pdf',
        });
    }
    async downloadsr4(cycleId: number): Promise<StreamableFile> {
        const filePath = path.join(process.cwd(), `./output/sr4_${cycleId}.pdf`);
        
        if (!fs.existsSync(filePath)) {
            throw new BadRequestException("فایل وجود ندارد");
        }

        const fileStream = fs.createReadStream(filePath);
        
        return new StreamableFile(fileStream, {
            disposition: `attachment; filename="sr4_${cycleId}.pdf"`,
            type: 'application/pdf',
        });
    }
}
