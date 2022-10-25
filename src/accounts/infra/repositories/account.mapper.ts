import { Account } from '@/accounts/domain';
import { AccountModel } from './account.entity';

export function modelToDomain(account: AccountModel): Account {
	if (!account?.id) return null;
	return new Account(account);
}

export function arrayModelToDomain(accounts: AccountModel[] = []): Account[] {
	return accounts.map(modelToDomain);
}
