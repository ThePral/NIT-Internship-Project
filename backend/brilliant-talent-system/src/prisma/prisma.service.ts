import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SuperAdminService } from 'src/superAdmin/superAdmin.service';
import * as argon from 'argon2'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    private readonly logger = new Logger(PrismaService.name);

    constructor(){
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL
                }
            }
        })
    }
    async ensureSuperAdminExists() {
        const count = await this.superAdmin.count();
        if (count > 0) {
            this.logger.log('✅ Default SuperAdmin ensured successfully');
            return;
        }; // ✅ Already exists
    
        const username = process.env.SUPERADMIN_USERNAME;
        const password = process.env.SUPERADMIN_PASSWORD;
    
        if (!username || !password ) {
        throw new Error('Missing SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD, or SUPERADMIN_EMAIL in environment variables');
        }
    
        const hash = await argon.hash(password);
    
        await this.superAdmin.create({
        data: {
            username,
            hash_password: hash,
        },
        });
    
        this.logger.log('✅ Default SuperAdmin created successfully');
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Successfully connected to the database.');
            this.ensureSuperAdminExists();
        } catch (error) {
            this.logger.error('❌ Database connection failed:', error);
            process.exit(1);
        }
    }

    async cleanExcelsData() {
        return await this.$transaction([
            this.university.deleteMany(),
            this.minor.deleteMany(),
            this.user.deleteMany(),
            this.studentPriority.deleteMany(),
            this.acceptance.deleteMany(),
        ]);
    }

    cleanDB() {
        return this.$transaction([
            this.user.deleteMany(),
            this.admin.deleteMany(),
            this.superAdmin.deleteMany()
        ]);
    }
}
