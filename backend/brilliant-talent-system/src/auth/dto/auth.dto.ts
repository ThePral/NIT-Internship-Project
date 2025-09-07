import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "User's password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور نباید خالی باشد" })
    password: string;
}

export class AdminLoginDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "Admin's password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور نباید خالی باشد" })
    password: string;
}

export class SuperAdminLoginDto {
    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "SuperAdmin's password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور نباید خالی باشد" })
    password: string;
}

export class TokensDto {
    @ApiProperty({
        description: "access_token"
    })
    @IsString({ message: "توکن دسترسی باید رشته باشد" })
    @IsNotEmpty({ message: "توکن دسترسی نباید خالی باشد" })
    access_token: string;

    @ApiProperty({
        description: "refresh_token"
    })
    @IsString({ message: "توکن رفرش باید رشته باشد" })
    @IsNotEmpty({ message: "توکن رفرش نباید خالی باشد" })
    refresh_token: string;
}

export class RefreshTokenDto {
    @ApiProperty({
        description: "refresh_token"
    })
    @IsString({ message: "توکن رفرش باید رشته باشد" })
    @IsNotEmpty({ message: "توکن رفرش نباید خالی باشد" })
    refresh_token: string;
}
