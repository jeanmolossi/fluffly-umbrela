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
}
