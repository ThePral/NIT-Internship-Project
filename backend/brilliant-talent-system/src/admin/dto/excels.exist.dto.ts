import { ApiProperty } from "@nestjs/swagger";

export class PresenceResult {
    @ApiProperty({ example: {
        exists: true,
        date_created: "2025-09-08T17:17:06.917Z"
    }})
    students1: {
        exists: boolean,
        date_created: Date | null
    };
    
    @ApiProperty({ example: {
        exists: true,
        date_created: "2025-09-08T17:18:22.055Z"
    }})
    students2: {
        exists: boolean,
        date_created: Date | null
    };

    @ApiProperty({ example: {
        exists: false,
        date_created: null
    }})
    minors: {
        exists: boolean,
        date_created: Date | null
    };

    @ApiProperty({ example: {
        exists: true,
        date_created: "2025-09-08T17:19:22.655Z"
    }})
    universities: {
        exists: boolean,
        date_created: Date | null
    };
};

export class ExcelPaths {
    students1: string | null;
    students2: string | null;
    minors: string | null;
    universities: string | null;
};