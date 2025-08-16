import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl } = req;
        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const delay = Date.now() - start;

            const coloredStatus = this.colorStatus(statusCode);
            const logMessage = `${method} ${originalUrl} ${coloredStatus} ${chalk.yellow(`+${delay}ms`)}`;

            this.logger.log(logMessage);
        });

        next();
    }

    private colorStatus(status: number): string {
        if (status >= 500) return chalk.red(status.toString());
        if (status >= 400) return chalk.yellow(status.toString());
        if (status >= 300) return chalk.cyan(status.toString());
        return chalk.green(status.toString());
    }
}
