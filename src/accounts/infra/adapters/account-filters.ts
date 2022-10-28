import { ApiPropertyOptional } from '@nestjs/swagger';
import { FindOptionsOrder } from 'typeorm';
import { Accounts } from '@/accounts/domain';
import { Pagination } from '@/shared/infra/adapters/pagination';

export class AccountFilters extends Pagination<
	Accounts.Model,
	Accounts.Relations
> {
	@ApiPropertyOptional({
		example: 'user,wallets',
		description: 'Comma separated relations',
		type: 'string'
	})
	relations?: Accounts.Relations[];

	@ApiPropertyOptional({
		example:
			'id,name,bank_id,bank_name,initial_amount,current_amount,created_at',
		description: 'Fields will return only selected fields',
		type: 'string'
	})
	fields?: (keyof Accounts.Model)[];

	@ApiPropertyOptional({
		example: 'created_at,desc',
		description:
			'How you want sort fields. If only field present, default sort is DESC',
		type: 'string'
	})
	sort?: FindOptionsOrder<Accounts.Model>;
}
