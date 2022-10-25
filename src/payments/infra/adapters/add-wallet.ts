import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
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

	@ApiProperty({
		example: 1131034,
		description: 'Limit example value represents R$ 11.310,34'
	})
	@IsNotEmpty({ message: 'Name should not be empty' })
	@IsNumber(
		{ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
		{ message: 'Limit should be a integer value (in cents)' }
	)
	limit: number;

	@ApiProperty({ example: Payment.Brand.ELO })
	@IsNotEmpty({ message: 'Name should not be empty' })
	@IsEnum(Payment.Brand, { message: 'Brand should be valid' })
	brand: Payment.Brand;
}
