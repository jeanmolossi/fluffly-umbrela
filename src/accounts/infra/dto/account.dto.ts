import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { randomUUID } from 'crypto';

@Exclude()
export class AccountDTO {
	@Expose()
	@ApiProperty({ example: randomUUID() })
	id: string;

	@Expose()
	@ApiProperty({ example: '11f7c925-2cff-4522-9c75-8f6c288fe722' })
	user_id: string;

	@Expose()
	@ApiProperty({ name: 'Carteira' })
	name: string;

	@Expose()
	@ApiProperty({ example: 34898 })
	initial_amount: number;

	@Expose()
	@ApiProperty({ example: 36898 })
	current_amount: number;

	@Expose()
	@ApiProperty({ example: 0 })
	bank_id: number;

	@Expose()
	@ApiPropertyOptional({ example: 'Carteira' })
	bank_name: string;

	@Expose()
	@ApiProperty({ example: new Date(2022, 1, 1) })
	created_at: Date;

	@Expose()
	@ApiProperty({ example: new Date(2022, 1, 1) })
	updated_at: Date;
}
