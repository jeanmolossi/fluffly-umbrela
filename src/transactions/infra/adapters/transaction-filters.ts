import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsDateString,
	IsNumber,
	IsOptional,
	IsUUID,
	Max,
	Min
} from 'class-validator';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { Transactions } from '@/transactions/domain';

export class TransactionFilters
	extends Pagination
	implements Transactions.Filters
{
	@IsOptional({ message: 'Period optional value' })
	@IsNumber({}, { message: 'Should be a valid number' })
	@ApiPropertyOptional({ example: '1', maximum: 4, minimum: 1 })
	@Max(4, { message: 'Period should be one of [1 2 3 4]' })
	@Min(1, { message: 'Period should be one of [1 2 3 4]' })
	@Type(() => Number)
	period?: number;

	@IsOptional({ message: 'Start date optional value' })
	@IsDateString({}, { message: 'Start date should be date ISO string' })
	@ApiPropertyOptional({ format: 'date-string' })
	@Type(() => Date)
	start_date?: Date;

	@IsOptional({ message: 'End date optional value' })
	@IsDateString({}, { message: 'End date should be date ISO string' })
	@ApiPropertyOptional({ format: 'date-string' })
	@Type(() => Date)
	end_date?: Date;

	@IsOptional({ message: 'Wallet optional value' })
	@IsUUID('4', { message: 'Wallet reference should be a valid id' })
	@ApiPropertyOptional({ example: '05d19b66-0acd-4b10-8370-3d3f5c1b9105' })
	wallet?: string;

	@IsOptional({ message: 'Account optional value' })
	@IsUUID('4', { message: 'Account reference should be a valid id' })
	@ApiPropertyOptional({ example: '00e3d393-5f82-420a-a9ab-cf92a48d1c26' })
	account?: string;

	@IsOptional()
	@Transform(({ value }) => value?.split(','))
	@ApiPropertyOptional({
		example: 'user,wallet',
		type: 'string',
		description:
			'Comma separated relations. Accepted values [user wallet category]'
	})
	relations?: Transactions.Relations[];
}