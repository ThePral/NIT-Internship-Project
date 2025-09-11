import { Injectable, Logger } from '@nestjs/common';
import ExcelJS from 'exceljs';
// import * as bcrypt from 'bcryptjs';
import * as argon from 'argon2'
import { PrismaService } from '../prisma/prisma.service'; // adjust path to your PrismaService
import { QueueService } from 'src/queue/queue.service';
import { User } from '@prisma/client';
type Cohort = 1 | 2;

@Injectable()
export class ImportService {
    private readonly logger = new Logger(ImportService.name);
    private readonly CHUNK_SIZE = 500;
    // private readonly DEFAULT_SALT_ROUNDS = 10;
    private readonly privilegedUniName = "دانشگاه صنعتي نوشيرواني بابل";

    constructor(private readonly prisma: PrismaService, private queueService: QueueService) {}

    /* ----------------- Helpers ----------------- */

    private chunk<T>(arr: T[], size = this.CHUNK_SIZE): T[][] {
        const out: T[][] = [];
        for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
        return out;
    }

    private normalizeText(s: any): string {
        if (s === null || s === undefined) return '';
        return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
    }

    private normalizeUniversityName(name: string): string {
        let n = this.normalizeText(name);

        // Remove common Persian prefixes
        n = n.replace(/^دانشگاه\s+/, ''); 
        n = n.replace(/^مؤسسه\s+/, '');   
        n = n.replace(/^موسسه\s+/, '');  
        n = n.replace(/\s+/g, '');

        return n;
    }


    private findHeaderIndex(headerRow: ExcelJS.Row, candidates: string[]): number | null {
        const normalize = (s: any) => this.normalizeText(s);

        const rawValues = Array.isArray(headerRow.values) ? headerRow.values : [];
        const headers: { idx: number; text: string }[] = [];
        for (let i = 1; i < rawValues.length; i++) {
            const cell = rawValues[i];
            if (!cell) continue;
            const text = normalize(cell);
            if (!text) continue;
            headers.push({ idx: i, text });
        }

        if (headers.length === 0) return null;

        // 1) First pass: exact normalized equality (best and safest)
        for (const cand of candidates) {
            const c = normalize(cand);
            for (const h of headers) {
            if (h.text === c) return h.idx;
            }
        }

        // 2) Second pass: allow substring match only for multi-word candidates
        //    (prevents single-word candidates matching longer headers)
        for (const cand of candidates) {
            const c = normalize(cand);
            const wordCount = c.split(/\s+/).filter(Boolean).length;
            if (wordCount < 2) continue; // skip single-word candidates here
            for (const h of headers) {
            if (h.text.includes(c)) return h.idx;
            }
        }

        // 3) No match found
        return null;
    }


    /* ----------------- Universities import ----------------- */

