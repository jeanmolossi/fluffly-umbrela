import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { get_pages } from '@/shared/helpers/get-pages';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { User } from '@/users/domain';
import { TransactionFilters } from '../adapters/transaction-filters';
import { TransactionListDTO } from '../dto/transaction-list.dto';
import { TransactionDTO } from '../dto/transaction.dto';
import { FindTransactionRepository } from '../repositories/find.repository';

@Injectable()
export class GetMyTransactionsService {
	constructor(
		@Inject(FindTransactionRepository)
		private readonly find: Transactions.FindRepository
	) {}

	async run(user: User, filters: TransactionFilters) {
		const where = this.parse_filters(user, filters);

		const { transactions, total } = await this.find.run(where, filters);

		return plainToClass(TransactionListDTO, {
			transactions: this.get_transactions_dto(transactions),
			meta: get_pages('transactions', total, filters)
		});
	}

	private parse_filters(
		user: User,
		filters: TransactionFilters
	): Partial<Transactions.Model> {
		const {
			wallet: wallet_id,
			account: account_id,
			category: category_id
		} = filters;

		type Where = Pick<Transactions.Model, 'user' | 'wallet' | 'category'>;
		const where: Where = { user: { id: user.id } };

		if (wallet_id) {
			const wallet = { wallet: { id: wallet_id } };
			Object.assign(where, wallet);
		}

		if (account_id) {
			const account = {
				wallet: {
					id: where.wallet?.id,
					account: { id: account_id }
				}
			};

			Object.assign(where, account);
		}

		if (category_id) {
			const category = { category: { id: category_id } };
			Object.assign(where, category);
		}

		return where;
	}

	private get_transactions_dto(
		transactions: Transaction[]
	): TransactionDTO[] {
		const apply = (transaction: Transaction) =>
			plainToClass(TransactionDTO, transaction);

		return transactions.map(apply);
	}
}
