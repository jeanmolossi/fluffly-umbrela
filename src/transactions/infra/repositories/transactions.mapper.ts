import { Transaction } from '@/transactions/domain';
import { TransactionModel } from './transactions.entity';

export function modelToDomain(transaction: TransactionModel): Transaction {
	const {
		id,
		wallet_id,
		category_id,
		user_id,
		reference,
		type,
		value,
		created_at,
		updated_at
	} = transaction;

	return new Transaction({
		id,
		wallet_id,
		category_id,
		user_id,
		reference,
		type,
		value,
		created_at,
		updated_at
	});
}

export function arrayModelToDomain(
	transactions: TransactionModel[]
): Transaction[] {
	return transactions.map(modelToDomain);
}
