import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { FindOptionsOrder } from 'typeorm';
import { Payment } from '@/payments/domain';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { KeysOf } from '@/shared/infra/repositories/base.filters';

export class WalletFilters
	extends Pagination<Payment.Model>
	implements Payment.Filters
{
	@IsOptional({ message: 'Account optional value' })
	@IsUUID('4', { message: 'Account reference should be a valid id' })
	@ApiPropertyOptional({ example: '00e3d393-5f82-420a-a9ab-cf92a48d1c26' })
	account?: string;

	@IsOptional()
	@ApiPropertyOptional({
		example: 'account,user',
		type: 'string',
		description: 'Comma separated relations. Accepted values [user account]'
	})
	relations?: Payment.Relations[];

	@IsOptional()
	@ApiPropertyOptional({
		example: 'id,name,type',
		type: 'string',
		description: 'Fields will return only selected fields'
	})
	fields?: KeysOf<Payment.Model>[];

	@IsOptional()
	@ApiPropertyOptional({ example: 'created_at,DESC' })
	sort?: FindOptionsOrder<Payment.Model>;
}
