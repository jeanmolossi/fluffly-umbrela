import { capitalize } from "@/shared/helpers/capitalize";
import { EqualsField } from "@/shared/helpers/equals-field-decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUser {
	@ApiProperty({ type: 'string', example: 'John Doe' })
	@IsString({ message: "Name should be a string" })
	@IsNotEmpty({ message: "Name can not be empty" })
	@Transform(({ value }) => capitalize(value))
	name: string

	@ApiProperty({ type: 'string', example: 'john@doe.com' })
	@IsString({ message: "E-mail should be a string" })
	@IsNotEmpty({ message: "E-mail can not be empty" })
	@IsEmail({}, { message: "Invalid e-mail" })
	email: string

	@ApiProperty({ type: 'string', example: '123456' })
	@IsString({ message: "Password should be a string" })
	@IsNotEmpty({ message: "Password can not be empty" })
	@MinLength(6, { message: "Password should have at least 6 characters" })
	@MaxLength(64, { message: "Password should have at most 64 characters" })
	password: string

	@ApiProperty({ type: 'string', example: '123456' })
	@IsString({ message: "Confirm password should be a string" })
	@IsNotEmpty({ message: "Confirm password can not be empty" })
	@EqualsField('password', { message: "Passwords does not match" })
	confirm_password: string
}

