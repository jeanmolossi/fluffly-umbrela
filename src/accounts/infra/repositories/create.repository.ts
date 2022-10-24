import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Accounts } from '@/accounts/domain';
import { AccountModel } from './account.entity';

@Injectable()
export class CreateAccountRepository implements Accounts.CreateRepository {
	constructor(
		@InjectRepository(AccountModel)
		private readonly accountsRepository: Repository<AccountModel>
	) {}

	async run(add_account: Accounts.Model): Promise<Account> {
		throw new Error('Method not implemented.');
	}
}
