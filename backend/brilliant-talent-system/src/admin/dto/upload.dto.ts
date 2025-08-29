import { ApiProperty } from "@nestjs/swagger";

export class UploadResponseDto {
    @ApiProperty({ example: 'File uploaded successfully!' })
    message: string;

    @ApiProperty({ example: 'Students1.xlsx' })
    filename: string;

    @ApiProperty({ example: 'resources/data.xlsx' })
    path: string;
}