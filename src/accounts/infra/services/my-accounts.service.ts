import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Account, Accounts } from '@/accounts/domain';
import { get_pages } from '@/shared/helpers/get-pages';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { User } from '@/users/domain';
import { AccountListDTO } from '../dto/account-list.dto';
import { AccountDTO } from '../dto/account.dto';
import { FindAccountRepository } from '../repositories/find.repository';

@Injectable()
export class GetMyAccountsService {
	constructor(
		@Inject(FindAccountRepository)
		private readonly find: Accounts.FindRepository
	) {}

	async run(
		user: User,
		filters: Pagination<Accounts.Model, Accounts.Relations>
	): Promise<AccountListDTO> {
		const { accounts, total } = await this.find.run(
			{ user: { id: user.id } as User },
			filters
		);

		return plainToClass(AccountListDTO, {
			accounts: this.get_accounts_dto(accounts),
			meta: get_pages('accounts', total, filters)
		});
	}

	private get_accounts_dto(accounts: Account[]): AccountDTO[] {
		const apply = (account: Account) => plainToClass(AccountDTO, account);
		return accounts.map(apply);
	}
}
