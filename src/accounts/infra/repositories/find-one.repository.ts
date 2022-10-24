import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Accounts } from '@/accounts/domain';
import { AccountModel } from './account.entity';
import { modelToDomain } from './account.mapper';

@Injectable()
export class FindOneAccountRepository implements Accounts.FindOneRepository {
	constructor(
		@InjectRepository(AccountModel)
		private readonly accountsRepository: Repository<AccountModel>
	) {}

	async run(filter: Partial<Accounts.Model>): Promise<Account> {
		const account_found = await this.accountsRepository.findOneBy(filter);

		if (!account_found) return null;

		return modelToDomain(account_found);
	}
}
