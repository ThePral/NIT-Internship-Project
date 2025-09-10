
export interface UploadState {
    "students1": boolean,
    "students2": boolean,
    "minors": boolean,
    "universities": boolean
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