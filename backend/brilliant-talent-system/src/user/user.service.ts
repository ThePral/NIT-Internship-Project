import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/user.dto';
import { User } from '@prisma/client';
import * as argon from 'argon2'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    
    async editUser(user: User, dto: EditUserDto) {

        let hash: string | undefined;

        if (dto.current_password && dto.new_password) {
            const pwMatches = await argon.verify(user.hash_password, dto.current_password);
            if (!pwMatches) throw new ForbiddenException('رمز فعلی وارد شده نادرست می‌باشد');

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
}
