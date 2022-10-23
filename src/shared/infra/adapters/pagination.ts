import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Pagination {
	@ApiPropertyOptional({ example: '1', default: '1' })
	@Type(() => Number)
	page?: number;

	@ApiPropertyOptional({ example: '15', default: '15' })
	@Type(() => Number)
	per_page?: number;
}
