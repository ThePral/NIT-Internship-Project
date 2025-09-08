import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class SuperAdminDto {
    @ApiProperty({
        description: "SuperAdmin's ID"
    })
    @IsNumber({}, { message: "شناسه باید عدد باشد" })
    @IsNotEmpty({ message: "شناسه نباید خالی باشد" })
    id: number;

    @ApiProperty({
        description: "SuperAdmin's creation time"
    })
    @IsDate({ message: "فرمت تاریخ معتبر نیست" })
    @IsNotEmpty({ message: "زمان ایجاد نباید خالی باشد" })
    createdAt: Date;

    @ApiProperty({
        description: "SuperAdmin's update time"
    })
    @IsDate({ message: "فرمت تاریخ معتبر نیست" })
    @IsNotEmpty({ message: "زمان بروزرسانی نباید خالی باشد" })
    updatedAt: Date;

    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;
}

export class SuperAdminWithRoleDto extends SuperAdminDto{
    @ApiProperty({
        example: "superAdmin",
        description: "User's role"
    })
    @IsString({ message: "نقش باید رشته باشد" })
    @IsNotEmpty({ message: "نقش نباید خالی باشد" })
    role: string;
}

export class EditSuperAdminDto {
    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "SuperAdmin's current_password"
    })
    @ValidateIf(o => o.new_password)
    @IsString({ message: "رمز عبور فعلی باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور فعلی هنگام تغییر رمز عبور الزامی است" })
    current_password?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "SuperAdmin's new password"
    })
    @ValidateIf(o => o.current_password)
    @IsString({ message: "رمز عبور جدید باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد" })
    @IsNotEmpty({ message: "رمز عبور جدید هنگام تغییر رمز عبور الزامی است" })
    new_password?: string;
}

export class CreateSuperAdminDto {
    @ApiProperty({
        example: "username",
        description: "SuperAdmin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "SecurePassword",
        description: "SuperAdmin's current_password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" })
    @IsNotEmpty({ message: "رمز عبور نباید خالی باشد" })
    password: string;
}