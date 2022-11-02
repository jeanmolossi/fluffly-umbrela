import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Accounts } from '@/accounts/domain';
import { AccountModel } from './account.entity';
import { AccountMapper } from './account.mapper';

@Injectable()
export class CreateAccountRepository implements Accounts.CreateRepository {
	constructor(
		@InjectRepository(AccountModel)
		private readonly accountsRepository: Repository<AccountModel>
	) {}

	async run(account: Account): Promise<Account> {
		const orm_account = this.accountsRepository.create(account);
		const saved_account = await this.accountsRepository.save(orm_account);
		return AccountMapper.modelToDomain(saved_account);
	}
}
