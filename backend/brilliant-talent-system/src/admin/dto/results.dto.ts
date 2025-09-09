import { ApiProperty } from "@nestjs/swagger";

export class userResults {
    @ApiProperty({example: "john"})
    firstname: string | null;

    @ApiProperty({example: "doe"})
    lastname: string | null;

    @ApiProperty({example: 20.00})
    points: number | null;

    @ApiProperty({example: {
        name: "دانشگاه صنعتي نوشيرواني بابل"
    }})
    university: {
        name: string;
    };

    @ApiProperty({example: [
        {
            isAccepted: true,
            priority: 1,
            minor: {
                name: "minor 1 name",
                req: "minor 1 req",
                capacity: 3
            }
        },
        {
            isAccepted: null,
            priority: 2,
            minor: {
                name: "minor 2 name",
                req: "minor 2 req",
                capacity: 3
            }
        },
        {
            isAccepted: null,
            priority: 3,
            minor: {
                name: "minor 3 name",
                req: "minor 3 req",
                capacity: 0
            }
        }
    ]})
    priorities: {
        priority: number;
        isAccepted: boolean | null;
        minor: {
            name: string;
            req: string | null;
            capacity: number;
        };
    }[];
}
