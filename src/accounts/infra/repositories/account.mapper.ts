import { Account } from '@/accounts/domain';
import { PaymentMapper } from '@/payments/infra/repositories/payment.mapper';
import { UserMapper } from '@/users/infra/repository/user.mapper';
import { AccountModel } from './account.entity';

export class AccountMapper {
	static modelToDomain(account: AccountModel): Account {
		if (!account?.id) return;

		const {
			id,
			name,
			user,
			wallets,
			bank_id,
			bank_name,
			current_amount,
			initial_amount,
			created_at,
			updated_at
		} = account;

		return new Account({
			id,
			name,
			user: UserMapper.modelToDomain(user),
			wallets: PaymentMapper.arrayModelToDomain(wallets),
			bank_id,
			bank_name,
			current_amount,
			initial_amount,
			created_at,
			updated_at
		});
	}

	static arrayModelToDomain(accounts: AccountModel[]): Account[] {
		return accounts?.map(this.modelToDomain);
	}

	static domainToModel(account: Account): AccountModel {
		const to_props: AccountModel = {
			id: account.id,
			name: account.name,
			bank_id: account.bank_id,
			bank_name: account.bank_name,
			initial_amount: account.initial_amount,
			current_amount: account.current_amount,
			user: account.user
		};

		return Object.assign(new AccountModel(), to_props);
	}
}
