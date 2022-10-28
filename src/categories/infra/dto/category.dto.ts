import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import constants from '@/shared/shared.constants';
import { TransactionDTO } from '@/transactions/infra/dto/transaction.dto';
import { UserDTO } from '@/users/infra/dto/user.dto';

const self_example = (id: string) => `${constants.BASE_HOST}/categories/${id}`;

@Exclude()
export class CategoryDTO {
	@Expose()
	@ApiProperty({ example: '10f843c1-a49a-48d5-b50a-dd94e65a1e2a' })
	id: string;

	@Expose()
	@ApiPropertyOptional({ type: () => UserDTO })
	@Transform(({ value }) => plainToClass(UserDTO, value))
	user?: UserDTO;

	@Expose()
	@ApiPropertyOptional({ type: () => CategoryDTO })
	@Transform(({ value }) => plainToClass(CategoryDTO, value))
	parent?: CategoryDTO;

	@Expose()
	@ApiPropertyOptional({ type: () => CategoryDTO, isArray: true })
	@Transform(({ value }) => value?.map(v => plainToClass(CategoryDTO, v)))
	sub_categories?: CategoryDTO[];

	@Expose()
	@ApiPropertyOptional({ example: 'Transporte' })
	name?: string;

	@Expose()
	@ApiPropertyOptional({ type: () => TransactionDTO, isArray: true })
	@Transform(({ value }) => value?.map(v => plainToClass(TransactionDTO, v)))
	transactions?: TransactionDTO[];

	@Expose()
	@ApiPropertyOptional({ example: new Date(2022, 1, 1) })
	created_at?: Date;

	@Expose()
	@ApiPropertyOptional({ example: new Date(2022, 1, 1) })
	updated_at?: Date;

	@Expose()
	@Transform(({ obj }) => self_example(obj.id))
	@ApiProperty({
		example: self_example('10f843c1-a49a-48d5-b50a-dd94e65a1e2a')
	})
	_self: string;
}
