import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID
} from 'class-validator';
import { randomUUID } from 'crypto';
import { Transactions } from '@/transactions/domain/transaction/namespace';

export class AddTransaction {
	@ApiProperty({ example: 'Capitão do Hamburguer' })
	@IsNotEmpty({ message: 'Reference should be provided' })
	reference: string;

	@IsUUID('4', { message: 'You should choose a wallet to this transaction' })
	@ApiProperty({ example: randomUUID() })
	wallet_id: string;

	@IsUUID('4', {
		message: 'You should choose a category to this transaction'
	})
	@ApiProperty({ example: randomUUID() })
	category_id: string;

	@Exclude()
	user_id: string;

	@IsOptional()
	@IsEnum(Transactions.Type, {
		message: 'You should provide a valid value to type'
	})
	@ApiPropertyOptional({
		default: Transactions.Type.EXPENSE,
		example: Transactions.Type.EXPENSE
	})
	type: Transactions.Type;

	@IsNumber(
		{ allowNaN: false, maxDecimalPlaces: 0, allowInfinity: false },
		{ message: 'You should provide de transaction value (in cents)' }
	)
	@ApiProperty({
		example: 1999,
		description: 'That value should be in cents'
	})
	value: number;
}
