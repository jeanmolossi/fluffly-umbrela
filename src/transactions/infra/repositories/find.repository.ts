import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@/shared/infra/repositories/base.repository';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { TransactionModel } from './transactions.entity';
import { arrayModelToDomain } from './transactions.mapper';

@Injectable()
export class FindTransactionRepository
	extends BaseRepository
	implements Transactions.FindRepository
{
	constructor(
		@InjectRepository(TransactionModel)
		private readonly transactionsRepository: Repository<TransactionModel>
	) {
		super();
	}

	async run(
		filter: Partial<Transactions.Model>,
		filters: Transactions.Filters
	): Promise<{ transactions: Transaction[]; total: number }> {
		const where_options = this.options<TransactionModel>(filter, filters);

		const [transactions, total] =
			await this.transactionsRepository.findAndCount({
				...where_options,
				cache: {
					id: `transactions-${filter.user.id}`,
					milliseconds: 1000 * 60 * 5
				}
			});

		return {
			transactions: arrayModelToDomain(transactions || []),
			total
		};
	}
}
