import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { BaseFilters, KeysOf } from '../repositories/base.filters';

export abstract class Pagination<Fields extends object = {}, T = string>
	implements BaseFilters<Fields, T>
{
	@ApiPropertyOptional({ example: '1', default: '1' })
	@Type(() => Number)
	page?: number;

	@ApiPropertyOptional({ example: '15', default: '15' })
	@Type(() => Number)
	per_page?: number;

	@IsOptional({ message: 'Start date optional value' })
	@IsDate({ message: 'Start date should be date ISO string' })
	@ApiPropertyOptional({ format: 'date-string' })
	@Type(() => Date)
	start_date?: Date;

	@IsOptional({ message: 'End date optional value' })
	@IsDate({ message: 'End date should be date ISO string' })
	@ApiPropertyOptional({ format: 'date-string' })
	@Type(() => Date)
	end_date?: Date;

	@IsOptional()
	@Transform(({ value }) => value?.split(','))
	@ApiPropertyOptional({
		example: 'relation_1,relation_2',
		description: 'Comma separated relations',
		type: 'string'
	})
	abstract relations?: T[];

	@IsOptional()
	@Transform(({ value }) => value?.split(','))
	@ApiPropertyOptional({
		example: 'field,another_field',
		description: 'Fields will return only selected fields',
		type: 'string'
	})
	abstract fields?: KeysOf<Fields>[];

	@IsOptional()
	@Transform(parse_sort)
	@ApiPropertyOptional({
		example: 'field,asc',
		description:
			'How you want sort fields. If only field present, default sort is DESC',
		type: 'string'
	})
	abstract sort?: FindOptionsOrder<Fields>;
}

function parse_sort({ value }) {
	const [field, sort] = value?.split(',');

	if (field && !sort) {
		return { [field]: 'DESC' };
	}

	if (field && sort) {
		return { [field]: sort.toUpperCase() };
	}

	return;
}
