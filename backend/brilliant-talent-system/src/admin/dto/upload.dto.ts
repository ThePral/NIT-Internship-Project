import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class UploadReportSuccess {
    @ApiProperty({ example: "Universities imported" })
    message: string;

    @ApiProperty({
        example: {
            upserted: 120,
            skipped: 30,
        },
    })
    report: {
        upserted: number;
        skipped: number;
    };
}

export class UploadReportWithErrors {
    @ApiProperty({ example: "Minors imported" })
    message: string;

    @ApiProperty({
        example: {
            upserted: 100,
            errors: [
                "Row 23: Invalid username format",
                "Row 57: Priority not found in majors list",
            ],
        },
    })
    report: {
        upserted: number;
        errors: string[];
    };
}

export class UploadSummary {
    @ApiProperty({ example: "Students import finished" })
    message: string;

    @ApiProperty({
        example: {
            totalStudentsParsed: 200,
            usersCreated: 150,
            prioritiesCreated: 450,
            unmatchedPrioritiesCount: 12,
        },
    })
    summary: {
        totalStudentsParsed: number;
        usersCreated: number;
        prioritiesCreated: number;
        unmatchedPrioritiesCount: number;
    };

    @ApiProperty({
        example: [
            { username: "s12345", priorityText: "Artificial Intelligence" },
            { username: "s67890", priorityText: "Quantum Computing" },
        ],
    })
    unmatchedPriorities: {
        username: string;
        priorityText: string;
    }[];
}

@ApiExtraModels(UploadReportSuccess, UploadReportWithErrors, UploadSummary)
export class UploadResponseDto {
    
    @ApiProperty({
        oneOf: [
            { $ref: getSchemaPath(UploadReportSuccess) },
            { $ref: getSchemaPath(UploadReportWithErrors) },
            { $ref: getSchemaPath(UploadSummary) },
        ]
    })
    result: 
        | UploadReportSuccess
        | UploadReportWithErrors
        | UploadSummary;

    @ApiProperty({ example: 'Students1.xlsx' })
    filename: string;

    @ApiProperty({ example: 'resources/data.xlsx' })
    path: string;
}