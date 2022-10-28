import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Accounts } from '@/accounts/domain';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { BaseRepository } from '@/shared/infra/repositories/base.repository';
import { AccountModel } from './account.entity';
import { arrayModelToDomain } from './account.mapper';

@Injectable()
export class FindAccountRepository
	extends BaseRepository
	implements Accounts.FindRepository
{
	constructor(
		@InjectRepository(AccountModel)
		private readonly accountsRepository: Repository<AccountModel>
	) {
		super();
	}

	async run(
		filter: Partial<Accounts.Model>,
		filters: BaseFilters<Accounts.Model>
	): Promise<{ accounts: Account[]; total: number }> {
		const where = this.options<AccountModel>(filter, filters);

		const [accounts, total] = await this.accountsRepository.findAndCount({
			...where,
			cache: {
				id: `accounts-${filter.user?.id}`,
				milliseconds: 1000 * 60 * 5 // 5 minutes
			}
		});

		return { accounts: arrayModelToDomain(accounts), total };
	}
}
