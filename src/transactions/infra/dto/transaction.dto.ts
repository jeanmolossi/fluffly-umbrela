import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { CategoryDTO } from '@/categories/infra/dto/category.dto';
import { PaymentDTO } from '@/payments/infra/dto/payment.dto';
import constants from '@/shared/shared.constants';
import { Transactions } from '@/transactions/domain';
import { UserDTO } from '@/users/infra/dto/user.dto';

const self_example = (id: string) =>
	`${constants.BASE_HOST}/transactions/${id}`;

@Exclude()
export class TransactionDTO {
	@Expose()
	@ApiProperty({ example: '10f843c1-a49a-48d5-b50a-dd94e65a1e2a' })
	id: string;

	@Expose()
	@ApiPropertyOptional({ type: PaymentDTO })
	@Transform(({ obj }) => plainToClass(PaymentDTO, obj.wallet))
	wallet?: PaymentDTO;

	@Expose()
	@ApiPropertyOptional({ type: CategoryDTO })
	@Transform(({ obj }) => plainToClass(CategoryDTO, obj.category))
	category?: CategoryDTO;

	@Expose()
	@ApiPropertyOptional({ type: UserDTO })
	@Transform(({ obj }) => plainToClass(UserDTO, obj.user))
	user?: UserDTO;

	@Expose()
	@ApiProperty({ example: '85477275-4cf8-4ba4-ae39-9fb864b73914' })
	account_id: string;

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
