export type MinorResult = {
    name: string;
    capacity: number;
    acceptedCount: number;
    priorities: {
        student:{
            fullname: string,
            grade: number,
            university:{
                name: string,
                grade: number
            },
            points: number
        },
        isAccepted: boolean
    }[]
};
