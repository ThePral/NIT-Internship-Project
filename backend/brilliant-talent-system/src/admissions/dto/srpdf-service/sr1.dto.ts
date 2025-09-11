export type ChosenMinor = {
    name: string;
    accepted: boolean;
    capacity: number;
    rank: number;
    lastAccepted: number;
};

export type UserResult = {
    fullName: string;
    university: string;
    bachelorsDegree: string;
    isAcceptedAtAll: boolean;
    grade: number;
    universityPoints: number;
    chosenMinors: ChosenMinor[];
};