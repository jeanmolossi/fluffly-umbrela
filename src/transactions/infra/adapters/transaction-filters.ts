import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { KeysOf } from '@/shared/infra/repositories/base.filters';
import { Transactions } from '@/transactions/domain';

export class TransactionFilters
	extends Pagination<Transactions.Model>
	implements Transactions.Filters
{
	@IsOptional({ message: 'Wallet optional value' })
	@IsUUID('4', { message: 'Wallet reference should be a valid id' })
	@ApiPropertyOptional({ example: '05d19b66-0acd-4b10-8370-3d3f5c1b9105' })
	wallet?: string;

	@IsOptional({ message: 'Account optional value' })
	@IsUUID('4', { message: 'Account reference should be a valid id' })
	@ApiPropertyOptional({ example: '00e3d393-5f82-420a-a9ab-cf92a48d1c26' })
	account?: string;

	@IsOptional({ message: 'Category optional value' })
	@IsUUID('4', { message: 'Category reference should be a valid id' })
	@ApiPropertyOptional({ example: '73f2c724-fd47-4e92-b95c-e4f591d4be95' })
	category?: string;

	@IsOptional()
	@ApiPropertyOptional({
		example: 'user,wallet',
		type: 'string',
		description:
			'Comma separated relations. Accepted values [user wallet category]'
	})
	relations?: Transactions.Relations[];

	@IsOptional()
	@ApiPropertyOptional({
		example: 'id,reference',
		type: 'string',
		description: 'Fields will return only selected fields'
	})
	fields?: KeysOf<Transactions.Model>[];

	@IsOptional()
	@ApiPropertyOptional({ example: 'reference,ASC' })
	sort?: FindOptionsOrder<Transactions.Model>;
}
