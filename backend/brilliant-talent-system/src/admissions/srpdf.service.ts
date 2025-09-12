import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { PuppeteerService } from './puppeteer.service';
import { AcceptedUser, MinorAcceptance } from './dto/srpdf-service';
import { Sr4AcceptedUser, Sr4MinorAcceptance } from './dto/srpdf-service/sr4.dto';
import { UserResult } from './dto/srpdf-service/sr1.dto';
import { UserResult2 } from './dto/srpdf-service/sr2.dto';
import { MinorResult } from './dto/srpdf-service/sr3.dto';
import { min } from 'class-validator';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SrPdfService {
    private readonly logger = new Logger(SrPdfService.name);

    constructor(private readonly prisma: PrismaService, private puppeteerService: PuppeteerService, 
            private readonly redisService: RedisService) {}

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
    private buildSr1Html(userResults: UserResult[], fontFamily: string, fontFiles: { regular: string; bold?: string }) {
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

        

        // Build table rows - only show minor name for first student in each minor
        let rowsHtml = '';
        let index = 1;
        for (const m of userResults) {
            rowsHtml += '<tr>';
            rowsHtml += `<td style="text-align:center; vertical-align:middle;">${index}</td>`;
            rowsHtml += `<td style="text-align:right; vertical-align:middle; ${ m.isAcceptedAtAll?"color: rgb(0, 0, 255);" : ""}">${this.escapeHtml(m.fullName)}</td>`;
            for (let i = 0; i < 3; i++) {
                if(i == 0){
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml(m.bachelorsDegree)}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml(m.grade+ "")}</td>`
                }
                if(i == 1){
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("")}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("")}</td>`


                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml(m.university)}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml(m.universityPoints+ "")}</td>`
                }
                if(i == 2){
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("")}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("")}</td>`


                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("")}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("")}</td>`
                }
                if(m.chosenMinors[i]){
                    const minor = m.chosenMinors[i];
                    rowsHtml += `<td style="text-align:right; vertical-align:middle; ${minor.accepted?"color: rgb(0, 0, 255);" : ""}">${this.escapeHtml(minor.name)}</td>`;
                    rowsHtml += `<td style="text-align:right; vertical-align:middle; ${minor.accepted?"color: rgb(0, 0, 255);" : ""}">${this.escapeHtml(minor.capacity + "")}</td>`;
                    rowsHtml += `<td style="text-align:right; vertical-align:middle; ${minor.accepted?"color: rgb(0, 0, 255);" : ""}">${this.escapeHtml(minor.rank + "")}</td>`;
                    rowsHtml += `<td style="text-align:right; vertical-align:middle; ${minor.accepted?"color: rgb(0, 0, 255);" : ""}">${this.escapeHtml(minor.lastAccepted + "")}</td>`;



                }else{
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("-")}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("-")}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("-")}</td>`
                    rowsHtml +=`<td style="text-align:right; vertical-align:middle; }">${this.escapeHtml("-")}</td>`
                    
                }
                rowsHtml += '</tr>';
                
            }

            index++;
            
        //     // for (let i = 0; i < m.accepted.length; i++) {
        //     //     const a = m.accepted[i];
        //     //     r
                
        //     //     // First column (ردیف) - only show for first student in each minor
        //     //     if (i === 0) {
            
        //     //     } else {
        //     //         rowsHtml += '<td></td>';
        //     //     }
                
        //     //     // Second column (رشته قبولی) - only show for first student in each minor
        //     //     if (i === 0) {
        //     //         
        //     //     } else {
        //     //         rowsHtml += '<td></td>';
        //     //     }
                
        //     //     // Third column (افراد قبول شده)
        //     //     rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(a.fullName)}</td>`;
                
        //     //     // Fourth column (دانشگاه) - include university grade if available
        //     //     let universityDisplay = a.university;
        //     //     if (a.uniGrade) {
        //     //         universityDisplay += ` (${a.uniGrade})`;
        //     //     }
        //     //     rowsHtml += `<td style="text-align:right; vertical-align:middle;">${this.escapeHtml(universityDisplay)}</td>`;
                
        //     //     // Fifth column (امتیاز)
        //     //     rowsHtml += `<td style="text-align:center; vertical-align:middle;">${this.escapeHtml(String(a.points))}</td>`;
                
        //     //     rowsHtml += '</tr>';
        //     // }
        //     
        }

        if (userResults.length === 0) {
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
                        th:nth-child(2), td:nth-child(2) { width: 22%; } /* نام*/
                        th:nth-child(3), td:nth-child(3) { width: 22%; } /* کارشناسی */
                        th:nth-child(4), td:nth-child(4) { width: 7%; } /*  */
                        th:nth-child(5), td:nth-child(5) { width: 25%; } /* اولویت */
                        th:nth-child(6), td:nth-child(6) { width: 6%; } /* ظرفیت */
                        th:nth-child(7), td:nth-child(7) { width: 5%; } /* رتبه */
                        th:nth-child(8), td:nth-child(8) { width: 5%; } /* آخرین */

                        
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
                                <th>نام</th>
                                <th>کارشناسی</th>
                                <th></th>
                                <th>اولویت</th>
                                <th style= "font-size: 8px;" >ظرفیت</th>
                                <th style= "font-size: 8px;">رتبه</th>
                                <th style= "font-size: 8px;" >آخرین</th>

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
    

    private buildSr2Html(userResults: UserResult2[], fontFamily: string, fontFiles: { regular: string; bold?: string }) {
        // Embed fonts as base64 @font-face (same as before)
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
    
        // Build individual pages for each user
        let pagesHtml = '';
        let index = 1;
    
        for (const user of userResults) {
            // User information section
            const userInfoHtml = `
                <div class="user-info">
                    <h2>اطلاعات داوطلب</h2>
                    <table class="user-details">
                        <tr>
                            <th>کارنامه</th>
                            <td>${user.id}</td>
                        </tr>
                        <tr>
                            <th>نام و نام خانوادگی</th>
                            <td >${this.escapeHtml(user.fullName)}</td>
                        </tr>
                        <tr>
                            <th>مقطع کارشناسی</th>
                            <td>${this.escapeHtml(user.bachelorsDegree)}</td>
                        </tr>
                        <tr>
                            <th>معدل</th>
                            <td>${this.escapeHtml(user.grade + "")}</td>
                        </tr>
                        <tr>
                            <th>دانشگاه</th>
                            <td>${this.escapeHtml(user.university)}</td>
                        </tr>
                        <tr>
                            <th>امتیاز دانشگاه</th>
                            <td>${this.escapeHtml(user.universityPoints + "")}</td>
                        </tr>
                        <tr>
                            <th>وضعیت پذیرش</th>
                            <td style="${user.isAcceptedAtAll ? "color: rgb(0, 0, 255);" : ""}" >${user.isAcceptedAtAll ? "پذیرفته شده" : "پذیرفته نشده"}</td>
                        </tr>
                    </table>
                </div>
            `;
    
            // Build tables for each chosen minor
            let minorsTablesHtml = '';
            
            for (let i = 0; i < 3; i++) {
                const minor = user.chosenMinors[i];
                const priorityNumber = i + 1;
                
                let minorTableHtml = '';
                
                if (minor) {
                    minorTableHtml = `
                        <div class="minor-table">
                            <h3>اولویت ${priorityNumber}: ${this.escapeHtml(minor.name)}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>نام رشته</th>
                                        <th>وضعیت پذیرش</th>
                                        <th>ظرفیت</th>
                                        <th>رتبه</th>
                                        <th>آخرین پذیرش</th>
                                        <th>ملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${this.escapeHtml(minor.name)}</td>
                                        <td style="${minor.accepted ? "color: rgb(0, 0, 255);" : ""}">
                                            ${minor.accepted ? "پذیرفته شده" : "پذیرفته نشده"}
                                        </td>
                                        <td>${this.escapeHtml(minor.capacity + "")}</td>
                                        <td>${this.escapeHtml(minor.rank + "")}</td>
                                        <td>${this.escapeHtml(minor.lastAccepted + "")}</td>
                                        <td>${minor.attentions ? this.escapeHtml(minor.attentions) : "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    minorTableHtml = `
                        <div class="minor-table">
                            <h3>اولویت ${priorityNumber}: -</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>نام رشته</th>
                                        <th>وضعیت پذیرش</th>
                                        <th>ظرفیت</th>
                                        <th>رتبه</th>
                                        <th>آخرین پذیرش</th>
                                        <th>ملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="6" style="text-align:center">هیچ رشته‌ای انتخاب نشده</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `;
                }
                
                minorsTablesHtml += minorTableHtml;
            }
    
            // Create a page for each user with page break
            pagesHtml += `
                <div class="page">
                    ${userInfoHtml}
                    <div class="minors-section">
                        <h2>نتایج انتخاب رشته‌ها</h2>
                        ${minorsTablesHtml}
                    </div>
                </div>
            `;
    
            index++;
        }
    
        if (userResults.length === 0) {
            pagesHtml = `<div class="page"><p style="text-align:center">هیچ نتیجه‌ای یافت نشد</p></div>`;
        }
    
        // Full HTML with improved styling and page breaks
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
                        .page {
                            page-break-after: always;
                            margin-bottom: 30mm;
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
                        .user-info {
                            margin-bottom: 20px;
                        }
                        .user-info h2 {
                            text-align: center;
                            margin-bottom: 15px;
                            color: #333;
                        }
                        .user-details {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                            border: 1px solid #333;
                        }
                        .user-details th, .user-details td {
                            border: 1px solid #333;
                            padding: 10px;
                            text-align: right;
                        }
                        .user-details th {
                            background-color: #f0f0f0;
                            font-weight: bold;
                            width: 30%;
                        }
                        .minors-section h2 {
                            text-align: center;
                            margin: 30px 0 20px 0;
                            color: #333;
                        }
                        .minor-table {
                            margin-bottom: 25px;
                        }
                        .minor-table h3 {
                            margin: 0 0 10px 0;
                            color: #555;
                            text-align: right;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            border: 2px solid #333;
                            font-size: 12px;
                            margin-bottom: 10px;
                        }
                        th, td {
                            border: 1px solid #333;
                            padding: 8px 5px;
                            word-break: break-word;
                            text-align: center;
                        }
                        th {
                            background-color: #e0e0e0;
                            font-weight: bold;
                            padding: 10px 5px;
                        }
                        /* Column widths for minor tables */
                        .minor-table th:nth-child(1), .minor-table td:nth-child(1) { width: 25%; }
                        .minor-table th:nth-child(2), .minor-table td:nth-child(2) { width: 15%; }
                        .minor-table th:nth-child(3), .minor-table td:nth-child(3) { width: 10%; }
                        .minor-table th:nth-child(4), .minor-table td:nth-child(4) { width: 10%; }
                        .minor-table th:nth-child(5), .minor-table td:nth-child(5) { width: 10%; }
                        .minor-table th:nth-child(6), .minor-table td:nth-child(6) { width: 30%; }
                        
                        @media print {
                            .page {
                                page-break-after: always;
                            }
                            body {
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>بسمه تعالی</h1>
                        <h1>نتایج قبولی رشته‌ها</h1>
                    </div>
                    ${pagesHtml}
                </body>
            </html>
        `;
        return html;
    }
    private buildSr3Html(minorResults: MinorResult[], fontFamily: string, fontFiles: { regular: string; bold?: string }) {
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
    
        // Build individual pages for each minor
        let pagesHtml = '';
    
        for (const minor of minorResults) {
            // Minor information section
            const minorInfoHtml = `
                <div class="minor-info">
                    <h2>${this.escapeHtml(minor.name)}</h2>
                    <table class="minor-details">
                        <tr>
                            <th>ظرفیت رشته</th>
                            <td>${minor.capacity}</td>
                        </tr>
                        <tr>
                            <th>تعداد پذیرفته شده</th>
                            <td>${minor.acceptedCount}</td>
                        </tr>
                        <tr>
                            <th>تعداد کل داوطلبان</th>
                            <td>${minor.priorities.length}</td>
                        </tr>
                    </table>
                </div>
            `;
    
            // Build table rows for students
            let studentsRowsHtml = '';
            let index = 1;
            
            for (const priority of minor.priorities) {
                const student = priority.student;
                const isAccepted = priority.isAccepted;
                
                studentsRowsHtml += `
                    <tr>
                        <td style="text-align:center">${index}</td>
                        <td style="${isAccepted ? "color: rgb(0, 0, 255);" : ""}">
                            ${this.escapeHtml(student.fullname)}
                        </td>
                        <td>${this.escapeHtml(student.university.name)}</td>
                        <td style="text-align:center">${student.university.grade}</td>
                        <td style="text-align:center">${student.grade}</td>
                        <td style="text-align:center">${student.points}</td>
                        <td style="text-align:center">${isAccepted ? "✓" : "✗"}</td>
                    </tr>
                `;
                index++;
            }
    
            if (minor.priorities.length === 0) {
                studentsRowsHtml = `<tr><td colspan="7" style="text-align:center">هیچ داوطلبی برای این رشته وجود ندارد</td></tr>`;
            }
    
            // Students table
            const studentsTableHtml = `
                <div class="students-section">
                    <h3>لیست داوطلبان</h3>
                    <table class="students-table">
                        <thead>
                            <tr>
                                <th>ردیف</th>
                                <th>نام داوطلب</th>
                                <th>دانشگاه</th>
                                <th>اولویت</th>
                                <th>معدل</th>
                                <th>امتیاز</th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentsRowsHtml}
                        </tbody>
                    </table>
                </div>
            `;
    
            // Create a page for each minor with page break
            pagesHtml += `
                <div class="page">
                    <div class="header">
                        <h1>بسمه تعالی</h1>
                        <h1>نتایج انتخاب رشته</h1>
                    </div>
                    ${minorInfoHtml}
                    ${studentsTableHtml}
                </div>
            `;
        }
    
        if (minorResults.length === 0) {
            pagesHtml = `<div class="page"><p style="text-align:center">هیچ نتیجه‌ای یافت نشد</p></div>`;
        }
    
        // Full HTML with improved styling and page breaks
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
                        .page {
                            page-break-after: always;
                            margin-bottom: 30mm;
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
                        .minor-info {
                            margin-bottom: 30px;
                        }
                        .minor-info h2 {
                            text-align: center;
                            margin-bottom: 20px;
                            color: #333;
                            font-size: 24px;
                            background-color: #f0f0f0;
                            padding: 15px;
                            border-radius: 5px;
                            border: 2px solid #333;
                        }
                        .minor-details {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                            border: 1px solid #333;
                        }
                        .minor-details th, .minor-details td {
                            border: 1px solid #333;
                            padding: 12px;
                            text-align: right;
                        }
                        .minor-details th {
                            background-color: #e0e0e0;
                            font-weight: bold;
                            width: 40%;
                        }
                        .students-section {
                            margin-top: 30px;
                        }
                        .students-section h3 {
                            text-align: center;
                            margin: 0 0 20px 0;
                            color: #333;
                            font-size: 20px;
                        }
                        .students-table {
                            width: 100%;
                            border-collapse: collapse;
                            border: 2px solid #333;
                            font-size: 12px;
                            margin-bottom: 10px;
                        }
                        .students-table th, .students-table td {
                            border: 1px solid #333;
                            padding: 8px 5px;
                            word-break: break-word;
                            text-align: center;
                        }
                        .students-table th {
                            background-color: #e0e0e0;
                            font-weight: bold;
                            padding: 12px 5px;
                        }
                        /* Column widths for students table */
                        .students-table th:nth-child(1), .students-table td:nth-child(1) { width: 5%; }
                        .students-table th:nth-child(2), .students-table td:nth-child(2) { width: 23%; }
                        .students-table th:nth-child(3), .students-table td:nth-child(3) { width: 23%; }
                        .students-table th:nth-child(4), .students-table td:nth-child(4) { width: 10%; }
                        .students-table th:nth-child(5), .students-table td:nth-child(5) { width: 10%; }
                        .students-table th:nth-child(6), .students-table td:nth-child(6) { width: 10%; }
                        .students-table th:nth-child(7), .students-table td:nth-child(7) { width: 9%; }
                        
                        @media print {
                            .page {
                                page-break-after: always;
                            }
                            body {
                                padding: 0;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${pagesHtml}
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
    async generateSr1(
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
        // const acceptances = await this.prisma.acceptance.findMany({
        //     where: { runId: run.id },
        //     orderBy: [{ minorId: 'asc' }, { points: 'desc' }],
        //     select: {
        //         id: true,
        //         points: true,
        //         student: {
        //             select: {
        //                 id: true,
        //                 firstname: true,
        //                 lastname: true,
        //                 university: { 
        //                     select: { 
        //                         name: true, 
        //                         grade: true 
        //                     } 
        //                 },
        //             },
        //         },
        //         minor: { select: { name: true , id: true } },
        //     },
        // });
    
        // Get all students with their priorities
        const allStudents = await this.prisma.user.findMany({
            include: {
                university: true,
                acceptances: true,
                priorities: {
                    include: {
                        minor: true
                    }
                }
            }
        });
        const allMinors = await this.prisma.minor.findMany({
            include:{
                priorities:{
                    include:{
                        student: {
                            include: {
                                acceptances: true
                            }
                        }
                    }
                }
            }
        });
        type MinorWithExtras = typeof allMinors[0] & {
            lastAccepted: number;
          };
          
        const finalMinors = allMinors as MinorWithExtras[];
          
        for(const minor of finalMinors){
            minor.lastAccepted = 0
            minor.priorities.sort((a , b) => {
                return (b.student.points || 0) - (a.student.points  || 0)
            });

        }
        // console.log(finalMinors[2].priorities)
        // for (const accepted of acceptances){
        //     for (const minor of finalMinors){
        //         if(minor.id == accepted.minor.id){
        //             for (let index = 0; index < minor.priorities.length; index++) {
        //                 const element = minor.priorities[index];
                        
        //                 if(element.student.id == accepted.student.id){
        //                     if((index + 1) >minor.lastAccepted){
        //                         minor.lastAccepted == index + 1 ;
        //                     }
        //                     break;
        //                 }
        //             }
        //             break;
        //         }
        //     }
        // }
        for (const minor of finalMinors){
                        for (let index = 0; index < minor.priorities.length; index++) {
                            const element = minor.priorities[index];
                            // console.log(element)
                            if(element.isAccepted){
                                if((index + 1) > minor.lastAccepted){
                                    minor.lastAccepted = index + 1 ;
                                }
                            }
                        }
                }
        // console.log(finalMinors[2].lastAccepted)

        // Pre-calculate rankings for each minor
        
        
    
        // Build user results
        const userResults: UserResult[] = [];
    
        for (const student of allStudents) {
            const userResult: UserResult = {
                fullName: [student.firstname, student.lastname].filter(Boolean).join(' ').trim() || 'نامشخص',
                university: student.university.name,
                isAcceptedAtAll: false,
                bachelorsDegree: student.majorName,
                grade: student.grade,
                universityPoints: student.university.grade,
                chosenMinors: []
            };
            let counter = 0;
            for( const priority of student.priorities){
                counter++;
                let accepted = false;
                // for (const acceptance of acceptances){
                //     if(acceptance.student.id == student.id && acceptance.minor.id == priority.minor.id){
                //         accepted =  true;
                //         break;
                //     }
                // }
                for( const minor of finalMinors){
                    if(minor.id == priority.minor.id){
                    // if( counter == 1){
                    //     console.log(minor)
                    // }

                        let rankInMinor = 0; 
                        for (let index = 0; index < minor.priorities.length; index++) {
                            const element = minor.priorities[index];
                            if(element.student.id == student.id){
                                rankInMinor = index + 1 ;
                                if(element.isAccepted){
                                    accepted = true;
                                    userResult.isAcceptedAtAll = true;
                                }
                                break;
                            }
                        }
                        userResult.chosenMinors.push({
                            accepted: accepted,
                            capacity: minor.capacity,
                            lastAccepted: minor.lastAccepted,
                            name: minor.name,
                            rank: rankInMinor
                        })
                        break;
                    }
                }
                
            }
            // Process each minor the student chose
            // for (const priority of student.priorities.sort((a, b) => a.priority - b.priority)) {
            //     const minor = priority.minor;
            //     const minorId = minor.id;
                
            //     // Get the ranking for this minor
            //     const ranking = minorRankings.get(minorId) || [];
                
            //     // Find this student's rank in the minor
            //     const studentRank = ranking.findIndex(item => item.studentId === student.id) + 1;
                
            //     // Check if student is accepted in this minor (based on capacity)
            //     const isAccepted = studentRank > 0 && studentRank <= minor.capacity;
                
            //     // Get the last accepted rank (capacity or number of students if less than capacity)
            //     const lastAccepted = Math.min(minor.capacity, ranking.length);
                
            //     userResult.chosenMinors.push({
            //         name: minor.name,
            //         accepted: isAccepted,
            //         capacity: minor.capacity,
            //         rank: studentRank > 0 ? studentRank : ranking.length + 1, // If not in ranking, show as beyond last
            //         lastAccepted: lastAccepted
            //     });
            // }
    
            userResults.push(userResult);
        }
        // console.log(userResults[1])
        const html = this.buildSr1Html(userResults, fontFamily, fontFiles);
    
        await this.convertHtmlToPdfPuppeteer(html, outPath);
    
        return { runId: run.id, outPath };
    }
    


    async generateSr2(
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
        // const acceptances = await this.prisma.acceptance.findMany({
        //     where: { runId: run.id },
        //     orderBy: [{ minorId: 'asc' }, { points: 'desc' }],
        //     select: {
        //         id: true,
        //         points: true,
        //         student: {
        //             select: {
        //                 id: true,
        //                 firstname: true,
        //                 lastname: true,
        //                 university: { 
        //                     select: { 
        //                         name: true, 
        //                         grade: true 
        //                     } 
        //                 },
        //             },
        //         },
        //         minor: { select: { name: true , id: true } },
        //     },
        // });
    
        // Get all students with their priorities
        const allStudents = await this.prisma.user.findMany({
            include: {
                university: true,
                acceptances: true,
                priorities: {
                    include: {
                        minor: true
                    }
                }
            }
        });
        const allMinors = await this.prisma.minor.findMany({
            include:{
                priorities:{
                    include:{
                        student: {
                            include: {
                                acceptances: true
                            }
                        }
                    }
                }
            }
        });
        type MinorWithExtras = typeof allMinors[0] & {
            lastAccepted: number;
          };
          
        const finalMinors = allMinors as MinorWithExtras[];
          
        for(const minor of finalMinors){
            minor.lastAccepted = 0
            minor.priorities.sort((a , b) => {
                return (b.student.points || 0) - (a.student.points  || 0)
            });

        }

        for (const minor of finalMinors){
                        for (let index = 0; index < minor.priorities.length; index++) {
                            const element = minor.priorities[index];
                            // console.log(element)
                            if(element.isAccepted){
                                if((index + 1) > minor.lastAccepted){
                                    minor.lastAccepted = index + 1 ;
                                }
                            }
                        }
                }
        // console.log(finalMinors[2].lastAccepted)


        const userResults: UserResult2[] = [];
    
        for (const student of allStudents) {
            const userResult: UserResult2 = {
                id: student.id,
                fullName: [student.firstname, student.lastname].filter(Boolean).join(' ').trim() || 'نامشخص',
                university: student.university.name,
                isAcceptedAtAll: false,
                bachelorsDegree: student.majorName,
                grade: student.grade,
                universityPoints: student.university.grade,
                chosenMinors: []
            };
            let counter = 0;
            for( const priority of student.priorities){
                counter++;
                let accepted = false;
                // for (const acceptance of acceptances){
                //     if(acceptance.student.id == student.id && acceptance.minor.id == priority.minor.id){
                //         accepted =  true;
                //         break;
                //     }
                // }
                for( const minor of finalMinors){
                    if(minor.id == priority.minor.id){
                    // if( counter == 1){
                    //     console.log(minor)
                    // }

                        let rankInMinor = 0; 
                        for (let index = 0; index < minor.priorities.length; index++) {
                            const element = minor.priorities[index];
                            if(element.student.id == student.id){
                                rankInMinor = index + 1 ;
                                if(element.isAccepted){
                                    accepted = true;
                                    userResult.isAcceptedAtAll = true;
                                    userResult.acceptedMinorName = minor.name;
                                }
                                break;
                            }
                        }
                        userResult.chosenMinors.push({
                            accepted: accepted,
                            capacity: minor.capacity,
                            lastAccepted: minor.lastAccepted,
                            name: minor.name,
                            rank: rankInMinor
                        })
                        break;
                    }
                }
                
            }
            // Process each minor the student chose
            // for (const priority of student.priorities.sort((a, b) => a.priority - b.priority)) {
            //     const minor = priority.minor;
            //     const minorId = minor.id;
                
            //     // Get the ranking for this minor
            //     const ranking = minorRankings.get(minorId) || [];
                
            //     // Find this student's rank in the minor
            //     const studentRank = ranking.findIndex(item => item.studentId === student.id) + 1;
                
            //     // Check if student is accepted in this minor (based on capacity)
            //     const isAccepted = studentRank > 0 && studentRank <= minor.capacity;
                
            //     // Get the last accepted rank (capacity or number of students if less than capacity)
            //     const lastAccepted = Math.min(minor.capacity, ranking.length);
                
            //     userResult.chosenMinors.push({
            //         name: minor.name,
            //         accepted: isAccepted,
            //         capacity: minor.capacity,
            //         rank: studentRank > 0 ? studentRank : ranking.length + 1, // If not in ranking, show as beyond last
            //         lastAccepted: lastAccepted
            //     });
            // }
    
            userResults.push(userResult);
        }
        // console.log(userResults[1])
        const html = this.buildSr2Html(userResults, fontFamily, fontFiles);
    
        await this.convertHtmlToPdfPuppeteer(html, outPath);
    
        return { runId: run.id, outPath };
    }
    

    async generateSr3(
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
       
        // Get all students with their priorities
        const allStudents = await this.prisma.user.findMany({
            include: {
                university: true,
                acceptances: true,
                priorities: {
                    include: {
                        minor: true
                    }
                }
            }
        });
        const allMinors = await this.prisma.minor.findMany({
            include:{
                priorities:{
                    include:{
                        student: {
                            include: {
                                acceptances: true,
                                university: true
                            }
                        }
                    }
                }
            }
        });
        
          
        const minorResults: MinorResult[] = [];
        
          
        for(const minor of allMinors){
            minor.priorities.sort((a , b) => {
                return (b.student.points || 0) - (a.student.points  || 0)
            });
            let acceptedCount = 0;
            for(const priority of minor.priorities){
                if(priority.isAccepted){
                    acceptedCount++;
                }
            }
            const newMinorResult : MinorResult = {
                acceptedCount: acceptedCount,
                name : minor.name,
                capacity : minor.capacity,
                priorities : []
            }
            for (let index = 0; index < minor.priorities.length; index++) {
                const priority = minor.priorities[index];
                newMinorResult.priorities.push({
                    isAccepted: priority.isAccepted || false,
                    student:{
                        fullname: priority.student.firstname+ " " + priority.student.lastname,
                        grade: priority.student.grade,
                        points: priority.student.points || 0,
                        university: priority.student.university
                    }
                })
                
            }
            minorResults.push(newMinorResult);
        }



        // console.log(userResults[1])
        const html = this.buildSr3Html(minorResults, fontFamily, fontFiles);
    
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
    async generateAllPDFs(
        fontFamily: string,
        fontFiles: { regular: string; bold?: string },
        runId?: number,
    ): Promise<void> {
        try {
            // await Promise.all([
            //     this.generateSr0('./output/sr0.pdf', fontFamily, fontFiles, runId),
            //     this.generateSr1('./output/sr1.pdf', fontFamily, fontFiles, runId),
            //     this.generateSr2('./output/sr2.pdf', fontFamily, fontFiles, runId),
            //     this.generateSr3('./output/sr3.pdf', fontFamily, fontFiles, runId),
            //     this.generateSr4('./output/sr4.pdf', fontFamily, fontFiles, runId),
            // ]);
           await   this.generateSr0('./output/sr0.pdf', fontFamily, fontFiles, runId),
               await   this.generateSr1('./output/sr1.pdf', fontFamily, fontFiles, runId),
               await   this.generateSr2('./output/sr2.pdf', fontFamily, fontFiles, runId),
               await   this.generateSr3('./output/sr3.pdf', fontFamily, fontFiles, runId),
               await   this.generateSr4('./output/sr4.pdf', fontFamily, fontFiles, runId),
               console.log("pdf done")
            await this.redisService.del("pdfCreating");
        } catch (error) {
            console.log("pdf error")
            console.log(error)
            await this.redisService.set("pdfCreating","error");
        }
        
    
    }
}

