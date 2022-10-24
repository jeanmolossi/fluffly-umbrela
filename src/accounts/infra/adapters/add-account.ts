import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Accounts } from '@/accounts/domain';

export class AddAccount implements Accounts.Model {
	@Exclude()
	user_id: string;

	@IsNotEmpty({ message: 'Account name should not be empty' })
	@ApiProperty({ example: 'Carteira' })
	name: string;

	@IsOptional()
	@IsNumber(
		{ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
		{ message: 'Initial amount should be a valid number' }
	)
	@ApiPropertyOptional({ example: 345989, default: 0 })
	initial_amount?: number;

	@Exclude()
	current_amount?: number;

	@IsOptional()
	@IsNumber(
		{ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
		{ message: 'Bank number should be a number' }
	)
	@ApiPropertyOptional({ example: 343, default: 0 })
	bank_id?: number;

	@IsOptional()
	@IsNotEmpty({ message: 'Bank name should not be empty' })
	@ApiPropertyOptional({ example: 'Carteira' })
	bank_name?: string;
}
