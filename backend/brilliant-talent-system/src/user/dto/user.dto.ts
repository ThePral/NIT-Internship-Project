import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class UserDto {
    @ApiProperty({
        description: "User's ID"
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: "User's creation time"
    })
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty({
        description: "User's update time"
    })
    @IsDate()
    @IsNotEmpty()
    updatedAt: Date;

    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "user",
        description: "User's role"
    })
    @IsString()
    role: string = "user";
}

export class EditUserDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "User's current_password"
    })
    @ValidateIf(o => o.new_password)
    @IsString()
    @IsNotEmpty({ message: 'current_password is required when changing password' })
    current_password?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "User's new password"
    })
    @ValidateIf(o => o.current_password)
    @IsString()
    @MinLength(8)
    @IsNotEmpty({ message: 'new_password is required when changing password' })
    new_password?: string;
}

export class CreateUserDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "SecurePassword",
        description: "User's password"
    })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}