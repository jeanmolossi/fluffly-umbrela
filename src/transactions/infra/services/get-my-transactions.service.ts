import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { get_pages } from '@/shared/helpers/get-pages';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { User } from '@/users/domain';
import { TransactionListDTO } from '../dto/transaction-list.dto';
import { TransactionDTO } from '../dto/transaction.dto';
import { FindTransactionRepository } from '../repositories/find.repository';

@Injectable()
export class GetMyTransactionsService {
	constructor(
		@Inject(FindTransactionRepository)
		private readonly find: Transactions.FindRepository
	) {}

	async run(user: User, { page, per_page }: Pagination) {
		const { transactions, total } = await this.find.run(
			{ user_id: user.id },
			page,
			per_page
		);

		return plainToClass(TransactionListDTO, {
			transactions: this.get_transactions_dto(transactions),
			meta: get_pages('transactions', total, page, per_page)
		});
	}

	private get_transactions_dto(
		transactions: Transaction[]
	): TransactionDTO[] {
		const apply = (transaction: Transaction) =>
			plainToClass(TransactionDTO, transaction);

		return transactions.map(apply);
	}
}
