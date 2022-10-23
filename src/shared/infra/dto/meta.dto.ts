import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

const link_example = (page = 1) =>
	`http://example.com/resource?page=${page}&per_page=15`;

export class MetaDTO {
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
