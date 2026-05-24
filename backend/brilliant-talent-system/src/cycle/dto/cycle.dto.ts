import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CycleCreateDto {
    @ApiProperty({ example: "405" })
    @IsString({ message: "نام دوره باید رشته باشد" })
    @IsNotEmpty({ message: "نام دوره نمیتواند خالی باشد" })
    name: string
}