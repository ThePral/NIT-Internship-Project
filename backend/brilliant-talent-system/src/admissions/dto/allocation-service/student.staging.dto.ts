export type Cohort = 1 | 2;

export interface StudentStaging {
    id: number;
    points: number;
    universityId: number | null;
    cohort: number;
    priorities: { id: number; minorId: number; priority: number }[]; // studentPriority rows
}