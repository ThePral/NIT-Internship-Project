import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class AdminDto {
    @ApiProperty({
        description: "Admin's ID"
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: "Admin's creation time"
    })
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty({
        description: "Admin's update time"
    })
    @IsDate()
    @IsNotEmpty()
    updatedAt: Date;

    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "user role",
        description: "User's role"
    })
    @IsString()
    @IsNotEmpty()
    role?: string = "admin";
}

export class EditAdminDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "Admin's current_password"
    })
    @ValidateIf(o => o.new_password)
    @IsString()
    @IsNotEmpty({ message: 'current_password is required when changing password' })
    current_password?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "Admin's new password"
    })
    @ValidateIf(o => o.current_password)
    @IsString()
    @MinLength(8)
    @IsNotEmpty({ message: 'new_password is required when changing password' })
    new_password?: string;
}

export class CreateAdminDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "SecurePassword",
        description: "Admin's password"
    })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}