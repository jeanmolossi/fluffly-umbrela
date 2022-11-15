import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID
} from 'class-validator';
import { Payment } from '@/payments/domain';

export class AddWallet {
	@ApiProperty({ example: 'Elo Bradesco 0005' })
	@IsNotEmpty({ message: 'Name should not be empty' })
	name: string;

	@Exclude()
	user_id: string;

	@ApiProperty({ example: '85477275-4cf8-4ba4-ae39-9fb864b73914' })
	@IsUUID('4')
	account_id: string;

	@ApiProperty({
		example: Payment.Type.CASH,
		default: Payment.Type.CASH,
		required: false
	})
	@IsNotEmpty({ message: 'Name should not be empty' })
	@IsEnum(Payment.Type, {
		message: 'Type should be one of CASH, DEBIT, CREDIT'
	})
	type: Payment.Type;

	@ApiPropertyOptional({
		example: 1131034,
		description: 'Limit example value represents R$ 11.310,34'
	})
	@IsNumber(
		{ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
		{ message: 'Limit should be a integer value (in cents)' }
	)
	@IsOptional()
	limit: number;

	@ApiPropertyOptional({ example: Payment.Brand.ELO })
	@IsEnum(Payment.Brand, { message: 'Brand should be valid' })
	@IsOptional()
	brand: Payment.Brand = null;
}
