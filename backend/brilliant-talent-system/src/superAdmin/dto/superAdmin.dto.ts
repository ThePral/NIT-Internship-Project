import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class SuperAdminDto {
    @ApiProperty({
        description: "SuperAdmin's ID"
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: "SuperAdmin's creation time"
    })
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty({
        description: "SuperAdmin's update time"
    })
    @IsDate()
    @IsNotEmpty()
    updatedAt: Date;

    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString()
    @IsNotEmpty()
    username: string;
}

export class SuperAdminWithRoleDto extends SuperAdminDto{
    @ApiProperty({
        example: "superAdmin",
        description: "User's role"
    })
    @IsString()
    @IsNotEmpty()
    role: string;
}

export class EditSuperAdminDto {
    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "SuperAdmin's current_password"
    })
    @ValidateIf(o => o.new_password)
    @IsString()
    @IsNotEmpty({ message: 'current_password is required when changing password' })
    current_password?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "SuperAdmin's new password"
    })
    @ValidateIf(o => o.current_password)
    @IsString()
    @MinLength(8)
    @IsNotEmpty({ message: 'new_password is required when changing password' })
    new_password?: string;
}

export class CreateSuperAdminDto {
    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "SecurePassword",
        description: "SuperAdmin's current_password"
    })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}