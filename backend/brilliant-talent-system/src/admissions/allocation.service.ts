import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MinorCap,
  Cohort,
  StudentStaging,
  Assignment,
} from './dto/allocation-service';
import { QueueService } from 'src/queue/queue.service';
import { PriorityResultDto } from 'src/user/dto';
import { first } from 'rxjs';

@Injectable()
export class AllocationService {
  private readonly logger = new Logger(AllocationService.name);
  private readonly CHUNK_SIZE = 500;

  constructor(
    private readonly prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  private roundHalfUp(x: number): number {
    return Math.floor(x + 0.5);
  }

  private chunk<T>(arr: T[], size = this.CHUNK_SIZE): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  /**
   * Run allocation with given privileged university id (your university).
   * Returns a summary including runId and counts.
   */
  async runAllocation() {

    // 1) Load minors and build capacity map
    const minors = await this.prisma.minor.findMany({
      select: { id: true, capacity: true },
    });

    const capMap = new Map<number, MinorCap>();
    for (const m of minors) {
      const total = Number(m.capacity ?? 0);
      if (total < 3) {
        capMap.set(m.id, { total, local: total, other: 0 });
      } else {
        const local = this.roundHalfUp((2 * total) / 3);
        capMap.set(m.id, { total, local, other: total - local });
      }
    }

    this.logger.log(`Loaded ${capMap.size} minors and computed quotas.`);

    // 2) Helper that loads students for a cohort into memory (with priorities)
    const loadStudents = async (
      cohort: Cohort,
      isLocal: boolean,
    ): Promise<StudentStaging[]> => {
      // Only load students that have priorities
      const users = await this.prisma.user.findMany({
        where: {
          cohort: cohort,
          isLocal,
          priorities: { some: {} },
        },
        select: {
          id: true,
          points: true,
          universityId: true,
          cohort: true,
          priorities: {
            select: { id: true, minorId: true, priority: true },
            orderBy: { priority: 'asc' },
          },
        },
        orderBy: [{ points: 'desc' }, { id: 'asc' }], // points desc, tie-break by id asc
      });

      return users.map((u) => ({
        id: u.id,
        points: Number(u.points ?? 0),
        universityId: u.universityId ?? null,
        cohort: u.cohort ?? cohort,
        priorities: (u.priorities || []).map((p) => ({
          id: p.id,
          minorId: p.minorId,
          priority: p.priority,
        })),
      }));
    };

    // 3) In-memory assignments accumulator
    const assignments: Assignment[] = [];
    const assignedStudentIds = new Set<number>();

    const tryLocalSeat = (minorId: number): boolean => {
      const c = capMap.get(minorId);
      if (!c) return false;

      if (c.local > 0) {
        c.local -= 1;
        c.total -= 1;
        return true;
      }
      return false;
    };

    const tryNonLocalSeat = (minorId: number): boolean => {
      const c = capMap.get(minorId);
      if (!c) return false;

      if (c.total > 0) {
        if (c.other > 0) {
          c.other -= 1;
        } else {
          c.local -= 1;
        }
        c.total -= 1;
        return true;
      }

      return false;
    };

    // const trySeat = (studentIsLocal: boolean, minorId: number): boolean => {
    //     const c = capMap.get(minorId);
    //     if (!c) return false;

    //     // If the minor is local-only (other === 0)
    //     if (c.other === 0) {
    //         if (studentIsLocal && c.local > 0) {
    //             c.local -= 1;
    //             c.total -= 1;
    //             return true;
    //         }
    //         return false; // non-local can't take local-only in Phase A
    //     }

    //     // both pools exist (local + other)
    //     if (studentIsLocal) {
    //         if (c.local > 0) {
    //             c.local -= 1;
    //             c.total -= 1;
    //             return true;
    //         }
    //         // if (c.other > 0) {
    //         //     c.other -= 1;
    //         //     c.total -= 1;
    //         //     return true;
    //         // }
    //         return false;
    //     } else {
    //         // non-local may only take from 'other' in Phase A
    //         if (c.other > 0) {
    //             c.other -= 1;
    //             c.total -= 1;
    //             return true;
    //         }
    //         return false;
    //     }
    // }

    // 4) Process cohorts in order: 1 then 2
    for (const cohort of [1, 2] as Cohort[]) {
      this.logger.log(`Processing cohort ${cohort}...`);
      // const students = await loadCohortStudents(cohort);

      // // PHASE A: regular allocation
      // for (const s of students) {
      //     if (assignedStudentIds.has(s.id)) continue;

      //     const isLocal = s.universityId === privilegedUniId;

      //     for (const pr of s.priorities) {
      //         if (trySeat(isLocal, pr.minorId)) {
      //             assignments.push({
      //                 studentId: s.id,
      //                 minorId: pr.minorId,
      //                 priority: pr.priority,
      //                 points: s.points,
      //                 cohort: s.cohort,
      //                 studentPriorityId: pr.id,
      //             });
      //             assignedStudentIds.add(s.id);
      //             break;
      //         }
      //     } // end student's priorities loop
      // } // end PHASE A loop

      // // PHASE B: allow non-locals to take leftover local quotas (only for privileged minors)
      // this.logger.log(`Cohort ${cohort} Phase B: allowing non-locals to take leftover local seats.`);

      // // gather unassigned non-local students from this cohort (points desc)
      // const unassignedNonLocals = students
      //     .filter(s => !assignedStudentIds.has(s.id) && s.universityId !== privilegedUniId)
      //     .sort((a, b) => b.points - a.points || a.id - b.id);

      // for (const s of unassignedNonLocals) {
      //     for (const pr of s.priorities) {
      //         const cap = capMap.get(pr.minorId);
      //         if (!cap) continue;

      //         // Only consider leftover local seats (we don't touch 'other' here)
      //         if (cap.local > 0) {
      //             cap.local -= 1;
      //             cap.total -= 1;
      //             assignments.push({
      //                 studentId: s.id,
      //                 minorId: pr.minorId,
      //                 priority: pr.priority,
      //                 points: s.points,
      //                 cohort: s.cohort,
      //                 studentPriorityId: pr.id,
      //             });
      //             assignedStudentIds.add(s.id);
      //             break;
      //         }
      //     }
      // }

      // Phase A: Local students
      const localStudents = await loadStudents(cohort, true);
      for (const s of localStudents) {
        if (assignedStudentIds.has(s.id)) continue;

        for (const pr of s.priorities) {
          if (tryLocalSeat(pr.minorId)) {
            assignments.push({
              studentId: s.id,
              minorId: pr.minorId,
              priority: pr.priority,
              points: s.points,
              cohort: s.cohort,
              studentPriorityId: pr.id,
            });
            assignedStudentIds.add(s.id);
            break;
          }
        } // end student's priorities loop
      } // end Phase A loop

      // Phase B: Non Local students
      const NonLocalStudents = await loadStudents(cohort, false);
      for (const s of NonLocalStudents) {
        if (assignedStudentIds.has(s.id)) continue;

        for (const pr of s.priorities) {
          if (tryNonLocalSeat(pr.minorId)) {
            assignments.push({
              studentId: s.id,
              minorId: pr.minorId,
              priority: pr.priority,
              points: s.points,
              cohort: s.cohort,
              studentPriorityId: pr.id,
            });
            assignedStudentIds.add(s.id);
            break;
          }
        } // end student's priorities loop
      } // end Phase B loop
    } // end cohorts loop

    this.logger.log(
      `Allocation finished in-memory: ${assignments.length} assignments.`,
    );

    // 5) Persist results in DB as an AllocationRun + Acceptances + mark StudentPriority.isAccepted
    const run = await this.prisma.allocationRun.create({
      data: {
        cohortPolicy: 'students1-first',
      },
    });

    // prepare acceptances
    const acceptanceInserts = assignments.map((a) => ({
      runId: run.id,
      studentId: a.studentId,
      minorId: a.minorId,
      priority: a.priority,
      points: a.points,
      cohort: a.cohort,
    }));

    // insert acceptances in chunks
    const chunks = this.chunk(acceptanceInserts);
    try {
      await this.prisma.$transaction(async (tx) => {
        for (const c of chunks) {
          // createMany is faster for bulk insert
          await tx.acceptance.createMany({ data: c });
        }

        // update StudentPriority.isAccepted for accepted priorities
        // (we do updateMany per assignment because each update targets a different row)
        // If you have very large assignments you can batch these as raw SQL, but for typical sizes this is ok.
        // for (const a of assignments) {
        //     await tx.studentPriority.update({
        //         where: { id: a.studentPriorityId },
        //         data: { isAccepted: true },
        //     });
        // }
        // await Promise.all(
        //     assignments.map(a =>
        //         tx.studentPriority.update({
        //             where: { id: a.studentPriorityId },
        //             data: { isAccepted: true },
        //         })
        //     )
        // );
        await tx.studentPriority.updateMany({
          where: { id: { in: assignments.map((a) => a.studentPriorityId) } },
          data: { isAccepted: true },
        });
      });
    } catch (err) {
      this.logger.error('Error persisting acceptances:', err as any);
      throw err;
    }

    const job = await this.queueService.historyQueue.add('history', {
      runId: run.id,
    });

    const acceptedCount = assignments.length;
    const totalStudents = await this.prisma.user.count({
      where: { priorities: { some: {} } },
    });
    const unmatchedCount = totalStudents - acceptedCount;

    this.logger.log(
      `Allocation persisted: runId=${run.id}, accepted=${acceptedCount}, unmatched=${unmatchedCount}`,
    );

    return {
      runId: run.id,
      historyJobId: job.id,
      acceptedCount,
      unmatchedCount,
    };
  }

  async allocationHistoryJob(
    runId: number,
    progressCb?: (progress: number | object) => void,
  ) {
    // const acceptances = await this.prisma.acceptance.findMany({
    //     where: { runId },
    //     select: {
    //         student: {
    //             select: {
    //                 firstname: true,
    //                 lastname: true,
    //                 university: {
    //                     select: {
    //                         name: true
    //                     }
    //                 }
    //             }
    //         },
    //         minor: {
    //             select: {
    //                 name: true,
    //                 req: true,
    //                 capacity: true,
    //             }
    //         },
    //         priority: true,
    //         points: true
    //     }
    // });
    const users = await this.prisma.user.findMany({
      select: {
        firstname: true,
        lastname: true,
        university: {
          select: {
            name: true,
          },
        },
        points: true,
        acceptances: {
          where: { runId },
          select: {
            minor: {
              select: {
                name: true,
                req: true,
                capacity: true,
              },
            },
            priority: true,
          },
        },
      },
    });

    progressCb?.({ message: 'fetched allocation data' });

    // const allocationHistoryInsert = acceptances.map(a => ({
    //     runId,
    //     studentName: a.student.firstname + " " + a.student.lastname,
    //     universityName: a.student.university.name,
    //     minorName: a.minor.name,
    //     minorReq: a.minor.req,
    //     minorCap: a.minor.capacity,
    //     priority: a.priority,
    //     points: a.points,
    // }));
    const allocationHistoryInsert = users.map((user) => ({
      runId,
      studentName: user.firstname + ' ' + user.lastname,
      universityName: user.university.name,
      minorName: user.acceptances[0]?.minor.name || null,
      minorReq: user.acceptances[0]?.minor.req || null,
      minorCap: user.acceptances[0]?.minor.capacity || null,
      acceptedPriority: user.acceptances[0]?.priority || null,
      points: user.points || 0,
    }));

    const chunks = this.chunk(allocationHistoryInsert);
    try {
      await this.prisma.$transaction(async (tx) => {
        for (let i = 0; i < chunks.length; i++) {
          await tx.allocationHistory.createMany({ data: chunks[i] });
          progressCb?.({ message: `data chunk ${i + 1} imported.` });
        }
        // for (const c of chunks) await tx.allocationHistory.createMany({ data: c });
      });
    } catch (err) {
      this.logger.error(
        'Error allocation history insert transaction failed:',
        err as any,
      );
      throw err;
    }

    return { success: true, message: 'allocation history created succesfully' };
  }

  async getStudentResult(studentId: number) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        points: true,
        university: { select: { name: true } },
        priorities: {
          select: { id: true, minorId: true, priority: true, isAccepted: true },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!student) return null;

    const results: PriorityResultDto[] = [];

    for (const p of student.priorities) {
      const applicants = await this.prisma.user.findMany({
        where: { priorities: { some: { minorId: p.minorId } } },
        select: { id: true, points: true },
        orderBy: [{ points: 'desc' }, { id: 'asc' }],
      });

      const studentRank = applicants.findIndex((a) => a.id === student.id) + 1;

      const acceptedPriorities = await this.prisma.studentPriority.findMany({
        where: { minorId: p.minorId, isAccepted: true },
        select: { studentId: true },
      });

      let lastAcceptedRank: number | null = null;
      if (acceptedPriorities.length > 0) {
        const lastAccepted = applicants.findIndex((a) =>
          acceptedPriorities.some((ap) => ap.studentId === a.id),
        );
        lastAcceptedRank = lastAccepted + 1;
      }

      const minor = await this.prisma.minor.findUnique({
        where: { id: p.minorId },
        select: { name: true, capacity: true },
      });

      results.push({
        priority: p.priority,
        minorName: minor?.name ?? '',
        capacity: Number(minor?.capacity ?? 0),
        studentRank,
        lastAcceptedRank,
        isAccepted: p.isAccepted,
      });
    }

    return {
      firstname: student.firstname,
      lastname: student.lastname,
      points: student.points,
      university: student.university,
      priorities: results,
    };
  }
}
