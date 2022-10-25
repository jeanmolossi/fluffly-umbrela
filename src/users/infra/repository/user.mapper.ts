import { arrayModelToDomain as accountArrayModelToDomain } from '@/accounts/infra/repositories/account.mapper';
import { arrayModelToDomain as categoryArrayModelToDomain } from '@/categories/infra/repositories/category.mapper';
import { arrayModelToDomain as transactionArrayModelToDomain } from '@/transactions/infra/repositories/transactions.mapper';
import { User } from '@/users/domain';
import { UserModel } from './user.entity';

export function modelToDomain(user: UserModel): User {
	if (!user?.id) return;

	const {
		id,
		name,
		email,
		password,
		avatar,
		accounts,
		categories,
		transactions,
		created_at,
		updated_at
	} = user;

	return new User({
		id,
		name,
		email,
		password,
		avatar,
		accounts: accountArrayModelToDomain(accounts),
		categories: categoryArrayModelToDomain(categories),
		transactions: transactionArrayModelToDomain(transactions),
		created_at,
		updated_at
	});
}

export function arrayModelToDomain(users: UserModel[]): User[] {
	return users.map(modelToDomain);
}
