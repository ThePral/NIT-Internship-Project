import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { EditAdminDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto, EditUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}
    
    async editAdmin(admin: Admin, dto: EditAdminDto) {

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
                    throw new ForbiddenException("Credentials Taken");
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
                points: true
            }
        });
    }

    async getUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new NotFoundException();

        const { hash_password, ...safeUser} = user;
        return safeUser;
    }

    async editUserById(userId: number, dto: EditUserDto) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new NotFoundException();

        let hash: string | undefined;

        if (dto.current_password && dto.new_password) {
            const pwMatches = await argon.verify(user.hash_password, dto.current_password);
            if (!pwMatches) throw new ForbiddenException('Creditentioal incorrrect');

            hash = await argon.hash(dto.new_password);
        }

        const {current_password, new_password, ...userdto} = dto;

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
        if (!user) throw new NotFoundException();

        await this.prisma.user.delete({
            where: {
                id: userId
            }
        });
    }

    async calculateUsersPoints() {

    }
}
