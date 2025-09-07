export type AcceptedUser = {
    fullName: string;
    university: string;
    uniGrade: number | string;
    points: number | string;
};

export type MinorAcceptance = {
    minorName: string;
    accepted: AcceptedUser[];
};