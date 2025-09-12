// import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
// import puppeteer, { Browser, Page } from 'puppeteer';
// import { mkdtempSync, rmSync } from 'fs';
// import fs from 'fs/promises';
// import os from 'os';
// import path from 'path';

// @Injectable()
// export class PuppeteerService implements OnModuleDestroy {
//   private browser: Browser | null = null;
//   private readonly logger = new Logger(PuppeteerService.name);

//   private readonly MAX_CONCURRENT_PAGES = 6;
//   private activePages = 0;
//   private queue: Array<() => void> = [];

//   // create lazily when launching browser
//   private tempDir?: string;

//   private createTempDir(): string {
//     if (!this.tempDir) {
//       this.tempDir = mkdtempSync(path.join(os.tmpdir(), 'puppeteer-'));
//       this.logger.log(`Created puppeteer temp dir: ${this.tempDir}`);
//     }
//     return this.tempDir;
//   }

//   async getBrowser(): Promise<Browser> {
//     if (this.browser && this.browser.isConnected()) return this.browser;

//     const userDataDir = this.createTempDir();

//     this.browser = await puppeteer.launch({
//       headless: true,
//       userDataDir,
//       // optional: if you use puppeteer-core, set executablePath: process.env.CHROME_PATH
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-extensions',
//         '--disable-background-networking',
//         '--disk-cache-size=1',
//         '--media-cache-size=1',
//       ],
//     });

//     // handle unexpected disconnects
//     this.browser.on('disconnected', async () => {
//       this.logger.warn('Browser disconnected unexpectedly — clearing instance and cleaning temp dir');
//       this.browser = null;
//       // try to remove temp dir (best-effort)
//       if (this.tempDir) {
//         try {
//           rmSync(this.tempDir, { recursive: true, force: true });
//         } catch (err) {
//           this.logger.warn('Failed to remove temp dir after disconnect: ' + String(err));
//         }
//         this.tempDir = undefined;
//       }
//     });

//     this.logger.log('Launched Puppeteer browser instance');
//     return this.browser;
//   }

//   async acquirePage(): Promise<Page> {
//     await new Promise<void>((resolve) => {
//       const tryAcquire = () => {
//         if (this.activePages < this.MAX_CONCURRENT_PAGES) {
//           this.activePages++;
//           return resolve();
//         }
//         this.queue.push(tryAcquire);
//       };
//       tryAcquire();
//     });

//     const browser = await this.getBrowser();
//     const page = await browser.newPage();
//     await page.setBypassCSP(true);
//     await page.setViewport({ width: 1200, height: 800 });
//     return page;
//   }

//   async releasePage(page: Page) {
//     try {
//       await page.close();
//     } catch (err) {
//       this.logger.warn('Error closing page: ' + (err as Error).message);
//     } finally {
//       this.activePages = Math.max(0, this.activePages - 1);
//       const next = this.queue.shift();
//       if (next) next();
//     }
//   }

//   async onModuleDestroy() {
//     // close browser and remove temp dir
//     if (this.browser) {
//       try {
//         await this.browser.close();
//       } catch (err) {
//         this.logger.error('Error closing browser: ' + (err as Error).message);
//       }
//       this.browser = null;
//     }
//     console.log("aaaa")
    
//     if (this.tempDir) {
//         console.log("bbbb")
//         try {
//             console.log("cccc")
//             await fs.rm(this.tempDir, { recursive: true, force: true });
//             console.log("dddd")
//             this.logger.log(`Removed puppeteer temp dir: ${this.tempDir}`);
//         } catch (err) {
//             this.logger.warn('Failed to remove puppeteer temp dir: ' + String(err));
//         }
//         this.tempDir = undefined;
//     }
//   }
// }
