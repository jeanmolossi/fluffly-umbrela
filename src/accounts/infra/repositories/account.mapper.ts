import { Account } from '@/accounts/domain';
import { arrayModelToDomain as walletArrayModelToDomain } from '@/payments/infra/repositories/payment.mapper';
import { modelToDomain as userModelToDomain } from '@/users/infra/repository/user.mapper';
import { AccountModel } from './account.entity';

export function modelToDomain(account: AccountModel): Account {
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
		user: userModelToDomain(user),
		wallets: walletArrayModelToDomain(wallets),
		bank_id,
		bank_name,
		current_amount,
		initial_amount,
		created_at,
		updated_at
	});
}

export function arrayModelToDomain(accounts: AccountModel[]): Account[] {
	return accounts?.map(modelToDomain);
}
