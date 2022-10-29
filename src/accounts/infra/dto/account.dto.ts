import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { PaymentDTO } from '@/payments/infra/dto/payment.dto';
import constants from '@/shared/shared.constants';
import { UserDTO } from '@/users/infra/dto/user.dto';

const self_example = (id: string) => `${constants.BASE_HOST}/accounts/${id}`;
const to_brl = (value: number) =>
	new Intl.NumberFormat('pt-BR', {
		currency: 'BRL',
		style: 'currency'
	}).format((value || 0) / 100);

@Exclude()
export class AccountDTO {
	@Expose()
	@ApiProperty({ example: '491d348e-8635-4462-b718-378a5786a40c' })
	id: string;

	@Expose()
	@ApiPropertyOptional({
		type: UserDTO,
		example: '11f7c925-2cff-4522-9c75-8f6c288fe722'
	})
	@Transform(({ value }) => plainToClass(UserDTO, value))
	user?: UserDTO;

	@Expose()
	@ApiPropertyOptional({ type: () => PaymentDTO, isArray: true })
	@Transform(({ value }) => value?.map(v => plainToClass(PaymentDTO, v)))
	wallets?: PaymentDTO[];

	@Expose()
	@ApiProperty({ example: 'Carteira' })
	name: string;

	@Expose()
	@ApiProperty({ example: 34898 })
	initial_amount: number;

	@Expose()
	@ApiProperty({ example: 'R$ 348,98' })
	@Transform(({ obj }) => to_brl(obj.initial_amount))
	initial_amount_fmt: string;

	@Expose()
	@ApiProperty({ example: 36898 })
	current_amount: number;

	@Expose()
	@ApiProperty({ example: 'R$ 368,98' })
	@Transform(({ obj }) => to_brl(obj.current_amount))
	current_amount_fmt: string;

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

	@Expose()
	@Transform(({ obj }) => self_example(obj.id))
	@ApiProperty({
		example: self_example('491d348e-8635-4462-b718-378a5786a40c')
	})
	_self: string;
}
