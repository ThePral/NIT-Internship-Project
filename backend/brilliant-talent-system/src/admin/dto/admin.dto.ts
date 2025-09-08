import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class AdminDto {
    @ApiProperty({
        description: "Admin's ID"
    })
    @IsNumber({}, { message: "شناسه باید عدد باشد" })
    @IsNotEmpty({ message: "شناسه نباید خالی باشد" })
    id: number;

    @ApiProperty({
        description: "Admin's creation time"
    })
    @IsDate({ message: "فرمت تاریخ معتبر نیست" })
    @IsNotEmpty({ message: "زمان ایجاد نباید خالی باشد" })
    createdAt: Date;

    @ApiProperty({
        description: "Admin's update time"
    })
    @IsDate({ message: "فرمت تاریخ معتبر نیست" })
    @IsNotEmpty({ message: "زمان بروزرسانی نباید خالی باشد" })
    updatedAt: Date;

    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;
}

export class AdminWithRoleDto extends AdminDto{
    @ApiProperty({
        example: "admin",
        description: "User's role"
    })
    @IsString({ message: "نقش باید رشته باشد" })
    @IsNotEmpty({ message: "نقش نباید خالی باشد" })
    role: string;
}

export class EditAdminBySuperAdminDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "Admin's new password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" })
    @IsOptional()
    new_password?: string;
}

export class EditAdminDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "Admin's current_password"
    })
    @ValidateIf(o => o.new_password)
    @IsString({ message: "رمز عبور فعلی باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور فعلی هنگام تغییر رمز عبور الزامی است" })
    current_password?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "Admin's new password"
    })
    @ValidateIf(o => o.current_password)
    @IsString({ message: "رمز عبور جدید باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد" })
    @IsNotEmpty({ message: "رمز عبور جدید هنگام تغییر رمز عبور الزامی است" })
    new_password?: string;
}

export class CreateAdminDto {
    @ApiProperty({
        example: "username",
        description: "Admin's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "SecurePassword",
        description: "Admin's password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" })
    @IsNotEmpty({ message: "رمز عبور نباید خالی باشد" })
    password: string;
}