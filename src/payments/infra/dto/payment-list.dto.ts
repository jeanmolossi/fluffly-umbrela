import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaymentDTO } from './payment.dto';

const link_example = (page = 1) =>
	`http://example.com/payments?page=${page}&per_page=15`;

class MetaDTO {
	@Expose()
	@ApiProperty({ example: 60 })
	total: number;

	@Expose()
	@ApiProperty({ example: 2, default: 1 })
	page: number;

	@Expose()
	@ApiProperty({ example: 15, default: 15 })
	per_page: number;

	@Expose()
	@ApiPropertyOptional({ example: link_example(1) })
	first_page?: string;

	@Expose()
	@ApiPropertyOptional({ example: link_example(3) })
	next_page?: string;

	@Expose()
	@ApiPropertyOptional({ example: link_example(1) })
	prev_page?: string;

	@Expose()
	@ApiPropertyOptional({ example: link_example(4) })
	last_page?: string;
}

@Exclude()
export class PaymentListDTO {
	@Expose()
	@ApiProperty({ type: PaymentDTO, isArray: true })
	payments: PaymentDTO[];

	@Expose()
	@ApiProperty({ type: MetaDTO })
	meta: MetaDTO;
}
