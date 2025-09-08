import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { EditAdminDto, PresenceResult } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto, EditUserByAdminDto } from 'src/user/dto/user.dto';
import { ImportService } from 'src/admissions/import.service';
import { AllocationService } from 'src/admissions/allocation.service';
import { SrPdfService } from 'src/admissions/srpdf.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService, 
        private importService: ImportService, 
        private allocationService: AllocationService,
        private srv: SrPdfService
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

    async addUser(dto: CreateUserDto) {

        const hash = await argon.hash(dto.password);

        const {password, ...userdto} = dto;

        try {
            const user = await this.prisma.user.create({
                data: {
                    hash_password: hash,
                    ...userdto
                }
            });    

            const { hash_password, ...safeUser} = user;
            return safeUser;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException('اطلاعات وارد شده مورد استفاده قرار گرفته اند');
                }
            }
            throw error;
        }
    }

    async getUsers() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                username: true,
                firstname: true,
                lastname: true,
                points: true,
                grade: true,
                universityId: true
            }
        });
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

    async importDocs(filePath: string, type: string, progressCb?: (progress: number | object) => void) {
        switch (type) {
            case "universities":
                return await this.importService.importUniversities(filePath);
            case "minors":
                return await this.importService.importMinors(filePath);
            case "students1":
                return await this.importService.importStudents(filePath, 1, {hashPassword: true});
            case "students2":
                return await this.importService.importStudents(filePath, 2, {hashPassword: true});
            default:
                break;
        }
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
            students1: false,
            students2: false,
            minors: false,
            universities: false,
        };

        for (const f of files) {
            // only consider .xls/.xlsx files
            if (!f.match(/\.(xlsx|xls)$/i)) continue;

            for (const key of Object.keys(this.patterns)) {
                if (this.patterns[key].test(f)) {
                    // (present as any)[key] = true;
                    present[key] = true
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

    async allocateUserAcceptances() {
        const result = await this.allocationService.runAllocation(1);
        return {
            message: "User Acceptance Calculated",
            data: result
        };
    }

    async buildSr0() {
        return this.srv.generateSr0(
            './output/sr0.pdf',
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
