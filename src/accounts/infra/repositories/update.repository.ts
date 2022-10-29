import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Accounts } from '@/accounts/domain';
import { AccountModel } from './account.entity';
import { modelToDomain } from './account.mapper';

@Injectable()
export class UpdateAccountRepository implements Accounts.UpdateRepository {
	constructor(
		@InjectRepository(AccountModel)
		private readonly repository: Repository<AccountModel>
	) {}

	async run(account_id: string, cb: Accounts.Updater): Promise<Account> {
		const account = await this.repository.findOneBy({ id: account_id });

		const updated_account = cb(modelToDomain(account));

		const orm_account = this.repository.create(updated_account);
		const saved_account = await this.repository.save(orm_account);

		return modelToDomain(saved_account);
	}
}
