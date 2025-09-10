export class PriorityResultDto {
  firstname: string | null;
  lastname: string | null;
  points: number | null;
  university: {
    name: string;
  };
  priority: number;
  minorName: string;
  capacity: number;
  studentRank: number;
  lastAcceptedRank: number;
  isAccepted: boolean;
}
