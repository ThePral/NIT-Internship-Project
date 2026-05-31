export interface UploadState {
    "students1": { exists: boolean, date_created?: Date }
    "students2": { exists: boolean, date_created?: Date },
    "minors": { exists: boolean, date_created?: Date },
    "universities": { exists: boolean, date_created?: Date }
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
    isAccepted: boolean, piority: number, minor: Minor
}

export interface Minor {
    name: string, req: string, capacity: number
}

// export interface HistoryResult {
//     "studentName": string,
//     "universityName": string,
//     "minorName": string,
//     "minorReq": string,
//     majorName: string
//     "minorCap": number,
//     "acceptedPriority": number,
//     "points": number,
// }

export interface HistoryRow {
    id: number;
    name: string;
}

export interface Cycle {
    id: number;
    name: string

}