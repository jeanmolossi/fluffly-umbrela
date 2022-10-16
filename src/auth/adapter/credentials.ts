import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class Credentials {
	@ApiProperty({ example: 'john@doe.com' })
	@IsNotEmpty({ message: 'You should provide e-mail credential' })
	@IsEmail({}, { message: 'You should provide valid e-mail' })
	email: string;

	@ApiProperty({ example: '123456' })
	@IsNotEmpty({ message: 'You should provide the password' })
	@Length(6, 64, { message: 'You should fill correctly password' })
	password: string;
}
