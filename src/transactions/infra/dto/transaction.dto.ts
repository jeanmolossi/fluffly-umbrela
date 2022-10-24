import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import constants from '@/shared/shared.constants';
import { Transactions } from '@/transactions/domain';

const self_example = (id: string) =>
	`${constants.BASE_HOST}/transactions/${id}`;

@Exclude()
export class TransactionDTO {
	@Expose()
	@ApiProperty({ example: '10f843c1-a49a-48d5-b50a-dd94e65a1e2a' })
	id: string;

	@Expose()
	@ApiProperty({ example: '973ab597-04a2-4484-91af-baf57dcaf737' })
	wallet_id: string;

	@Expose()
	@ApiProperty({ example: '973ab597-04a2-4484-91af-baf57dcaf737' })
	category_id: string;

	@Expose()
	@ApiProperty({ example: 'cd9746b9-9b99-4b91-a0ea-1c75f15a76be' })
	user_id: string;

	@Expose()
	@ApiProperty({ example: 'Capitão do Hamburguer' })
	reference: string;

	@Expose()
	@ApiProperty({ example: 11286 })
	value: number;

	@Expose()
	@ApiProperty({ example: 'R$ 112,86' })
	value_fmt: string;

	@Expose()
	@ApiProperty({ example: Transactions.Type.EXPENSE })
	type?: Transactions.Type;

	@Expose()
	@ApiProperty({ example: new Date(2022, 1, 1) })
	created_at?: Date;

	@Expose()
	@ApiProperty({ example: new Date(2022, 1, 1) })
	updated_at?: Date;

	@Expose()
	@Transform(({ obj }) => self_example(obj.id))
	@ApiProperty({
		example: self_example('10f843c1-a49a-48d5-b50a-dd94e65a1e2a')
	})
	_self: string;
}
