
export interface UploadState {
    "students1": { exists: boolean, date_created?: Date }
    "students2": { exists: boolean, date_created?: Date },
    "minors": { exists: boolean, date_created?: Date },
    "universities": { exists: boolean, date_created?: Date }
}

export interface StudentReport {
    "firstname": string,
    "lastname": string,
    "points": number,
    "university": {
        "name": string
    },

    "priorities": Priority[]
}

export interface Priority {
    "priority": number,
    "minorName": string,
    "capacity": number,
    "studentRank": number,
    "lastAcceptedRank": number,
    "isAccepted": boolean
}


export interface HistoryResult {
    "studentName": string,
    "universityName": string,
    "minorName": string,
    "minorReq": string,
    majorName: string
    "minorCap": number,
    "acceptedPriority": number,
    "points": number,
}

export interface HistoryRow {
    "id": number,
    "createdAt": Date,
}