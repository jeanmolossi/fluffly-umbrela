import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Account, Accounts } from '@/accounts/domain';
import { ConflictErr } from '@/shared/domain/http-errors';
import { User } from '@/users/domain';
import { AddAccount } from '../adapters/add-account';
import { AccountDTO } from '../dto/account.dto';
import { CreateAccountRepository } from '../repositories/create.repository';
import { FindOneAccountRepository } from '../repositories/find-one.repository';

@Injectable()
export class AddAccountService {
	constructor(
		@Inject(CreateAccountRepository)
		private readonly create: Accounts.CreateRepository,
		@Inject(FindOneAccountRepository)
		private readonly findOne: Accounts.FindOneRepository
	) {}

	async run(add_account: AddAccount): Promise<AccountDTO> {
		const account_already_exists = await this.account_already_exists(
			add_account
		);

		if (account_already_exists)
			throw new ConflictErr('Account already exists');

		const account = new Account({
			...add_account,
			user: { id: add_account.user_id } as User
		});
		const created_account = await this.create.run(account);

		return plainToClass(AccountDTO, created_account);
	}

	private async account_already_exists({
		name,
		user_id
	}: AddAccount): Promise<boolean> {
		const isset_account = await this.findOne.run({
			name,
			user: { id: user_id } as User
		});
		return Boolean(isset_account?.id);
	}
}
