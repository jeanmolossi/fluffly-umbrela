import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RecoverAccount {
	@ApiProperty({ type: 'string', example: 'john@doe.com' })
	@IsString({ message: "E-mail should be a string" })
	@IsNotEmpty({ message: "E-mail can not be empty" })
	@IsEmail({}, { message: "Invalid e-mail" })
	email: string
}
