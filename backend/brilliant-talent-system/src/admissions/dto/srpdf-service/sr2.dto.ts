export type ChosenMinor = {
    name: string;
    accepted: boolean;
    capacity: number;
    rank: number;
    lastAccepted: number;
    attentions?: string;
};

export type UserResult2 = {
    id: number;
    fullName: string;
    university: string;
    bachelorsDegree: string;
    isAcceptedAtAll: boolean;
    grade: number;
    universityPoints: number;
    acceptedMinorName?: string;
    chosenMinors: ChosenMinor[];
};