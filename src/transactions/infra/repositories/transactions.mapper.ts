import { modelToDomain as categoryModelToDomain } from '@/categories/infra/repositories/category.mapper';
import { modelToDomain as walletModelToDomain } from '@/payments/infra/repositories/payment.mapper';
import { Transaction, Transactions } from '@/transactions/domain';
import { modelToDomain as userModelToDomain } from '@/users/infra/repository/user.mapper';
import { TransactionModel } from './transactions.entity';

export function modelToDomain(transaction: TransactionModel): Transaction {
	if (!transaction?.id) return;

	const {
		id,
		wallet,
		category,
		user,
		reference,
		type = Transactions.Type.EXPENSE,
		value,
		created_at,
		updated_at
	} = transaction;

	return new Transaction({
		id,
		wallet: walletModelToDomain(wallet),
		category: categoryModelToDomain(category),
		user: userModelToDomain(user),
		reference,
		type,
		value,
		created_at,
		updated_at
	});
}

export function arrayModelToDomain(
	transactions: TransactionModel[] = []
): Transaction[] {
	return transactions.map(modelToDomain);
}
