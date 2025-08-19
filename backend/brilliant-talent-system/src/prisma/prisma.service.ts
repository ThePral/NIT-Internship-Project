import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    private readonly logger = new Logger(PrismaService.name);

    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    url: config.get("DATABASE_URL")
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

    cleanDB() {
        return this.$transaction([
            this.user.deleteMany(),
            this.admin.deleteMany(),
            this.superAdmin.deleteMany()
        ]);
    }
}
