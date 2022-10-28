import { ApiPropertyOptional } from '@nestjs/swagger';
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
	@ApiPropertyOptional({ example: '10f843c1-a49a-48d5-b50a-dd94e65a1e2a' })
	id?: string;

	@Expose()
	@ApiPropertyOptional({ type: PaymentDTO })
	@Transform(({ value }) => plainToClass(PaymentDTO, value))
	wallet?: PaymentDTO;

	@Expose()
	@ApiPropertyOptional({ type: () => CategoryDTO })
	@Transform(({ value }) => plainToClass(CategoryDTO, value))
	category?: CategoryDTO;

	@Expose()
	@ApiPropertyOptional({ type: UserDTO })
	@Transform(({ value }) => plainToClass(UserDTO, value))
	user?: UserDTO;

	@Expose()
	@ApiPropertyOptional({ example: 'Capitão do Hamburguer' })
	reference?: string;

	@Expose()
	@ApiPropertyOptional({ example: 11286 })
	value?: number;

	@Expose()
	@ApiPropertyOptional({ example: 'R$ 112,86' })
	value_fmt?: string;

	@Expose()
	@ApiPropertyOptional({ example: Transactions.Type.EXPENSE })
	type?: Transactions.Type;

	@Expose()
	@ApiPropertyOptional({ example: new Date(2022, 1, 1) })
	created_at?: Date;

	@Expose()
	@ApiPropertyOptional({ example: new Date(2022, 1, 1) })
	updated_at?: Date;

	@Expose()
	@Transform(({ obj }) => self_example(obj.id))
	@ApiPropertyOptional({
		example: self_example('10f843c1-a49a-48d5-b50a-dd94e65a1e2a')
	})
	_self?: string;
}
