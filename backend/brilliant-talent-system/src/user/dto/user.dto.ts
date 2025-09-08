import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class UserDto {
    @ApiProperty({
        description: "User's ID"
    })
    @IsNumber({}, { message: "شناسه باید عدد باشد" })
    @IsNotEmpty({ message: "شناسه نباید خالی باشد" })
    id: number;

    @ApiProperty({
        description: "User's creation time"
    })
    @IsDate({ message: "فرمت تاریخ معتبر نیست" })
    @IsNotEmpty({ message: "زمان ایجاد نباید خالی باشد" })
    createdAt: Date;

    @ApiProperty({
        description: "User's update time"
    })
    @IsDate({ message: "فرمت تاریخ معتبر نیست" })
    @IsNotEmpty({ message: "زمان بروزرسانی نباید خالی باشد" })
    updatedAt: Date;

    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "firstname",
        description: "User's firstname"
    })
    @IsString({ message: "نام باید رشته باشد" })
    firstname: string | null;

    @ApiProperty({
        example: "lastname",
        description: "User's lastname"
    })
    @IsString({ message: "نام خانوادگی باید رشته باشد" })
    lastname: string | null;

    @ApiProperty({
        description: "User's grade"
    })
    @IsNumber({}, { message: "معدل باید عدد باشد" })
    @IsNotEmpty({ message: "معدل نباید خالی باشد" })
    grade: number;

    @ApiProperty({
        description: "User's points"
    })
    @IsNumber({}, { message: "امتیاز باید عدد باشد" })
    points: number | null;

    @ApiProperty({
        description: "User's university"
    })
    @IsNumber({}, { message: "شناسه دانشگاه باید عدد باشد" })
    @IsNotEmpty({ message: "شناسه دانشگاه نباید خالی باشد" })
    universityId: number;
}

export class UserWithRoleDto extends UserDto{
    @ApiProperty({
        example: "user",
        description: "User's role"
    })
    @IsString({ message: "نقش باید رشته باشد" })
    @IsNotEmpty({ message: "نقش نباید خالی باشد" })
    role: string;
}

export class EditUserByAdminDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "User's new password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" })
    @IsOptional()
    new_password?: string;
}

export class EditUserDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: "yourSecurePassword",
        description: "User's current_password"
    })
    @ValidateIf(o => o.new_password)
    @IsString({ message: "رمز عبور فعلی باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور فعلی هنگام تغییر رمز عبور الزامی است" })
    current_password?: string;

    @ApiProperty({
        example: "newSecurePassword",
        description: "User's new password"
    })
    @ValidateIf(o => o.current_password)
    @IsString({ message: "رمز عبور فعلی باید رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور فعلی هنگام تغییر رمز عبور الزامی است" })
    new_password?: string;
}

export class CreateUserDto {
    @ApiProperty({
        example: "username",
        description: "User's username"
    })
    @IsString({ message: "نام کاربری باید رشته باشد" })
    @MinLength(3, { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" })
    @IsNotEmpty({ message: "نام کاربری نباید خالی باشد" })
    username: string;

    @ApiProperty({
        example: "SecurePassword",
        description: "User's password"
    })
    @IsString({ message: "رمز عبور باید رشته باشد" })
    @MinLength(8, { message: "رمز عبور باید حداقل ۸ کاراکتر باشد" })
    @IsNotEmpty({ message: "رمز عبور نباید خالی باشد" })
    password: string;

    @ApiProperty({
        example: "firstname",
        description: "User's firstname"
    })
    @IsString({ message: "نام باید رشته باشد" })
    @IsNotEmpty({ message: "نام نباید خالی باشد" })
    firstname: string;

    @ApiProperty({
        example: "lastname",
        description: "User's lastname"
    })
    @IsString({ message: "نام خانوادگی باید رشته باشد" })
    @IsNotEmpty({ message: "نام خانوادگی نباید خالی باشد" })
    lastname: string;

    @ApiProperty({
        description: "User's grade"
    })
    @IsNumber({}, { message: "معدل باید عدد باشد" })
    @IsNotEmpty({ message: "معدل نباید خالی باشد" })
    grade: number;

    @ApiProperty({
        description: "User's points"
    })
    @IsNumber({}, { message: "امتیاز باید عدد باشد" })
    points?: number;

    @ApiProperty({
        description: "User's university"
    })
    @IsNumber({}, { message: "شناسه دانشگاه باید عدد باشد" })
    @IsNotEmpty({ message: "شناسه دانشگاه نباید خالی باشد" })
    universityId: number;
}