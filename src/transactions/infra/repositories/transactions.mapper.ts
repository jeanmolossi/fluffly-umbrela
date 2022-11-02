import { CategoryMapper } from '@/categories/infra/repositories/category.mapper';
import { PaymentMapper } from '@/payments/infra/repositories/payment.mapper';
import { Transaction } from '@/transactions/domain';
import { UserMapper } from '@/users/infra/repository/user.mapper';
import { TransactionModel } from './transactions.entity';

export class TransactionMapper {
	static modelToDomain(transaction: TransactionModel): Transaction {
		if (!transaction?.id) return;

		const {
			id,
			wallet,
			category,
			user,
			reference,
			type,
			value,
			created_at,
			updated_at
		} = transaction;

		return new Transaction({
			id,
			wallet: PaymentMapper.modelToDomain(wallet),
			category: CategoryMapper.modelToDomain(category),
			user: UserMapper.modelToDomain(user),
			reference,
			type,
			value,
			created_at,
			updated_at
		});
	}

	static arrayModelToDomain(transactions: TransactionModel[]): Transaction[] {
		return transactions?.map(this.modelToDomain);
	}
}
