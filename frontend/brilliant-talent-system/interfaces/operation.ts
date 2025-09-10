export interface UploadState {
  students1: boolean;
  students2: boolean;
  minors: boolean;
  universities: boolean;
}

export interface StudentResult {
  firstname: string;
  lastname: string;
  points: number;
  university: {
    name: string;
  };

  priorities: Priority[];
}

export interface Priority {
  priority: number;
  minorName: string;
  capacity: number;
  studentRank: number;
  lastAcceptedRank: number;
  isAccepted: boolean;
}

export interface HistoryResult {
  studentName: string;
  universityName: string;
  minorName: string;
  minorReq: string;
  minorCap: number;
  acceptedPriority: number;
  points: number;
}

export interface HistoryRow {
  id: number;
  createdAt: Date;
}
