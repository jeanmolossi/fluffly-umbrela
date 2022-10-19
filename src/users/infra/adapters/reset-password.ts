import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsNotEmpty,
	IsNumberString,
	Length,
	MaxLength,
	MinLength
} from 'class-validator';
import { EqualsField } from '@/shared/helpers/equals-field-decorator';

export class ResetPassword {
	@ApiProperty({ example: '012345' })
	@IsNotEmpty({ message: 'OTP should not be empty' })
	@Length(6, 6, { message: 'OTP should have 6 characters' })
	@IsNumberString({}, { message: 'OTP should be a numeric string' })
	// eslint-disable-next-line
	OTP: string;

	@ApiProperty({ example: 'john@doe.com' })
	@IsNotEmpty({ message: 'E-mail should not be empty' })
	email: string;

	@Exclude()
	timestamp: number;

	@Exclude()
	hash: string;

	@ApiProperty({ example: '123456' })
	@IsNotEmpty({ message: 'New password should not be empty' })
	@MinLength(6, { message: 'New password should have at least 6 characters' })
	@MaxLength(64, {
		message: 'New password should have at most 64 characters'
	})
	new_password: string;

	@ApiProperty({ example: '123456' })
	@IsNotEmpty({ message: 'Confirm password should not be empty' })
	@MinLength(6, {
		message: 'Confirm password should have at least 6 characters'
	})
	@MaxLength(64, {
		message: 'Confirm password should have at most 64 characters'
	})
	@EqualsField('new_password', { message: 'Passwords does not match' })
	confirm_password: string;
}
