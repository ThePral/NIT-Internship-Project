import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SuperAdmin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { CreateSuperAdminDto, EditSuperAdminDto } from './dto';
import { CreateAdminDto, EditAdminDto } from 'src/admin/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class SuperAdminService {
    constructor(private prisma: PrismaService) {}

    async addSuperAdmin(dto: CreateSuperAdminDto) {

        const hash = await argon.hash(dto.password);

        const {password, ...superAdmindto} = dto;

        try {
            const superAdmin = await this.prisma.superAdmin.create({
                data: {
                    hash_password: hash,
                    ...superAdmindto
                }
            });

            const { hash_password, ...safeSuperAdmin} = superAdmin;
            return safeSuperAdmin;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials Taken");
                }
            }
            throw error;
        }
    }

    async editSuperAdmin(superAdmin: SuperAdmin, dto: EditSuperAdminDto) {

        let hash: string | undefined;

        if (dto.current_password && dto.new_password) {
            const pwMatches = await argon.verify(superAdmin.hash_password, dto.current_password);
            if (!pwMatches) throw new ForbiddenException('Creditentioal incorrrect');

            hash = await argon.hash(dto.new_password);
        }

        const {current_password, new_password, ...superAdmindto} = dto;

        const updatedSuperAdmin = await this.prisma.superAdmin.update({
            where: {
                id: superAdmin.id
            },
            data: {
                hash_password: hash,
                ...superAdmindto
            }
        });

        const { hash_password, ...safeSuperAdmin} = updatedSuperAdmin;
        return safeSuperAdmin;
    }


    async addAdmin(dto: CreateAdminDto) {

        const hash = await argon.hash(dto.password);

        const {password, ...admindto} = dto;

        try {
            const admin = await this.prisma.admin.create({
                data: {
                    hash_password: hash,
                    ...admindto
                }
            });    

            const { hash_password, ...safeAdmin} = admin;
            return safeAdmin;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials Taken");
                }
            }
            throw error;
        }
    }

    async getAdmins() {
        return await this.prisma.admin.findMany({
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                username: true
            }
        });
    }

    async getAdminById(adminId: number) {
        const admin = await this.prisma.admin.findUnique({
            where: {
                id: adminId
            }
        });
        if (!admin) throw new NotFoundException();

        const { hash_password, ...safeAdmin} = admin;
        return safeAdmin;
    }

    async editAdminById(adminId: number, dto: EditAdminDto) {

        const admin = await this.prisma.admin.findUnique({
            where: {
                id: adminId
            }
        });
        if (!admin) throw new NotFoundException();

        let hash: string | undefined;

        if (dto.current_password && dto.new_password) {
            const pwMatches = await argon.verify(admin.hash_password, dto.current_password);
            if (!pwMatches) throw new ForbiddenException('Creditentioal incorrrect');

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

    async deleteAdminById(adminId: number) {
        const admin = await this.prisma.admin.findUnique({
            where: {
                id: adminId
            }
        });
        if (!admin) throw new NotFoundException();

        await this.prisma.admin.delete({
            where: {
                id: adminId
            }
        });
    }

}
