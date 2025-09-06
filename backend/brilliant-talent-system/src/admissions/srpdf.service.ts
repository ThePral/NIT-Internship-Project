import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { PuppeteerService } from './puppeteer.service';

type AcceptedUser = {
    fullName: string;
    university: string;
    uniGrade: number | string;
    points: number | string;
};

type MinorAcceptance = {
    minorName: string;
    accepted: AcceptedUser[]; // zero-length -> skip
};

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
                margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
            });

            this.logger.log(`sr0 PDF written to ${outPath}`);
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

        // Build table rows: each accepted user is a physical row;
        // first accepted user for minor has ردیف and رشته قبولی, others have blanks in those columns
        let rowsHtml = '';
        let index = 1;
        for (const m of used) {
            for (let i = 0; i < m.accepted.length; i++) {
                const a = m.accepted[i];
                rowsHtml += '<tr>';
                if (i === 0) {
                    rowsHtml += `<td style="text-align:center; vertical-align:top;">${index}</td>`;
                    rowsHtml += `<td style="text-align:right; vertical-align:top;">${this.escapeHtml(m.minorName)}</td>`;
                } else {
                    rowsHtml += `<td></td><td></td>`;
                }
                rowsHtml += `<td style="text-align:right; vertical-align:top;">${this.escapeHtml(a.fullName)}</td>`;
                rowsHtml += `<td style="text-align:right; vertical-align:top;">${this.escapeHtml(a.university)}</td>`;
                rowsHtml += `<td style="text-align:center; vertical-align:top;">${this.escapeHtml(String(a.uniGrade))}</td>`;
                rowsHtml += `<td style="text-align:center; vertical-align:top;">${this.escapeHtml(String(a.points))}</td>`;
                rowsHtml += '</tr>';
            }
            index++;
        }

        if (used.length === 0) {
            rowsHtml = `<tr><td colspan="6" style="text-align:center">-</td></tr>`;
        }

        // Full HTML with RTL direction and embedded font
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
                            margin: 20px;
                            color: #000;
                        }
                        h1 { text-align: center; margin-bottom: 12px; font-weight: bold; }
                        table { width: 100%; border-collapse: collapse; table-layout: fixed; }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 6px 8px;
                            word-break: break-word;
                        }
                        th {
                            background: #f5f5f5;
                            font-weight: bold;
                            text-align: center;
                        }
                        td { font-size: 11px; }
                        /* make sure rows can break across pages but avoid splitting a cell's content awkwardly */
                        tr { page-break-inside: avoid; }
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                    </style>
                </head>
                <body>
                    <h1>نتایج قبولی رشته‌ها</h1>
                    <table>
                        <thead>
                            <tr>
                                <th style="width:6%">ردیف</th>
                                <th style="width:22%">رشته قبولی</th>
                                <th style="width:30%">افراد قبول شده</th>
                                <th style="width:22%">دانشگاه</th>
                                <th style="width:10%">ضریب</th>
                                <th style="width:10%">امتیاز</th>
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
            orderBy: [{ minorId: 'asc' }, { points: 'desc' }, { studentId: 'asc' }],
            select: {
                id: true,
                runId: true,
                studentId: true,
                minorId: true,
                priority: true,
                points: true,
                cohort: true,
                createdAt: true,
                student: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        university: { select: { id: true, name: true, grade: true } },
                    },
                },
                minor: { select: { id: true, name: true } },
            },
        });

        // group by minor name
        const minorMap = new Map<string, AcceptedUser[]>();
        for (const a of acceptances) {
            const minorName = a.minor?.name ?? String(a.minorId);
            const s = a.student;
            const fullName = [s?.firstname, s?.lastname].filter(Boolean).join(' ').trim() || String(a.studentId);
            const uniName = s?.university?.name ?? '';
            const uniGrade = s?.university?.grade ?? '';
            const points = a.points ?? '';

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
}

