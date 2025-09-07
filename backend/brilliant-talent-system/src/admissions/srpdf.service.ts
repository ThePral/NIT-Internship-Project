import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { PuppeteerService } from './puppeteer.service';
import { AcceptedUser, MinorAcceptance } from './dto/srpdf-service';
import { Sr4AcceptedUser, Sr4MinorAcceptance } from './dto/srpdf-service/sr4.dto';

@Injectable()
export class SrPdfService {
    private readonly logger = new Logger(SrPdfService.name);

    constructor(private readonly prisma: PrismaService, private puppeteerService: PuppeteerService) {}

    private toAbsolute(p: string) {
        if (path.isAbsolute(p)) return p;
        return path.resolve(process.cwd(), p);
    }

    private loadFontAsBase64(filePath: string) {
        const abs = this.toAbsolute(filePath);
        if (!fs.existsSync(abs)) {
            throw new Error(`Font file not found: ${abs}`);
        }
        const buffer = fs.readFileSync(abs);
        return buffer.toString('base64');
    }

    private escapeHtml(s: string) {
        return String(s || '').replace(/[&<>"']/g, (c) => {
            switch (c) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return c;
            }
        });
    }

    private async convertHtmlToPdfPuppeteer(html: string, outPath: string) {

        // const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await this.puppeteerService.acquirePage();
        try {
            // const page = await browser.newPage();
            // set content and wait for layout
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Create out directory if needed
            const outDir = path.dirname(outPath);
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

            await page.pdf({
                path: outPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '15mm', bottom: '15mm', left: '10mm', right: '10mm' },
            });

            this.logger.log(`PDF written to ${outPath}`);
        } finally {
            // await browser.close();
            await this.puppeteerService.releasePage(page);
        }

    }

    /**
     * Build the HTML string for sr0 using the provided minors array.
     * Embeds fonts (base64) in a style block so puppeteer/Chromium uses them.
     */
    private buildSr0Html(minors: MinorAcceptance[], fontFamily: string, fontFiles: { regular: string; bold?: string }) {
        // Embed fonts as base64 @font-face
        const regularAbs = this.toAbsolute(fontFiles.regular);
        const regularB64 = this.loadFontAsBase64(regularAbs);
        const regularExt = path.extname(regularAbs).replace('.', '') || 'ttf';
        const boldB64 = fontFiles.bold ? this.loadFontAsBase64(this.toAbsolute(fontFiles.bold)) : regularB64;
        const boldExt = fontFiles.bold ? path.extname(this.toAbsolute(fontFiles.bold)).replace('.', '') : regularExt;

        const fontCss = `
            @font-face {
                font-family: '${fontFamily}';
                src: url('data:font/${regularExt};base64,${regularB64}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: '${fontFamily}';
                src: url('data:font/${boldExt};base64,${boldB64}') format('truetype');
                font-weight: bold;
                font-style: normal;
            }
        `;

        // Filter minors with at least one accepted user
        const used = minors.filter(m => Array.isArray(m.accepted) && m.accepted.length > 0);

        // Build table rows - only show minor name for first student in each minor
        let rowsHtml = '';
        let index = 1;
        for (const m of used) {
            for (let i = 0; i < m.accepted.length; i++) {
                const a = m.accepted[i];
                rowsHtml += '<tr>';
                
                // First column (ردیف) - only show for first student in each minor
                if (i === 0) {
                    rowsHtml += `<td style="text-align:center; vertical-align:middle;">${index}</td>`;
                } else {
                    rowsHtml += '<td></td>';
                }
                
                // Second column (رشته قبولی) - only show for first student in each minor
                if (i === 0) {
                    rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(m.minorName)}</td>`;
                } else {
                    rowsHtml += '<td></td>';
                }
                
                // Third column (افراد قبول شده)
                rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(a.fullName)}</td>`;
                
                // Fourth column (دانشگاه) - include university grade if available
                let universityDisplay = a.university;
                if (a.uniGrade) {
                    universityDisplay += ` (${a.uniGrade})`;
                }
                rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(universityDisplay)}</td>`;
                
                // Fifth column (امتیاز)
                rowsHtml += `<td style="text-align:center; vertical-align:middle;">${this.escapeHtml(String(a.points))}</td>`;
                
                rowsHtml += '</tr>';
            }
            index++;
        }

        if (used.length === 0) {
            rowsHtml = `<tr><td colspan="5" style="text-align:center">-</td></tr>`;
        }

        // Full HTML with improved styling
        const html = `
            <!doctype html>
            <html lang="fa">
                <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <style>
                        ${fontCss}
                        body {
                            font-family: '${fontFamily}', sans-serif;
                            direction: rtl;
                            text-align: right;
                            margin: 0;
                            padding: 15mm 10mm;
                            color: #000;
                            line-height: 1.5;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 10px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 22px;
                            font-weight: bold;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            border: 2px solid #333;
                            font-size: 12px;
                        }
                        th, td {
                            border: 1px solid #333;
                            padding: 8px 5px;
                            word-break: break-word;
                        }
                        th {
                            background-color: #e0e0e0;
                            font-weight: bold;
                            text-align: center;
                            padding: 10px 5px;
                        }
                        /* Column widths */
                        th:nth-child(1), td:nth-child(1) { width: 8%; }  /* ردیف */
                        th:nth-child(2), td:nth-child(2) { width: 32%; } /* رشته قبولی */
                        th:nth-child(3), td:nth-child(3) { width: 25%; } /* افراد قبول شده */
                        th:nth-child(4), td:nth-child(4) { width: 25%; } /* دانشگاه */
                        th:nth-child(5), td:nth-child(5) { width: 10%; } /* امتیاز */
                        
                        /* Ensure proper RTL alignment */
                        td:empty {
                            border-left: 1px solid #333;
                            border-right: 1px solid #333;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>بسمه تعالی</h1>
                        <h1>نتایج قبولی رشته‌ها</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ردیف</th>
                                <th>رشته‌ی قبولی</th>
                                <th>افراد قبول شده</th>
                                <th>دانشگاه</th>
                                <th>امتیاز</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        return html;
    }

    private buildSr4Html(minors: Sr4MinorAcceptance[], fontFamily: string, fontFiles: { regular: string; bold?: string }) {
        // Embed fonts as base64 @font-face
        const regularAbs = this.toAbsolute(fontFiles.regular);
        const regularB64 = this.loadFontAsBase64(regularAbs);
        const regularExt = path.extname(regularAbs).replace('.', '') || 'ttf';
        const boldB64 = fontFiles.bold ? this.loadFontAsBase64(this.toAbsolute(fontFiles.bold)) : regularB64;
        const boldExt = fontFiles.bold ? path.extname(this.toAbsolute(fontFiles.bold)).replace('.', '') : regularExt;

        const fontCss = `
            @font-face {
                font-family: '${fontFamily}';
                src: url('data:font/${regularExt};base64,${regularB64}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
            @font-face {
                font-family: '${fontFamily}';
                src: url('data:font/${boldExt};base64,${boldB64}') format('truetype');
                font-weight: bold;
                font-style: normal;
            }
        `;

        // Filter minors with at least one accepted user
        const used = minors.filter(m => Array.isArray(m.accepted) && m.accepted.length > 0);

        // Build table rows - only show minor name for first student in each minor
        let rowsHtml = '';
        let index = 1;
        for (const m of used) {
            for (let i = 0; i < m.accepted.length; i++) {
                const a = m.accepted[i];
                rowsHtml += '<tr>';
                
                // First column (ردیف) - only show for first student in each minor
                if (i === 0) {
                    rowsHtml += `<td style="text-align:center; vertical-align:middle;">${index}</td>`;
                } else {
                    rowsHtml += '<td></td>';
                }
                
                // Second column (رشته قبولی) - only show for first student in each minor
                if (i === 0) {
                    rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(m.minorName)}</td>`;
                } else {
                    rowsHtml += '<td></td>';
                }
                
                // Third column (افراد قبول شده)
                rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(a.fullName)}</td>`;
                
                // Fourth column (دانشگاه) - include university grade if available
                // let universityDisplay = a.university;
                // if (a.uniGrade) {
                //     universityDisplay += ` (${a.uniGrade})`;
                // }
                // rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(universityDisplay)}</td>`;
                
                // Fifth column (امتیاز)
                // rowsHtml += `<td style="text-align:center; vertical-align:middle;">${this.escapeHtml(String(a.points))}</td>`;
                
                rowsHtml += '</tr>';
            }
            index++;
        }

        if (used.length === 0) {
            rowsHtml = `<tr><td colspan="5" style="text-align:center">-</td></tr>`;
        }

        // Full HTML with improved styling
        const html = `
            <!doctype html>
            <html lang="fa">
                <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <style>
                        ${fontCss}
                        body {
                            font-family: '${fontFamily}', sans-serif;
                            direction: rtl;
                            text-align: right;
                            margin: 0;
                            padding: 15mm 10mm;
                            color: #000;
                            line-height: 1.5;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                            border-bottom: 2px solid #333;
                            padding-bottom: 10px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 22px;
                            font-weight: bold;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            border: 2px solid #333;
                            font-size: 12px;
                        }
                        th, td {
                            border: 1px solid #333;
                            padding: 8px 5px;
                            word-break: break-word;
                        }
                        th {
                            background-color: #e0e0e0;
                            font-weight: bold;
                            text-align: center;
                            padding: 10px 5px;
                        }
                        /* Column widths */
                        th:nth-child(1), td:nth-child(1) { width: 8%; }  /* ردیف */
                        th:nth-child(2), td:nth-child(2) { width: 32%; } /* رشته قبولی */
                        th:nth-child(3), td:nth-child(3) { width: 25%; } /* افراد قبول شده */
                        
                        /* Ensure proper RTL alignment */
                        td:empty {
                            border-left: 1px solid #333;
                            border-right: 1px solid #333;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>بسمه تعالی</h1>
                        <h1>نتایج قبولی رشته‌ها</h1>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>ردیف</th>
                                <th>رشته‌ی قبولی</th>
                                <th>افراد قبول شده</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        return html;
    }

    /**
     * Public: generate sr0.pdf from DB using Puppeteer.
     * If runId is omitted, uses the most recent AllocationRun.
     *
     * @param outPath path to write PDF, e.g. './output/sr0.pdf'
     * @param fontFamily name to use in the embedded @font-face
     * @param fontFiles paths { regular: 'assets/fonts/Vazir-Regular.ttf', bold?: 'assets/fonts/Vazir-Bold.ttf' }
     * @param runId optional allocation run id to use
     */
    async generateSr0(
        outPath: string,
        fontFamily: string,
        fontFiles: { regular: string; bold?: string },
        runId?: number,
    ): Promise<{ runId: number; outPath: string }> {
        // find run
        let run;
        if (runId) {
            run = await this.prisma.allocationRun.findUnique({ where: { id: runId } });
            if (!run) throw new Error(`AllocationRun with id=${runId} not found`);
        } else {
            run = await this.prisma.allocationRun.findFirst({ orderBy: { createdAt: 'desc' } });
            if (!run) throw new Error('No AllocationRun found in DB');
        }

        // fetch acceptances for the run, include student + minor + student.university (explicit select)
        const acceptances = await this.prisma.acceptance.findMany({
            where: { runId: run.id },
            orderBy: [{ minorId: 'asc' }, { points: 'desc' }],
            select: {
                id: true,
                points: true,
                student: {
                    select: {
                        firstname: true,
                        lastname: true,
                        university: { 
                            select: { 
                                name: true, 
                                grade: true 
                            } 
                        },
                    },
                },
                minor: { select: { name: true } },
            },
        });

        // group by minor name
        const minorMap = new Map<string, AcceptedUser[]>();
        for (const a of acceptances) {
            const minorName = a.minor?.name ?? 'نامشخص';
            const s = a.student;
            const fullName = [s?.firstname, s?.lastname].filter(Boolean).join(' ').trim() || 'نامشخص';
            const uniName = s?.university?.name ?? 'نامشخص';
            const uniGrade = s?.university?.grade ?? 0;
            const points = a.points ?? 0;

            if (!minorMap.has(minorName)) minorMap.set(minorName, []);
            minorMap.get(minorName)!.push({
                fullName,
                university: uniName,
                uniGrade,
                points,
            });
        }

        const minors: MinorAcceptance[] = [];
        for (const [minorName, accepted] of minorMap.entries()) {
            minors.push({ minorName, accepted });
        }

        // Build HTML
        const html = this.buildSr0Html(minors, fontFamily, fontFiles);

        // Render HTML to PDF via Puppeteer
        await this.convertHtmlToPdfPuppeteer(html, outPath);

        return { runId: run.id, outPath };
    }

    async generateSr4(
        outPath: string,
        fontFamily: string,
        fontFiles: { regular: string; bold?: string },
        runId?: number,
    ): Promise<{ runId: number; outPath: string }> {
        // find run
        let run;
        if (runId) {
            run = await this.prisma.allocationRun.findUnique({ where: { id: runId } });
            if (!run) throw new Error(`AllocationRun with id=${runId} not found`);
        } else {
            run = await this.prisma.allocationRun.findFirst({ orderBy: { createdAt: 'desc' } });
            if (!run) throw new Error('No AllocationRun found in DB');
        }

        // fetch acceptances for the run, include student + minor + student.university (explicit select)
        const acceptances = await this.prisma.acceptance.findMany({
            where: { runId: run.id },
            orderBy: [{ minorId: 'asc' }, { points: 'desc' }],
            select: {
                id: true,
                student: {
                    select: {
                        firstname: true,
                        lastname: true,
                    },
                },
                minor: { select: { name: true } },
            },
        });

        // group by minor name
        const minorMap = new Map<string, Sr4AcceptedUser[]>();
        for (const a of acceptances) {
            const minorName = a.minor?.name ?? 'نامشخص';
            const s = a.student;
            const fullName = [s?.firstname, s?.lastname].filter(Boolean).join(' ').trim() || 'نامشخص';

            if (!minorMap.has(minorName)) minorMap.set(minorName, []);
            minorMap.get(minorName)!.push({
                fullName,
            });
        }

        const minors: Sr4MinorAcceptance[] = [];
        for (const [minorName, accepted] of minorMap.entries()) {
            minors.push({ minorName, accepted });
        }

        // Build HTML
        const html = this.buildSr4Html(minors, fontFamily, fontFiles);

        // Render HTML to PDF via Puppeteer
        await this.convertHtmlToPdfPuppeteer(html, outPath);

        return { runId: run.id, outPath };
    }
}

