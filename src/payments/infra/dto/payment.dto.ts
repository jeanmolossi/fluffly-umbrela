import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { AccountDTO } from '@/accounts/infra/dto/account.dto';
import { Payment } from '@/payments/domain';

@Exclude()
export class PaymentDTO {
	@Expose()
	@ApiProperty({ example: '10f843c1-a49a-48d5-b50a-dd94e65a1e2a' })
	id: string;

	@Expose()
	@ApiProperty({ example: 'cd9746b9-9b99-4b91-a0ea-1c75f15a76be' })
	user_id: string;

	@Expose()
	@ApiPropertyOptional({ type: AccountDTO })
	@Transform(({ value }) => plainToClass(AccountDTO, value))
	account?: AccountDTO;

	@Expose()
	@ApiProperty({ example: 'ELO Bradesco 0005' })
	name: string;

	@Expose()
	@ApiProperty({ example: Payment.Type.CREDIT, default: Payment.Type.CASH })
	type: Payment.Type;

	@Expose()
	@ApiProperty({ example: Payment.Brand.ELO })
	brand: Payment.Brand;

	@Expose()
	@ApiProperty({ example: 1134030 })
	limit: number;

	@Expose()
	@Transform(({ obj }) => obj.readable_limit)
	@ApiProperty({ example: 'R$ 11.340,30' })
	readable_limit: string;

	@Expose({ name: '_self' })
	@Transform(({ obj }) => `http://localhost:3000/payments/${obj.id}`)
	@ApiProperty({
		example: `http://localhost:3000/payments/10f843c1-a49a-48d5-b50a-dd94e65a1e2a`
	})
	_self: string;
}
