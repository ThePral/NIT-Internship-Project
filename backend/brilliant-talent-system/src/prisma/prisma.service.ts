import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


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

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Successfully connected to the database.');
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
