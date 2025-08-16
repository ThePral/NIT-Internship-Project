import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "User's password"
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class AdminLoginDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "Admin's password"
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class SuperAdminLoginDto {
    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "SuperAdmin's password"
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class TokenDto {
    @ApiProperty({
        description: "access_token"
    })
    @IsString()
    @IsNotEmpty()
    access_token: string;

    @ApiProperty({
        description: "access_token"
    })
    @IsString()
    @IsNotEmpty()
    refresh_token: string;
}
