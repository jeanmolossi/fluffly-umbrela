import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Accounts } from '@/accounts/domain';
import { AccountModel } from './account.entity';
import { arrayModelToDomain } from './account.mapper';

@Injectable()
export class FindAccountRepository implements Accounts.FindRepository {
	constructor(
		@InjectRepository(AccountModel)
		private readonly accountsRepository: Repository<AccountModel>
	) {}

	async run(
		filter: Partial<Accounts.Model>,
		page?: number,
		per_page?: number
	): Promise<{ accounts: Account[]; total: number }> {
		const [accounts, total] = await this.accountsRepository.findAndCount({
			where: filter,
			take: per_page,
			skip: this.offset(page, per_page)
		});

		return { accounts: arrayModelToDomain(accounts), total };
	}

	private offset(page: number = 1, per_page: number = 15): number {
		return (page - 1) * per_page;
	}
}