    /**
     * Upserts universities from the given Excel file.
     * Expects columns: (optionally) id, name, grade. Header detection is fuzzy.
     */
    async importUniversities(filePath: string) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];

        const header = sheet.getRow(1);
        const nameIdx = this.findHeaderIndex(header, ['name', 'نام', 'نام دانشگاه']);
        const gradeIdx = this.findHeaderIndex(header, ['grade', 'نمره']);
        const idIdx = this.findHeaderIndex(header, ['id', 'شناسه']);

        if (nameIdx === null) {
            throw new Error('Could not detect "name" column in universities file. Provide a header named "name" or "نام".');
        }

        const rows: { id?: number; name: string; grade: number }[] = [];
        sheet.eachRow({ includeEmpty: false }, (row, rn) => {
            if (rn === 1) return; // skip header
            const name = this.normalizeText(row.getCell(nameIdx).value);
            if (!name) return;
            const gradeCell = gradeIdx ? row.getCell(gradeIdx).value : null;
            const grade = gradeCell !== null && gradeCell !== undefined ? Number(gradeCell) : 0;
            const id = idIdx ? Number(row.getCell(idIdx).value) : undefined;
            rows.push({ id: id || undefined, name, grade });
        });

        const results = { upserted: 0, skipped: 0 };
        for (const r of rows) {
            // Upsert by name (name is unique in schema)
            await this.prisma.university.upsert({
                where: { name: r.name },
                update: { grade: r.grade },
                create: { name: r.name, grade: r.grade },
            });
            results.upserted++;
        }

        return { message: 'Universities imported', report: results };
    }

    /* ----------------- Minors import ----------------- */

    /**
     * Import minors/majors. Expects columns: name, req (optional), capacity.
     */
    async importMinors(filePath: string) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];

        const header = sheet.getRow(1);
        const nameIdx = this.findHeaderIndex(header, ['name', 'نام', 'عنوان']);
        const reqIdx = this.findHeaderIndex(header, ['req', 'require', 'req', 'شرط']);
        const capIdx = this.findHeaderIndex(header, ['cap', 'capacity', 'ظرفیت']);

        if (nameIdx === null || capIdx === null) {
            throw new Error('Could not detect required columns in minors file. Need "name" and "capacity" headers.');
        }

        const rows: { name: string; req?: string; capacity: number }[] = [];
        sheet.eachRow({ includeEmpty: false }, (row, rn) => {
            if (rn === 1) return;
            const name = String(row.getCell(nameIdx).value || '').trim();
            if (!name) return;
            const req = String(row.getCell(reqIdx || 0).value || '').trim() || undefined;
            const capRaw = row.getCell(capIdx).value;
            const capacity = capRaw !== null && capRaw !== undefined ? parseInt(String(capRaw), 10) || 0 : 0;
            rows.push({ name, req, capacity });
        });

        const report = { upserted: 0, errors: [] as string[] };
        for (const r of rows) {
            try {
                await this.prisma.minor.upsert({
                    where: { name: r.name },
                    create: { name: r.name, req: r.req, capacity: r.capacity },
                    update: { req: r.req, capacity: r.capacity },
                });
                report.upserted++;
            } catch (err) {
                report.errors.push(`Failed to upsert minor ${r.name}: ${(err as Error).message}`);
            }
        }

        return { message: 'Minors imported', report };
    }

    /* ----------------- Students import ----------------- */

    /**
     * Import students file:
     * - groups rows by username (case number)
     * - builds one User row per username
     * - creates StudentPriority rows for each discovered priority line
     *
     * Options:
     *  - mapping columns by header name OR provide exact column indexes in options
     */
    async importStudents(
        filePath: string,
        cohort: Cohort = 1,
        options?: {
            hashPassword?: boolean; // default true
            //   saltRounds?: number;
            // optional explicit column indexes (1-based) or header names:
            usernameColumn?: number | string;
            nationalCodeColumn?: number | string;
            firstnameColumn?: number | string;
            lastnameColumn?: number | string;
            gradeColumn?: number | string;
            universityColumn?: number | string;
            majorColumn?: number | string; // the column containing the chosen major (priority row)
            birthdateColumn?: number | string;
            majornameColumn?: number | string;
        },
    ) {
        const hashPassword = options?.hashPassword ?? true;
        /* Note. (TODO)
           Password hashing is in a loop — is that slow?
           For big imports, you can parallelize within chunks using Promise.all. 
           Or import with hashPassword: false and run a separate background hasher — but only do that if operationally necessary. 
        */

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];

        const headerRow = sheet.getRow(1);

        const tryFind = (maybe: number | string | undefined, candidates: string[], fallbackIdx?: number) => {
            if (!maybe) {
                const idx = this.findHeaderIndex(headerRow, candidates);
                return idx ?? fallbackIdx ?? null;
            }
            if (typeof maybe === 'number') return maybe;
            // string: find header column whose text contains maybe
            for (const [i, c] of (headerRow.values as any[]).entries()) {
                if (!c) continue;
                if (this.normalizeText(String(c)).includes(this.normalizeText(maybe))) return i;
            }
            return null;
        };

        // expected header name candidates (Persian + English common terms)
        const USER_HEADERS = ['شماره پرونده', 'شماره پرونده داوطلب', 'شماره پرونده/داوطلب', 'username', 'case number', 'رديف شماره پرونده داوطلب'];
        const NATIONAL_HEADERS = ['كد ملي', 'کد ملی', 'national code', 'national_code', 'nationalcode'];
        const FIRST_HEADERS = ['نام', 'firstname', 'first name'];
        const LAST_HEADERS = ['نام خانوادگي', 'نام خانوادگی', 'lastname', 'family name'];
        const GRADE_HEADERS = ['معدل تا پايان نيمسال ششم', 'نمره', 'grade', 'معدل', 'نمره کل'];
        const UNIVERSITY_HEADERS = ['دانشگاه محل اخذ مدرك كارشناسي', 'نام دانشگاه', 'university', 'سازمان آموزشي', 'محل تحصيل'];
        const MAJOR_HEADERS = ['گرايش', 'گرایش', 'گرايش (هاي) انتخابي', 'گرايش (های) انتخابي', 'major', 'choices'];
        const BIRTHDATE_HEADERS = ['تاريخ تولد', 'birth_date', 'birthdate', 'تاریخ متولد شدن'];
        const MAJORNAME_HEADERS = ['رشته تحصيلي كارشناسي', 'رشته تحصيلي ', 'رشته تحصيلی كارشناسی', 'رشته تحصيلی', 'major_name', 'majorname', 'major name', 'major'];

        const usernameIdx = tryFind(options?.usernameColumn, USER_HEADERS) as number | null;
        const nationalIdx = tryFind(options?.nationalCodeColumn, NATIONAL_HEADERS) as number | null;
        const firstIdx = tryFind(options?.firstnameColumn, FIRST_HEADERS) as number | null;
        const lastIdx = tryFind(options?.lastnameColumn, LAST_HEADERS) as number | null;
        const gradeIdx = tryFind(options?.gradeColumn, GRADE_HEADERS) as number | null;
        const uniIdx = tryFind(options?.universityColumn, UNIVERSITY_HEADERS) as number | null;
        const majorIdx = tryFind(options?.majorColumn, MAJOR_HEADERS) as number | null;
        const birthdateIdx = tryFind(options?.birthdateColumn, BIRTHDATE_HEADERS) as number | null;
        const majornameIdx = tryFind(options?.majornameColumn, MAJORNAME_HEADERS) as number | null;

        if (!usernameIdx || !majorIdx) {
            throw new Error('Failed to detect required columns (username or major). Provide explicit mapping in options if header names differ.');
        }

        if (!gradeIdx) {
            throw new Error('Failed to detect required column (grade). Provide explicit mapping in options if header names differ.');
        }

        // build rows grouped by username
        type StagingStudent = {
            username: string;
            nationalCode?: string;
            firstname?: string;
            lastname?: string;
            grade?: number;
            universityName?: string;
            majorName: string;
            birthDate: Date;
            priorities: string[]; // priority texts in encountered order
        };
        const studentsMap = new Map<string, StagingStudent>();

        sheet.eachRow({ includeEmpty: false }, (row, rn) => {
            if (rn === 1) return; // header
            const username = String(row.getCell(usernameIdx).value || '').trim();
            if (!username) return;
            if (username === 'شماره پرونده داوطلب') return;
            const nationalCode = String(row.getCell(nationalIdx || 0).value || '').trim();
            const firstname = String(row.getCell(firstIdx || 0).value || '').trim() || undefined;
            const lastname = String(row.getCell(lastIdx || 0).value || '').trim() || undefined;
            const gradeRaw = String(row.getCell(gradeIdx || 0).value || '');
            const grade = gradeRaw !== null && gradeRaw !== undefined ? Number(gradeRaw) : undefined;
            const uniName = String(row.getCell(uniIdx || 0).value || '').trim() || undefined;
            const majorText = String(row.getCell(majorIdx).value || '').trim() || undefined;
            const majorName = String(row.getCell(majornameIdx || 0).value || '').trim() || 'نامشخص';
            const birthDateText = String(row.getCell(birthdateIdx || 0).value || '').trim() || undefined;
            const convertPersianDateToEnglish = (input: string) => {
                const mapper = {
                    "۰": '0',
                    "۱": '1',
                    "۲": '2',
                    "۳": '3',
                    "۴": '4',
                    "۵": '5',
                    "۶": '6',
                    "۷": '7',
                    "۸": '8',
                    "۹": '9',
                    "/": '-',
                };

                let ouput = "";
                for (const l of input) ouput += mapper[l];
                
                return ouput;
            }

            const birthDate = new Date(convertPersianDateToEnglish(birthDateText!));

            const key = username;
            if (!studentsMap.has(key)) {
                studentsMap.set(key, {
                    username,
                    nationalCode: nationalCode || undefined,
                    firstname,
                    lastname,
                    grade,
                    universityName: uniName,
                    majorName,
                    birthDate,
                    priorities: [],
                });
            }
            const st = studentsMap.get(key)!;
            // prefer a non-empty grade and names if we encounter them
            if (!st.grade && grade !== undefined) st.grade = grade;
            if (!st.firstname && firstname) st.firstname = firstname;
            if (!st.lastname && lastname) st.lastname = lastname;
            if (!st.universityName && uniName) st.universityName = uniName;
            if (majorText) st.priorities.push(majorText);
        });

        this.logger.log(`Parsed ${studentsMap.size} unique students (grouped by username).`);

        // preload minors and universities
        const minors = await this.prisma.minor.findMany();
        const uniList = await this.prisma.university.findMany();
        const minorEntries = minors.map(m => ({ id: m.id, nameNorm: this.normalizeText(m.name), rawName: m.name }));
        const uniNameToId = new Map<string, number>();
        uniList.forEach(u => uniNameToId.set(this.normalizeUniversityName(u.name), u.id));
        const uniIdToGrade = new Map<number, number>();
        uniList.forEach(u => uniIdToGrade.set(u.id, Number(u.grade || 0)));

        // prepare users create payload
        const usersToCreate: any[] = [];
        const usernameList: string[] = [];
        for (const [username, st] of studentsMap.entries()) {
            usernameList.push(username);
            const uniId = st.universityName ? uniNameToId.get(this.normalizeUniversityName(st.universityName)) ?? null : null;
            const isLocal = this.normalizeUniversityName(st.universityName!) === this.normalizeUniversityName(this.privilegedUniName)
            // compute points if uni grade exists and student grade known
            const uniGrade = uniId ? (uniIdToGrade.get(uniId) ?? 0) : 0;
            const points = (st.grade ?? 0) + uniGrade;

            usersToCreate.push({
                username: st.username,
                hash_password: hashPassword && st.nationalCode ? await argon.hash(st.nationalCode) : (st.nationalCode ?? ''),
                firstname: st.firstname ?? undefined,
                lastname: st.lastname ?? undefined,
                grade: st.grade ?? null,
                universityId: uniId,
                points,
                cohort,
                isLocal,
                majorName: st.majorName,
                birthDate: st.birthDate,
                nationalCode: st.nationalCode,
            });
        }
        
        let createdUsers = 0;

        if (hashPassword) {
            // bulk create users (skip duplicates)
            const userChunks = this.chunk(usersToCreate);
            for (const chunk of userChunks) {
                const res = await this.prisma.user.createMany({ data: chunk, skipDuplicates: true });
                createdUsers += (res.count ?? 0);
            }
        } else {
            const inserted = await Promise.all(
                usersToCreate.map(utc => 
                    this.prisma.user.create({ data: utc }).catch(err => {
                        if (err.code === 'P2002') return null;
                        throw err;
                    })
                )
            );
    
            const created = inserted.filter(u => u !== null);
            createdUsers += created.length;
    
            this.queueService.hashPasswordQueue.add('hash', {created});

        }


        // fetch user ids for usernames (both existing and newly created)
        const users = await this.prisma.user.findMany({
            where: { username: { in: usernameList } },
            select: { id: true, username: true, universityId: true },
        });
        const usernameToId = new Map(users.map(u => [u.username, u.id]));

        // Build priorities create payload (map major text -> minorId)
        const prioritiesToCreate: { studentId: number; minorId: number; priority: number }[] = [];
        const unmatchedPriorities: { username: string; priorityText: string }[] = [];

        for (const [username, st] of studentsMap.entries()) {
            const studentId = usernameToId.get(username);
            if (!studentId) {
                unmatchedPriorities.push({ username, priorityText: '[user not found after createMany]' });
                continue;
            }

            for (let i = 0; i < st.priorities.length; i++) {
                const prText = st.priorities[i];
                if (!prText) continue;
                const prNorm = this.normalizeText(prText);

                // first try exact match on normalized minor name
                let matched = minorEntries.find(m => prNorm === m.nameNorm);
                // if not exact, try substring contains (minor name in priority text)
                if (!matched) {
                    matched = minorEntries.find(m => prNorm.includes(m.nameNorm) || m.nameNorm.includes(prNorm));
                }
                // if not yet matched, try contains ignoring spaces
                if (!matched) {
                    matched = minorEntries.find(m => prNorm.replace(/\s/g, '').includes(m.nameNorm.replace(/\s/g, '')));
                }

                if (!matched) {
                    unmatchedPriorities.push({ username, priorityText: prText });
                    continue;
                }

                prioritiesToCreate.push({
                    studentId,
                    minorId: matched.id,
                    priority: i + 1, // 1-based priority
                });
            }
        }

        // bulk create priorities in chunks
        let createdPriorities = 0;
        const prChunks = this.chunk(prioritiesToCreate);
        for (const chunk of prChunks) {
            // Prisma createMany requires field names match model: studentId, minorId, priority
            const res = await this.prisma.studentPriority.createMany({
                data: chunk,
                skipDuplicates: true,
            });
            
            createdPriorities += (res.count ?? 0);
        }

        return {
            message: 'Students import finished',
            summary: {
                totalStudentsParsed: studentsMap.size,
                usersCreated: createdUsers,
                prioritiesCreated: createdPriorities,
                unmatchedPrioritiesCount: unmatchedPriorities.length,
            },
            unmatchedPriorities: unmatchedPriorities.slice(0, 50), // show first 50 for debugging
        };
    }

    async hashPasswordsJob(users: User[], progressCb?: (progress: number | object) => void,) {

        // const users = await this.prisma.user.findMany();
    
        for (const user of users) {
            const hashedPassword = await argon.hash(user.hash_password);
            await this.prisma.user.update({
                where : { id: user.id},
                data: {hash_password: hashedPassword}
            });
        }

        return { success: true, message: "users passwords hashed succesfully"};
    }
}
